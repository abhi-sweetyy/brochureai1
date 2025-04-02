import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';

interface RequestBody {
  templateId: string;
  placeholders: Record<string, string>;
  images: Record<string, string>;
  selectedPages?: Record<string, boolean>;
}

interface SlideRequest {
  deleteSlide?: {
    objectId: string;
  };
  replaceAllText?: {
    containsText: {
      text: string;
      matchCase: boolean;
    };
    replaceText: string;
  };
  replaceImage?: {
    imageObjectId: string;
    imageReplaceMethod: string;
    url: string;
  };
}

export default async function handler(
  req: NextApiRequest & { body: RequestBody },
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/drive',
        'https://www.googleapis.com/auth/presentations',
      ],
    });

    const drive = google.drive({ version: 'v3', auth });
    const slides = google.slides({ version: 'v1', auth });

    // Create a copy of the template
    const createdDoc = await drive.files.copy({
      fileId: req.body.templateId,
      requestBody: {
        name: `${req.body.placeholders.title || 'New Presentation'} - ${new Date().toLocaleDateString()}`,
      },
    });

    if (!createdDoc.data.id) {
      throw new Error('Failed to create presentation');
    }

    // Set permissions for the new presentation
    await drive.permissions.create({
      fileId: createdDoc.data.id,
      requestBody: {
        role: 'writer',
        type: 'anyone',
        allowFileDiscovery: false,
      },
      supportsAllDrives: true,
      fields: 'id',
    });

    // Before replacing text, fetch the presentation to find text to replace and handle slides
    const presentation = await slides.presentations.get({
      presentationId: createdDoc.data.id
    });

    const requests: SlideRequest[] = [];

    // Define page indices in the template (0-based index)
    const pageIndices = {
      projectOverview: 1,      // Slide 2
      buildingLayout: 2,       // Slide 3
      description: 3,          // Slide 4
      exteriorPhotos: 4,       // Slide 5
      interiorPhotos: 5,       // Slide 6
      floorPlan: 6,           // Slide 7
      energyCertificate: 7,    // Slide 8
      termsConditions: 8       // Slide 9
    } as const;

    // Collect slides to delete (in reverse order to maintain correct indices)
    const slidesToDelete: number[] = [];
    if (req.body.selectedPages) {
      Object.entries(pageIndices).forEach(([pageId, index]) => {
        if (!req.body.selectedPages[pageId]) {
          slidesToDelete.unshift(index);
        }
      });
    }

    // Add delete requests for unselected pages
    if (slidesToDelete.length > 0 && presentation.data.slides) {
      slidesToDelete.forEach(slideIndex => {
        const slide = presentation.data.slides?.[slideIndex];
        if (slide?.objectId) {
          requests.push({
            deleteSlide: {
              objectId: slide.objectId
            }
          });
        }
      });
    }

    // Process both images and text replacements
    // First, handle text replacements
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
      ] as const;

      allPlaceholders.forEach(placeholder => {
        const placeholderValue = req.body.placeholders[placeholder] || '';
        requests.push({
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
      presentation.data.slides.forEach(slide => {
        const pageElements = slide.pageElements || [];
        
        pageElements.forEach(element => {
          if (element.shape?.placeholder?.type === 'PICTURE' && 
              element.shape.placeholder.index !== null && 
              element.shape.placeholder.index !== undefined) {
            const placeholderIndex = element.shape.placeholder.index;
            const imageKey = Object.keys(req.body.images).find(key => 
              key === `image${placeholderIndex}` || key === `logo` || key === `image${placeholderIndex + 1}`
            );
            
            if (imageKey && element.objectId && req.body.images[imageKey]) {
              requests.push({
                replaceImage: {
                  imageObjectId: element.objectId,
                  imageReplaceMethod: 'CENTER_INSIDE',
                  url: req.body.images[imageKey]
                }
              });
            }
          }
        });
      });
    }

    // Execute all requests (text replacements, image replacements, and slide deletions)
    if (requests.length > 0) {
      await slides.presentations.batchUpdate({
        presentationId: createdDoc.data.id,
        requestBody: {
          requests: requests
        }
      });
    }

    return res.status(200).json({ 
      documentId: createdDoc.data.id,
      message: 'Presentation created successfully' 
    });

  } catch (error) {
    console.error('Error processing document:', error);
    return res.status(500).json({ 
      message: 'Error processing document', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
} 