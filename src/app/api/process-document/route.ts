import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

// Create a JWT client using the service account credentials
let auth: GoogleAuth | undefined;
try {
  // Try to parse the service account key
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
  
  if (!serviceAccountKey) {
    console.error('GOOGLE_SERVICE_ACCOUNT_KEY is not defined in environment variables');
  } else {
    console.log('Service account key found, attempting to parse...');
    
    // For debugging, log a small part of the key to verify it's being read
    console.log('Key starts with:', serviceAccountKey.substring(0, 20) + '...');
    
    const credentials = JSON.parse(serviceAccountKey);
    
    auth = new google.auth.GoogleAuth({
      credentials,
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/presentations'
      ],
    });
    
    console.log('Google Auth initialized successfully');
  }
} catch (error) {
  console.error('Error parsing service account key:', error);
  // We'll handle this in the route handler
}

export async function POST(request: Request) {
  try {
    console.log("Process presentation API called");
    
    // Check if auth was initialized properly
    if (!auth) {
      throw new Error('Failed to initialize Google authentication. Check your service account key.');
    }
    
    // Parse the request body
    let body;
    try {
      body = await request.json();
      console.log("Request body parsed:", body);
    } catch (error) {
      console.error("Failed to parse request body:", error);
      return NextResponse.json(
        { message: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    const { templateId, placeholders, images } = body;
    
    if (!templateId) {
      return NextResponse.json(
        { message: 'Template ID is required' },
        { status: 400 }
      );
    }
    
    if (!placeholders || typeof placeholders !== 'object') {
      return NextResponse.json(
        { message: 'Placeholders must be an object' },
        { status: 400 }
      );
    }
    
    console.log("Creating Drive and Slides clients");
    
    // Create Drive and Slides clients
    const drive = google.drive({ version: 'v3', auth });
    const slides = google.slides({ version: 'v1', auth });
    
    console.log("Copying template presentation:", templateId);
    
    // Step 1: Create a copy of the template
    const copyResponse = await drive.files.copy({
      fileId: templateId,
      requestBody: {
        name: `Filled Presentation - ${new Date().toISOString()}`
      }
    });
    
    console.log("Copy response:", copyResponse.data);
    
    const newPresentationId = copyResponse.data.id;
    
    if (!newPresentationId) {
      throw new Error('Failed to create presentation copy');
    }
    
    console.log("Making presentation publicly accessible:", newPresentationId);
    
    // Make the presentation publicly accessible with anyone who has the link
    await drive.permissions.create({
      fileId: newPresentationId,
      requestBody: {
        role: 'reader',
        type: 'anyone'
      }
    });
    
    // Get the presentation content
    console.log("Fetching presentation content:", newPresentationId);
    const presentation = await slides.presentations.get({
      presentationId: newPresentationId
    });
    
    console.log("Presentation content retrieved");
    
    // Create batch update requests for text replacement
    const requests: any[] = [];
    
    // Process each text placeholder
    Object.entries(placeholders).forEach(([key, value]) => {
      // Fix: Remove the extra curly braces if they exist
      const cleanKey = key.replace(/^\{\{|\}\}$/g, '');
      // Add the correct double curly braces
      const placeholder = `{{${cleanKey}}}`;
      const replacementText = String(value);
      
      console.log(`Creating replacement for: ${placeholder} -> ${replacementText}`);
      
      // Add a request to replace all occurrences of the placeholder
      requests.push({
        replaceAllText: {
          containsText: {
            text: placeholder,
            matchCase: true
          },
          replaceText: replacementText
        }
      });
    });
    
    // Process image replacements if provided
    if (images && typeof images === 'object' && Object.keys(images).length > 0) {
      // First, we need to find all image elements in the presentation
      const imageElements: any[] = [];
      
      // Iterate through all slides
      presentation.data.slides?.forEach(slide => {
        // Iterate through all page elements on the slide
        slide.pageElements?.forEach(element => {
          // Check if this is an image element
          if (element.image && element.objectId) {
            imageElements.push({
              objectId: element.objectId,
              title: element.title || ''
            });
          }
        });
      });
      
      console.log(`Found ${imageElements.length} image elements in the presentation`);
      
      // Match image elements with provided image URLs
      Object.entries(images).forEach(([key, imageUrl]) => {
        // Format the image placeholder with double curly braces
        const placeholder = `{{${key}}}`;
        
        console.log(`Looking for image elements with title containing: ${placeholder}`);
        
        // Find image elements with a title matching the placeholder
        const matchingImages = imageElements.filter(img => 
          img.title.includes(placeholder)
        );
        
        console.log(`Found ${matchingImages.length} matching image elements for ${placeholder}`);
        
        matchingImages.forEach(img => {
          console.log(`Creating image replacement for: ${img.objectId} -> ${imageUrl}`);
          
          // Add a request to replace the image
          requests.push({
            replaceImage: {
              imageObjectId: img.objectId,
              url: String(imageUrl),
              imageReplaceMethod: 'CENTER_INSIDE'
            }
          });
        });
      });
    }
    
    console.log(`Created ${requests.length} update requests`);
    
    if (requests.length > 0) {
      console.log("Sending batch update request");
      
      try {
        const updateResponse = await slides.presentations.batchUpdate({
          presentationId: newPresentationId,
          requestBody: {
            requests: requests
          }
        });
        
        console.log("Batch update response:", updateResponse.data);
      } catch (error) {
        console.error("Error during batch update:", error);
        // Continue execution even if batch update fails
      }
    }
    
    console.log("Presentation processed successfully");
    
    return NextResponse.json({ 
      documentId: newPresentationId,
      viewUrl: `https://docs.google.com/presentation/d/${newPresentationId}/view`,
      editUrl: `https://docs.google.com/presentation/d/${newPresentationId}/edit`
    });
  } catch (error: any) {
    console.error('Error processing presentation:', error);
    
    // Ensure we return a proper JSON response even for unexpected errors
    return NextResponse.json(
      { 
        message: error.message || 'Failed to process presentation',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        details: error.response?.data || error.details || undefined
      },
      { status: 500 }
    );
  }
}