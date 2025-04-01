import { google } from 'googleapis';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

    // Set the permissions to allow anyone to edit without requiring sign-in
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

    // Make sure the document is published to the web and publicly accessible
    await drive.revisions.update({
      fileId: createdDoc.data.id,
      revisionId: '1',
      requestBody: {
        published: true,
        publishAuto: true,
        publishedOutsideDomain: true,
        publishedLink: 'ANYONE_WITH_LINK',
      },
    });

    // Additional settings to ensure the presentation is editable
    await drive.files.update({
      fileId: createdDoc.data.id,
      requestBody: {
        copyRequiresWriterPermission: false,
        writersCanShare: true,
      },
      supportsAllDrives: true,
    });

    // Before replacing text, let's fetch the presentation to find text to replace
    const presentation = await slides.presentations.get({
      presentationId: createdDoc.data.id
    });

    const requests = [];

    // Process both images and text replacements
    // First, handle text replacements
    if (req.body.placeholders) {
      // Create a list of all placeholders we need to check
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

      // For each placeholder, create a text replacement request
      allPlaceholders.forEach(placeholder => {
        const placeholderValue = req.body.placeholders[placeholder] || '';
        
        // Add a replacement request with the actual placeholder text format
        // This is the format in the slide: {placeholder_name}
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
    if (req.body.images) {
      // Get all slides and elements to find image placeholders
      const slides = presentation.data.slides || [];
      
      slides.forEach(slide => {
        const pageElements = slide.pageElements || [];
        
        pageElements.forEach(element => {
          if (element.shape && element.shape.placeholder && element.shape.placeholder.type === 'PICTURE') {
            // Check if we have a matching image for this placeholder
            const placeholderIndex = element.shape.placeholder.index;
            const imageKey = Object.keys(req.body.images).find(key => 
              key === `image${placeholderIndex}` || key === `logo` || key === `image${placeholderIndex + 1}`
            );
            
            if (imageKey && element.objectId) {
              const imageUrl = req.body.images[imageKey];
              
              // Add an image replacement request
              requests.push({
                replaceImage: {
                  imageObjectId: element.objectId,
                  imageReplaceMethod: 'CENTER_INSIDE',
                  url: imageUrl
                }
              });
            }
          }
        });
      });
    }

    // If we have any requests, execute them
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
    return res.status(500).json({ message: 'Error processing document', error: error.message });
  }
} 