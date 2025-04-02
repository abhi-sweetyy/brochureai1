// Log the entire request body for debugging
console.log('===== API REQUEST RECEIVED =====');
console.log('templateId:', req.body.templateId);
console.log('placeholders keys:', Object.keys(req.body.placeholders || {}));
console.log('images keys:', Object.keys(req.body.images || {}));
console.log('selectedPages:', JSON.stringify(req.body.selectedPages, null, 2));
console.log('================================');

// After creating the copy of the presentation, add:
// Set permissions to allow anyone with the link to edit
await drive.permissions.create({
  fileId: createdDoc.id,
  requestBody: {
    role: req.body.shareSettings?.role || 'writer',
    type: req.body.shareSettings?.type || 'anyone',
  },
});

// Define page indices in the template (0-based index for array access)
// IMPORTANT: These indices need to be adjusted based on your template's actual structure
// We're adding +1 to each index because the title slide is typically at index 0
const pageIndices = {
  projectOverview: 1,      // Project Overview slide is likely the 2nd slide
  buildingLayout: 2,       // Building Layout is likely the 3rd slide
  description: 3,          // Description is likely the 4th slide
  exteriorPhotos: 4,       // Exterior Photos is likely the 5th slide
  interiorPhotos: 5,       // Interior Photos is likely the 6th slide
  floorPlan: 6,            // Floor Plan is likely the 7th slide
  energyCertificate: 7,    // Energy Certificate is likely the 8th slide
  termsConditions: 8       // Terms & Conditions is likely the 9th slide
};

// Log the selected pages for debugging
console.log('Selected pages received:', req.body.selectedPages);

// Initialize an array for all requests (we'll process them in the right order)
let requests = [];

// STEP 1: HANDLE SLIDE DELETION FIRST
// Process each page type and check if it should be deleted
if (req.body.selectedPages && presentation.data.slides) {
  console.log(`Slide count in presentation: ${presentation.data.slides.length}`);
  
  // Log each slide for debugging
  presentation.data.slides.forEach((slide, index) => {
    const slideTitle = slide.slideProperties?.notesPage?.notesProperties?.speakerNotesObjectId || "Unknown";
    console.log(`Slide ${index}: ID=${slide.objectId}, Title=${slideTitle}`);
  });
  
  // Collect slides to delete (in reverse order to avoid index shifting)
  const slidesToDelete = [];
  
  // Debug each page's status
  Object.entries(req.body.selectedPages).forEach(([pageId, isSelected]) => {
    console.log(`Page ${pageId}: selected=${isSelected}, index=${pageIndices[pageId]}`);
  });
  
  // First do a reality check - do we have enough slides?
  if (presentation.data.slides.length < 9) {
    console.log(`WARNING: Presentation only has ${presentation.data.slides.length} slides, but we expected at least 9`);
  }
  
  // Collect slides to delete
  Object.entries(pageIndices).forEach(([pageId, slideIndex]) => {
    // Only process if the page is explicitly marked as false
    if (req.body.selectedPages[pageId] === false) {
      // Make sure the slide index is valid
      if (slideIndex < presentation.data.slides.length) {
        const slide = presentation.data.slides[slideIndex];
        if (slide && slide.objectId) {
          console.log(`Will delete slide ${slideIndex} (${pageId}) with ID=${slide.objectId}`);
          slidesToDelete.push({
            slideIndex: slideIndex,
            objectId: slide.objectId,
            pageId: pageId
          });
        } else {
          console.log(`WARNING: Cannot find slide object for ${pageId} at index ${slideIndex}`);
        }
      } else {
        console.log(`WARNING: Slide index ${slideIndex} for ${pageId} is out of bounds`);
      }
    }
  });
  
  // Sort slides to delete in descending order (to avoid index shifting issues)
  slidesToDelete.sort((a, b) => b.slideIndex - a.slideIndex);
  
  console.log(`Slides to delete (sorted):`, slidesToDelete.map(s => `${s.pageId}(${s.slideIndex})`));
  
  // Process deletions first, as a separate batch update
  if (slidesToDelete.length > 0) {
    console.log(`Processing ${slidesToDelete.length} slide deletions`);
    
    const deleteRequests = [];
    
    // Create the delete requests
    slidesToDelete.forEach(slide => {
      deleteRequests.push({
        deleteSlide: {
          objectId: slide.objectId
        }
      });
    });
    
    // Execute the deletion batch update first, before doing any other changes
    try {
      console.log(`Executing batch update to delete ${slidesToDelete.length} slides`);
      await slides.presentations.batchUpdate({
        presentationId: createdDoc.data.id,
        requestBody: {
          requests: deleteRequests
        }
      });
      console.log("Slide deletion completed successfully");
      
      // Re-fetch the presentation after deletion to get updated slide IDs
      presentation = await slides.presentations.get({
        presentationId: createdDoc.data.id
      });
      
      console.log(`Updated presentation now has ${presentation.data.slides.length} slides`);
    } catch (error) {
      console.error("Error during slide deletion:", error);
      console.error(error.stack);
      // Inspect the error more closely
      if (error.response) {
        console.error("Error response:", error.response.data);
      }
    }
  }
}

// After slide deletion, now handle replacements
// STEP 2: HANDLE TEXT AND IMAGE REPLACEMENTS

// Create a fresh requests array for text and image replacements
const contentRequests = [];

// Process text replacements if provided
if (req.body.placeholders) {
  const allPlaceholders = [
    'phone_number',
    'email_address',
    'website_name',
    'title',
    'address',
    'shortdescription',
    'price',
    'date_available',
    'name_brokerfirm',
    'descriptionlarge',
    'descriptionextralarge',
    'address_brokerfirm',
  ];

  allPlaceholders.forEach(placeholder => {
    const placeholderValue = req.body.placeholders[placeholder] || '';
    contentRequests.push({
      replaceAllText: {
        containsText: {
          text: `{${placeholder}}`,
          matchCase: true
        },
        replaceText: placeholderValue
      }
    });
  });
}

// Handle image replacements if provided
if (req.body.images && presentation.data.slides) {
  console.log('Processing image replacements');
  console.log('Available images:', Object.keys(req.body.images));
  
  // Create explicit mapping of which images go to which slides
  const imageMapping = {
    // First slide usually has logo (index 0)
    0: ['logo'],
    // Each slide may have specific placeholders
    1: ['image1'], // Project Overview (slide 1)
    2: ['image2'], // Building Layout (slide 2)
    // Descriptions slide may not have images
    4: ['image3', 'image4'], // Exterior Photos (slide 4)
    5: ['image5', 'image6'], // Interior Photos (slide 5)
    6: ['image7'], // Floor Plan (slide 6)
    7: ['image8', 'image9'] // Energy Certificate (slide 7)
  };
  
  // Process each slide with its explicit image mapping
  presentation.data.slides.forEach((slide, slideIndex) => {
    console.log(`Checking slide ${slideIndex} for image placeholders`);
    
    // Show debug info about this slide
    const slideInfo = {
      objectId: slide.objectId,
      hasPageElements: Boolean(slide.pageElements?.length),
      elementCount: slide.pageElements?.length || 0
    };
    console.log(`Slide ${slideIndex} info:`, slideInfo);
    
    // Get mappings for this slide
    const imagesToUse = imageMapping[slideIndex] || [];
    if (imagesToUse.length > 0) {
      console.log(`Slide ${slideIndex} should use images:`, imagesToUse);
    }
    
    const pageElements = slide.pageElements || [];
    
    // Log all placeholders in this slide
    const imagePlaceholders = pageElements.filter(
      el => el.shape?.placeholder?.type === 'PICTURE'
    );
    
    if (imagePlaceholders.length > 0) {
      console.log(`Slide ${slideIndex} has ${imagePlaceholders.length} image placeholders`);
      imagePlaceholders.forEach((element, i) => {
        console.log(`  Placeholder ${i}: index=${element.shape.placeholder.index}`);
      });
    }
    
    // Process each element in the slide
    pageElements.forEach((element, elementIndex) => {
      if (element.shape?.placeholder?.type === 'PICTURE' && 
          element.shape.placeholder.index !== null && 
          element.shape.placeholder.index !== undefined) {
        
        const placeholderIndex = element.shape.placeholder.index;
        console.log(`Found image placeholder at slide ${slideIndex}, element ${elementIndex}, placeholder index ${placeholderIndex}`);
        
        // Try to find a matching image for this slide and placeholder
        let imageKey = null;
        
        // First try the explicit mapping for this slide
        if (imagesToUse.length > 0) {
          // Use elementIndex to determine which image from our mapping to use
          // This handles multiple placeholders on the same slide
          const mappedKey = imagesToUse[Math.min(elementIndex, imagesToUse.length - 1)];
          if (mappedKey && req.body.images[mappedKey]) {
            imageKey = mappedKey;
            console.log(`Using mapped image ${imageKey} for slide ${slideIndex}, element ${elementIndex}`);
          }
        }
        
        // If no match from explicit mapping, try different naming patterns
        if (!imageKey) {
          const possibleKeys = [
            `image${placeholderIndex}`,
            `image${placeholderIndex + 1}`,
            `logo`,
            `agent`
          ];
          
          imageKey = possibleKeys.find(key => req.body.images[key]);
          if (imageKey) {
            console.log(`Using fallback image ${imageKey} for slide ${slideIndex}, element ${elementIndex}`);
          }
        }
        
        if (imageKey && element.objectId && req.body.images[imageKey]) {
          console.log(`Adding image replacement: slide ${slideIndex}, element ${elementIndex}, using image ${imageKey} (${req.body.images[imageKey].substring(0, 50)}...)`);
          contentRequests.push({
            replaceImage: {
              imageObjectId: element.objectId,
              imageReplaceMethod: 'CENTER_INSIDE',
              url: req.body.images[imageKey]
            }
          });
        } else {
          console.log(`No matching image found for slide ${slideIndex}, element ${elementIndex}, placeholder ${placeholderIndex}`);
        }
      }
    });
  });
}

// Log all the remaining requests we're going to perform
console.log(`Executing ${contentRequests.length} text/image replacement requests`);

// Execute all remaining requests (text replacements, image replacements)
if (contentRequests.length > 0) {
  try {
    await slides.presentations.batchUpdate({
      presentationId: createdDoc.data.id,
      requestBody: {
        requests: contentRequests
      }
    });
    console.log('Content replacements completed successfully');
  } catch (error) {
    console.error('Error during content replacements:', error);
    if (error.response) {
      console.error('Error response:', error.response.data);
    }
    // We won't throw the error here, as we still want to return the created presentation
  }
} 