"use client";

import { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface DocumentViewerProps {
  placeholders: Record<string, string>;
  images: string[];
  projectId: string;
  shouldProcess: boolean;
  onImagesUpdate?: (newImages: string[]) => void;
}

export default function DocumentViewer({
  placeholders,
  images,
  projectId,
  shouldProcess,
  onImagesUpdate
}: DocumentViewerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedDocumentId, setProcessedDocumentId] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  
  // The Google Slides presentation ID for the template
  const templateId = "1RRVB5_3_HzQK2q38GDXjwFIz5-WsmThZYwdxship14I";

  // Process the document only when shouldProcess changes to true
  useEffect(() => {
    const processDocument = async () => {
      if (!shouldProcess || !projectId || images.length === 0) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Create a properly structured image map for the API
        const imageMap: Record<string, string> = {};
        
        if (images.length > 0) {
          imageMap['logo'] = images[0]; 
        }
        
        if (images.length > 1) {
          imageMap['image3'] = images[1]; 
        }
        
        if (images.length > 2) {
          imageMap['image1'] = images[2]; 
        }
        
        if (images.length > 3) {
          imageMap['image2'] = images[3]; 
        }
        
        if (images.length > 4) {
          imageMap['image4'] = images[4]; 
        }
        
        console.log("Corrected image map for API:", imageMap);
        
        // Call your server-side API endpoint
        const response = await fetch('/api/process-document', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            templateId: templateId,
            placeholders: placeholders,
            images: imageMap // Corrected image map
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Server error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Store the document ID for later use (e.g., downloading)
        setProcessedDocumentId(data.documentId);
        
        // Update the preview URL to show the processed document
        setPreviewUrl(`https://docs.google.com/presentation/d/${data.documentId}/preview`);
        
        // Update the real_estate_projects table with presentation info
        try {
          const { error: updateError } = await supabase
            .from('real_estate_projects')
            .update({ 
              presentation_id: data.documentId,
              presentation_url: `https://docs.google.com/presentation/d/${data.documentId}/edit`,
              presentation_created_at: new Date().toISOString()
            })
            .eq('id', projectId);
          
          if (updateError) {
            console.error('Error updating project with presentation info:', updateError);
          }
        } catch (updateError) {
          console.error('Error updating project with presentation info:', updateError);
        }
        
      } catch (error: any) {
        console.error(`Error processing presentation:`, error);
        setError(error.message || `Failed to process presentation`);
      } finally {
        setLoading(false);
      }
    };

    processDocument();
  }, [shouldProcess, projectId, placeholders, images]);

  // Download the document as PDF
  const downloadDocument = async () => {
    if (!processedDocumentId) {
      setError('No processed document to download');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Call your server-side API endpoint to export the document as PDF
      const response = await fetch('/api/export-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          documentId: processedDocumentId,
          format: 'pdf'
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to download presentation as PDF`);
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      saveAs(blob, `presentation.pdf`);
      
      // Update the real_estate_projects table with download info
      try {
        const { error: updateError } = await supabase
          .from('real_estate_projects')
          .update({ 
            presentation_downloaded_at: new Date().toISOString()
          })
          .eq('id', projectId);
        
        if (updateError) {
          console.error('Error updating project with download info:', updateError);
        }
      } catch (updateError) {
        console.error('Error updating project with download info:', updateError);
      }
      
    } catch (error: any) {
      console.error(`Error downloading presentation as PDF:`, error);
      setError(error.message || `Failed to download presentation as PDF`);
    } finally {
      setLoading(false);
    }
  };

  // Process document manually
  const processDocumentManually = async () => {
    if (!projectId || images.length === 0) {
      setError('Please add at least one image before processing');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Create the same corrected image map
      const imageMap: Record<string, string> = {};
      
      // Apply the same corrected mapping
      if (images.length > 0) {
        imageMap['logo'] = images[0];
      }
      
      if (images.length > 1) {
        imageMap['image3'] = images[1];
      }
      
      if (images.length > 2) {
        imageMap['image1'] = images[2];
      }
      
      if (images.length > 3) {
        imageMap['image2'] = images[3];
      }
      
      if (images.length > 4) {
        imageMap['image4'] = images[4];
      }
      
      console.log("Corrected image map for API (manual process):", imageMap);
      
      const response = await fetch('/api/process-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: templateId,
          placeholders: placeholders,
          images: imageMap
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      setProcessedDocumentId(data.documentId);
      setPreviewUrl(`https://docs.google.com/presentation/d/${data.documentId}/preview`);
      
      // Update database
      const { error: updateError } = await supabase
        .from('real_estate_projects')
        .update({ 
          presentation_id: data.documentId,
          presentation_url: `https://docs.google.com/presentation/d/${data.documentId}/edit`,
          presentation_created_at: new Date().toISOString()
        })
        .eq('id', projectId);
      
      if (updateError) {
        console.error('Error updating project with presentation info:', updateError);
      }
      
    } catch (error: any) {
      console.error(`Error processing presentation:`, error);
      setError(error.message || `Failed to process presentation`);
    } finally {
      setLoading(false);
    }
  };

  // Add this inside the DocumentViewer component
  const uploadImage = async (file: File) => {
    const supabase = createClientComponentClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${projectId}/${fileName}`;

    const { error } = await supabase.storage
      .from('presentation-images')
      .upload(filePath, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('presentation-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  // Then update the handleImageUpload function
  const handleImageUpload = async (file: File) => {
    try {
      const newImageUrl = await uploadImage(file);
      const updatedImages = [...images, newImageUrl];
      if (onImagesUpdate) {
        onImagesUpdate(updatedImages);
      }
      return newImageUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      setError('Failed to upload image');
      throw error;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[#1c2a47] flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">Preview</h3>
        <div className="flex space-x-2">
          {!previewUrl && (
            <button
              onClick={processDocumentManually}
              disabled={loading || images.length === 0}
              className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 mr-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                "Generate Brochure"
              )}
            </button>
          )}
          {processedDocumentId && !loading && (
            <button
              onClick={downloadDocument}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Download PDF
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-grow bg-[#0A0A0A]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-400">Processing presentation...</p>
          </div>
        ) : previewUrl ? (
          <iframe 
            src={previewUrl}
            className="w-full h-full border-0"
            title="Presentation Preview"
            allowFullScreen
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <svg className="w-16 h-16 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-400 mb-2">No Brochure preview available.</p>
            <p className="text-gray-500 text-sm">Click "Generate Brochure" to create a presentation with your data.</p>
            {error && (
              <div className="mt-4 p-3 bg-red-900/20 border border-red-900 rounded-md">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}