"use client";

import { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';

interface DocumentViewerProps {
  placeholders: Record<string, string>;
  images: string[];
  projectId: string;
  shouldProcess: boolean;
  onImagesUpdate?: (newImages: string[]) => void;
  onPresentationGenerated?: () => void;
  selectedPages?: Record<string, boolean>;
}

export default function DocumentViewer({
  placeholders,
  images,
  projectId,
  shouldProcess,
  onImagesUpdate,
  onPresentationGenerated,
  selectedPages
}: DocumentViewerProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedDocumentId, setProcessedDocumentId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const supabase = createClientComponentClient();
  
  // Updated Google Slides presentation ID for the template
  const templateId = "163ORTnlGT7GSowNSbYzS6pbgANpsLfTrmuzTMPd-Now";

  // Check for existing presentation on mount
  useEffect(() => {
    const checkExistingPresentation = async () => {
      if (!projectId) return;
      
      try {
        setLoading(true);
        const { data: project, error: fetchError } = await supabase
          .from('real_estate_projects')
          .select('presentation_id, presentation_url')
          .eq('id', projectId)
          .single();
        
        if (fetchError) {
          console.error('Error fetching project:', fetchError);
          return;
        }
        
        if (project && project.presentation_id) {
          console.log('Found existing presentation:', project.presentation_id);
          setProcessedDocumentId(project.presentation_id);
          setPreviewUrl(`https://docs.google.com/presentation/d/${project.presentation_id}/preview`);
          setEditUrl(`https://docs.google.com/presentation/d/${project.presentation_id}/edit?usp=embed&rm=demo`);
        }
      } catch (error) {
        console.error('Error checking for existing presentation:', error);
      } finally {
        setLoading(false);
      }
    };
    
    checkExistingPresentation();
  }, [projectId]);

  // Process the document only when shouldProcess changes to true and no existing presentation
  useEffect(() => {
    const processDocument = async () => {
      // Don't process if:
      // 1. shouldProcess is false, OR
      // 2. No projectId, OR
      // 3. No images, OR
      // 4. We already have a processedDocumentId (meaning a presentation exists)
      if (!shouldProcess || !projectId || images.length === 0 || processedDocumentId) {
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Create a properly structured image map for the API
        const imageMap: Record<string, string> = {};
        
        // Always include logo and agent photo
        if (images.length > 0) {
          imageMap['logo'] = images[0]; 
          console.log('Added logo image:', images[0].substring(0, 50) + '...');
        }
        
        if (images.length > 1) {
          imageMap['agent'] = images[1]; 
          console.log('Added agent image:', images[1].substring(0, 50) + '...');
        }
        
        // Create a direct mapping with explicit image names
        // This ensures each image gets the correct placeholder name
        let imageIndex = 2; // Start at index 2 (after logo and agent)
        
        // Map images based on selected pages
        if (selectedPages) {
          console.log('Mapping images based on selected pages:', selectedPages);
          
          // Project Overview (first content slide)
          if (selectedPages['projectOverview'] && imageIndex < images.length) {
            imageMap['image1'] = images[imageIndex++];
            console.log('Added Project Overview image (image1)');
          }
          
          // Building Layout Plan
          if (selectedPages['buildingLayout'] && imageIndex < images.length) {
            imageMap['image2'] = images[imageIndex++];
            console.log('Added Building Layout image (image2)');
          }
          
          // Exterior Photos (2 images)
          if (selectedPages['exteriorPhotos']) {
            if (imageIndex < images.length) {
              imageMap['image3'] = images[imageIndex++];
              console.log('Added Exterior Photo 1 (image3)');
            }
            if (imageIndex < images.length) {
              imageMap['image4'] = images[imageIndex++];
              console.log('Added Exterior Photo 2 (image4)');
            }
          }
          
          // Interior Photos (2 images)
          if (selectedPages['interiorPhotos']) {
            if (imageIndex < images.length) {
              imageMap['image5'] = images[imageIndex++];
              console.log('Added Interior Photo 1 (image5)');
            }
            if (imageIndex < images.length) {
              imageMap['image6'] = images[imageIndex++];
              console.log('Added Interior Photo 2 (image6)');
            }
          }
          
          // Floor Plan
          if (selectedPages['floorPlan'] && imageIndex < images.length) {
            imageMap['image7'] = images[imageIndex++];
            console.log('Added Floor Plan image (image7)');
          }
          
          // Energy Certificate (2 images)
          if (selectedPages['energyCertificate']) {
            if (imageIndex < images.length) {
              imageMap['image8'] = images[imageIndex++];
              console.log('Added Energy Certificate 1 (image8)');
            }
            if (imageIndex < images.length) {
              imageMap['image9'] = images[imageIndex++];
              console.log('Added Energy Certificate 2 (image9)');
            }
          }
        }
        
        console.log("Image map for API:", imageMap);
        
        // Call your server-side API endpoint
        const response = await fetch('/api/process-document', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            templateId: templateId,
            placeholders: placeholders,
            images: imageMap,
            selectedPages: selectedPages
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
        // Add edit URL for direct Google Slides editing with proper tools
        setEditUrl(`https://docs.google.com/presentation/d/${data.documentId}/edit?usp=embed&rm=demo`);
        
        // After successful presentation generation and database update
        if (data.documentId) {
          setProcessedDocumentId(data.documentId);
          setPreviewUrl(`https://docs.google.com/presentation/d/${data.documentId}/preview`);
          setEditUrl(`https://docs.google.com/presentation/d/${data.documentId}/edit?usp=embed&rm=demo`);
          
          // Call the new callback to notify parent
          if (onPresentationGenerated) {
            onPresentationGenerated();
          }
          
          // Update the real_estate_projects table with presentation info
          try {
            const { error: updateError } = await supabase
              .from('real_estate_projects')
              .update({ 
                presentation_id: data.documentId,
                presentation_url: `https://docs.google.com/presentation/d/${data.documentId}/edit?usp=embed&rm=demo`,
                presentation_created_at: new Date().toISOString()
              })
              .eq('id', projectId);
            
            if (updateError) {
              console.error('Error updating project with presentation info:', updateError);
            }
          } catch (updateError) {
            console.error('Error updating project with presentation info:', updateError);
          }
        }
        
      } catch (error: any) {
        console.error(`Error processing presentation:`, error);
        setError(error.message || `Failed to process presentation`);
      } finally {
        setLoading(false);
      }
    };

    processDocument();
  }, [shouldProcess, projectId, placeholders, images, processedDocumentId, selectedPages]);

  // Add a new effect to handle image updates based on selected pages
  useEffect(() => {
    if (!selectedPages || !onImagesUpdate) return;

    // Create a new array with only the images for selected pages
    const filteredImages = [...images];
    let newLength = 2; // Keep logo and agent photo

    // Project Overview
    if (selectedPages['projectOverview']) {
      newLength = 3;
    }
    
    // Building Layout Plan
    if (selectedPages['buildingLayout']) {
      newLength = 4;
    }
    
    // Exterior Photos
    if (selectedPages['exteriorPhotos']) {
      newLength = 6;
    }
    
    // Interior Photos
    if (selectedPages['interiorPhotos']) {
      newLength = 8;
    }
    
    // Floor Plan
    if (selectedPages['floorPlan']) {
      newLength = 9;
    }
    
    // Energy Certificate
    if (selectedPages['energyCertificate']) {
      newLength = 11;
    }

    // Trim the array to only include images for selected pages
    const updatedImages = filteredImages.slice(0, newLength);

    // Update the parent component's state
    if (JSON.stringify(updatedImages) !== JSON.stringify(images)) {
      onImagesUpdate(updatedImages);
    }
  }, [selectedPages, images, onImagesUpdate]);

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
    
    // If we already have a presentation, just use that instead of generating a new one
    if (processedDocumentId) {
      setIsEditMode(true); // Switch to edit mode
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Create a properly structured image map for the API - use the SAME logic as the automatic process
      const imageMap: Record<string, string> = {};
      
      // Always include logo and agent photo
      if (images.length > 0) {
        imageMap['logo'] = images[0]; 
        console.log('Manual process - Added logo image:', images[0].substring(0, 50) + '...');
      }
      
      if (images.length > 1) {
        imageMap['agent'] = images[1]; 
        console.log('Manual process - Added agent image:', images[1].substring(0, 50) + '...');
      }
      
      // Create a direct mapping with explicit image names
      // This ensures each image gets the correct placeholder name
      let imageIndex = 2; // Start at index 2 (after logo and agent)
      
      // Use the exact same placeholder naming as the automatic process
      // Project Overview
      if (imageIndex < images.length) {
        imageMap['image1'] = images[imageIndex++];
        console.log('Manual process - Added Project Overview image (image1)');
      }
      
      // Building Layout Plan
      if (imageIndex < images.length) {
        imageMap['image2'] = images[imageIndex++];
        console.log('Manual process - Added Building Layout image (image2)');
      }
      
      // Exterior Photos
      if (imageIndex < images.length) {
        imageMap['image3'] = images[imageIndex++];
        console.log('Manual process - Added Exterior Photo 1 (image3)');
      }
      
      if (imageIndex < images.length) {
        imageMap['image4'] = images[imageIndex++];
        console.log('Manual process - Added Exterior Photo 2 (image4)');
      }
      
      // Interior Photos
      if (imageIndex < images.length) {
        imageMap['image5'] = images[imageIndex++];
        console.log('Manual process - Added Interior Photo 1 (image5)');
      }
      
      if (imageIndex < images.length) {
        imageMap['image6'] = images[imageIndex++];
        console.log('Manual process - Added Interior Photo 2 (image6)');
      }
      
      // Floor Plan
      if (imageIndex < images.length) {
        imageMap['image7'] = images[imageIndex++];
        console.log('Manual process - Added Floor Plan image (image7)');
      }
      
      // Energy Certificate
      if (imageIndex < images.length) {
        imageMap['image8'] = images[imageIndex++];
        console.log('Manual process - Added Energy Certificate 1 (image8)');
      }
      
      if (imageIndex < images.length) {
        imageMap['image9'] = images[imageIndex++];
        console.log('Manual process - Added Energy Certificate 2 (image9)');
      }
      
      console.log("Manual process - Image map for API:", imageMap);
      
      const response = await fetch('/api/process-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          templateId: templateId,
          placeholders: placeholders,
          images: imageMap,
          selectedPages: selectedPages // Also send the selectedPages
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      setProcessedDocumentId(data.documentId);
      setPreviewUrl(`https://docs.google.com/presentation/d/${data.documentId}/preview`);
      // Add edit URL for direct Google Slides editing with proper tools
      setEditUrl(`https://docs.google.com/presentation/d/${data.documentId}/edit?usp=embed&rm=demo`);
      
      // Update database
      const { error: updateError } = await supabase
        .from('real_estate_projects')
        .update({ 
          presentation_id: data.documentId,
          presentation_url: `https://docs.google.com/presentation/d/${data.documentId}/edit?usp=embed&rm=demo`,
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

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      const newImageUrl = await uploadImage(file);
      
      // Create a new array with the new image
      const updatedImages = [...images, newImageUrl];
      
      // Update parent component state safely
      if (onImagesUpdate) {
        // Use requestAnimationFrame to ensure state updates are complete
        requestAnimationFrame(() => {
          onImagesUpdate(updatedImages);
        });
      }
      
      return newImageUrl;
    } catch (error) {
      console.error('Image upload failed:', error);
      setError('Failed to upload image');
      throw error;
    }
  };

  // Handle image replacement
  const handleImageReplace = async (index: number, file: File) => {
    try {
      setLoading(true);
      
      // Get the old image URL
      const oldImageUrl = images[index];
      
      // Upload the new file with a unique name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${projectId}/${fileName}`;
      
      // Upload the file to the correct bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('docx')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        throw new Error(`Failed to upload new image: ${uploadError.message}`);
      }
      
      // Get the public URL from the correct bucket
      const { data: publicUrlData } = supabase.storage
        .from('docx')
        .getPublicUrl(filePath);
      
      const newImageUrl = publicUrlData.publicUrl;
      
      // Create a new array with the replaced image
      const newImages = [...images];
      newImages[index] = newImageUrl;
      
      // Update the database directly
      const { data: updateData, error: updateError } = await supabase
        .from('real_estate_projects')
        .update({ 
          presentation_images: newImages,
          last_updated: new Date().toISOString()
        })
        .eq('id', projectId)
        .select();
      
      if (updateError) {
        throw new Error(`Failed to update project: ${updateError.message}`);
      }
      
      // Update the state safely
      if (onImagesUpdate) {
        requestAnimationFrame(() => {
          onImagesUpdate(newImages);
        });
      }
      
      toast.success('Image replaced successfully');
      
      // Try to delete the old file if it exists
      if (oldImageUrl) {
        try {
          // Extract the path from the URL
          const urlParts = oldImageUrl.split('/');
          const bucketNameIndex = urlParts.findIndex(part => part === 'docx');
          
          if (bucketNameIndex >= 0 && bucketNameIndex < urlParts.length - 1) {
            const oldPath = urlParts.slice(bucketNameIndex + 1).join('/').split('?')[0];
            
            const { data: deleteData, error: deleteError } = await supabase.storage
              .from('docx')
              .remove([oldPath]);
          }
        } catch (deleteError) {
          console.error('Error during file deletion:', deleteError);
        }
      }
      
    } catch (error: any) {
      console.error('Image replacement failed:', error);
      toast.error(error.message || 'Failed to replace image');
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle fullscreen mode
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (!isFullScreen) {
      setIsEditMode(true); // Automatically switch to edit mode when going fullscreen
    }
  };

  // If in fullscreen mode, render a fullscreen overlay
  if (isFullScreen && editUrl) {
    return (
      <div className="fixed inset-0 z-50 bg-[#0A0A0A] flex flex-col">
        <div className="p-4 bg-[#111827] shadow-md flex justify-between items-center">
          <h3 className="text-lg font-medium text-white">Edit Presentation</h3>
          <div className="flex space-x-3">
            <button
              onClick={downloadDocument}
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Download PDF
            </button>
            <button
              onClick={toggleFullScreen}
              className="bg-gray-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              Exit Full Screen
            </button>
          </div>
        </div>
        <div className="flex-grow">
          <iframe 
            src={editUrl}
            className="w-full h-full border-0"
            title="Presentation Editor"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-[#1c2a47] flex justify-between items-center">
        <h3 className="text-lg font-medium text-white">
          {isEditMode ? "Edit" : "Preview"}
        </h3>
        <div className="flex space-x-2">
          {!previewUrl && (
            <button
              onClick={processDocumentManually}
              disabled={loading || images.length === 0}
              className="bg-gradient-to-r from-purple-600 to-purple-800 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity text-base"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
            <>
              <button
                onClick={downloadDocument}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Download PDF
              </button>
              
              {editUrl && previewUrl && (
                <>
                  <div className="flex items-center bg-gray-800 rounded-lg p-1">
                    <button
                      onClick={() => setIsEditMode(false)}
                      className={`px-4 py-2 rounded ${
                        !isEditMode 
                          ? 'bg-purple-600 text-white' 
                          : 'text-gray-300 hover:text-white'
                      } transition-colors`}
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => setIsEditMode(true)}
                      className={`px-4 py-2 rounded ${
                        isEditMode 
                          ? 'bg-green-600 text-white' 
                          : 'text-gray-300 hover:text-white'
                      } transition-colors`}
                    >
                      Edit
                    </button>
                  </div>
                  {isEditMode && (
                    <button
                      onClick={toggleFullScreen}
                      className="text-green-500 hover:text-green-400 transition-colors"
                      title="Edit in Fullscreen"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                      </svg>
                    </button>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </div>
      
      <div className="flex-grow bg-[#0A0A0A] relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-400 text-lg">Processing presentation...</p>
          </div>
        ) : previewUrl ? (
          <>
            <iframe 
              src={isEditMode ? editUrl || '' : previewUrl}
              className="w-full h-full border-0 min-h-[600px]"
              title={isEditMode ? "Presentation Editor" : "Presentation Preview"}
              allowFullScreen
            />
            {isEditMode && (
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={toggleFullScreen}
                  className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
                  title="Edit in Fullscreen"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <svg className="w-24 h-24 mb-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-400 text-xl mb-3">No Brochure preview available.</p>
            <p className="text-gray-500 text-base">Click "Generate Brochure" to create a presentation with your data.</p>
            {error && (
              <div className="mt-6 p-4 bg-red-900/20 border border-red-900 rounded-md max-w-md">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}