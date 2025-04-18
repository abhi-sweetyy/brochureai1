"use client";

import { useEffect, useState, useRef } from 'react';
import { saveAs } from 'file-saver';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'react-hot-toast';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import type { Session } from '@supabase/supabase-js';

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
  const { t, i18n } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [processedDocumentId, setProcessedDocumentId] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [session, setSession] = useState<Session | null>(null);

  // Updated Google Slides presentation ID for the template
  const templateId = "163ORTnlGT7GSowNSbYzS6pbgANpsLfTrmuzTMPd-Now";

  // Get current language for Google Slides
  const getLanguageParam = () => {
    // Map i18n language to Google Slides language code
    const lang = i18n.language?.startsWith('de') ? 'de' : 'en';
    return `hl=${lang}`;
  };

  // Create URL with language parameter - add direct 'lang' parameter which is more reliable
  const createUrlWithLanguage = (baseUrl: string) => {
    // Extract the base URL without parameters
    const urlBase = baseUrl.split('?')[0];
    
    // Extract existing query parameters if any
    const queryParams = baseUrl.includes('?') ? baseUrl.split('?')[1] : '';
    const params = new URLSearchParams(queryParams);
    
    // Set the language parameter (overrides any existing hl parameter)
    const lang = i18n.language?.startsWith('de') ? 'de' : 'en';
    params.set('hl', lang);
    params.set('lang', lang); // Adding another language parameter that might work
    
    // For fullscreen edit mode, force parameters that ensure language is applied
    if (baseUrl.includes('/edit')) {
      params.set('usp', 'sharing'); // Use sharing mode which respects language better
    }
    
    // Reconstruct the URL with all parameters
    return `${urlBase}?${params.toString()}`;
  };

  // Reference to iframe element
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  
  // Force the language setting via JavaScript after iframe loads
  useEffect(() => {
    // Only apply to iframe when in edit mode
    if (isEditMode && iframeRef.current) {
      console.log("Setting up iframe language enforcement");
      
      // Function to enforce language on iframe
      const enforceLanguage = () => {
        const iframe = iframeRef.current;
        if (iframe && iframe.src && iframe.src.includes("docs.google.com/presentation")) {
          try {
            const currentLang = i18n.language || 'en';
            console.log("Enforcing language on iframe:", currentLang);
            const url = new URL(iframe.src);
            
            // Set language parameter based on current language
            url.searchParams.set("hl", currentLang);
            
            // For German, add additional parameters
            if (currentLang.startsWith('de')) {
              url.searchParams.set("ui", "2");
              url.searchParams.set("authuser", "0");
            }
            
            // Update the iframe src
            console.log("Updated iframe URL:", url.toString());
            iframe.src = url.toString();
          } catch (error) {
            console.error("Error enforcing language on iframe:", error);
          }
        }
      };
      
      // Try immediately and also after a delay to ensure iframe is fully loaded
      enforceLanguage();
      const timer = setTimeout(enforceLanguage, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isEditMode, i18n.language, editUrl]);
  
  // Function to directly navigate based on current language
  const openEditUrlInNewTab = () => {
    if (processedDocumentId) {
      const currentLang = i18n.language || 'en';
      
      if (currentLang.startsWith('de')) {
        // For German, use our custom launcher
        const launcherUrl = `/german-slides.html?id=${processedDocumentId}`;
        window.open(launcherUrl, '_blank');
      } else if (editUrl) {
        // For English, use the standard URL
        window.open(editUrl, '_blank');
      }
    }
  };
  
  // Create a URL for the edit button that respects the current language
  const getEditUrl = () => {
    const currentLang = i18n.language || 'en';
    
    if (currentLang.startsWith('de') && processedDocumentId) {
      return `/german-slides.html?id=${processedDocumentId}`;
    } else {
      return editUrl || '';
    }
  };

  // Update URLs whenever language changes
  useEffect(() => {
    if (processedDocumentId) {
      const basePreviewUrl = `https://docs.google.com/presentation/d/${processedDocumentId}/preview`;
      const baseEditUrl = `https://docs.google.com/presentation/d/${processedDocumentId}/edit?usp=embed&rm=demo`;
      
      // Log the URLs for debugging
      const previewWithLang = createUrlWithLanguage(basePreviewUrl);
      const editWithLang = createUrlWithLanguage(baseEditUrl);
      console.log("Setting URLs with language:", { 
        preview: previewWithLang, 
        edit: editWithLang, 
        lang: i18n.language 
      });
      
      setPreviewUrl(previewWithLang);
      setEditUrl(editWithLang);
    }
  }, [i18n.language, processedDocumentId]);

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
          
          const basePreviewUrl = `https://docs.google.com/presentation/d/${project.presentation_id}/preview`;
          const baseEditUrl = `https://docs.google.com/presentation/d/${project.presentation_id}/edit?usp=embed&rm=demo`;
          
          setPreviewUrl(createUrlWithLanguage(basePreviewUrl));
          setEditUrl(createUrlWithLanguage(baseEditUrl));
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
        
        // Start with images after logo and agent photo
        let imageIndex = 2;
        
        // Map images based on selected pages using a more reliable approach
        if (selectedPages) {
          console.log('Mapping images based on selected pages:', selectedPages);
          
          // Define page-to-image mapping based on exact requirements
          const pageImageMapping: Record<string, string[]> = {
            'projectOverview': ['image1'],
            'buildingLayout': ['image2'],
            'exteriorPhotos': ['image3', 'image4'],
            'interiorPhotos': ['image5', 'image6'],
            'floorPlan': ['image7'],
            'energyCertificate': ['image8', 'image9'],
            // Description and Terms & Conditions don't have images
          };
          
          // Track available images (excluding logo and agent photo)
          const availableImages = images.slice(2);
          let availableImageIndex = 0;
          
          // Only process the pages that actually have images according to requirements
          const pagesWithImages = [
            'projectOverview',
            'buildingLayout',
            'exteriorPhotos',
            'interiorPhotos',
            'floorPlan',
            'energyCertificate'
          ];
          
          // Process pages in order
          for (const pageId of pagesWithImages) {
            if (selectedPages[pageId] && pageImageMapping[pageId]) {
              for (const imagePlaceholder of pageImageMapping[pageId]) {
                if (availableImageIndex < availableImages.length) {
                  imageMap[imagePlaceholder] = availableImages[availableImageIndex];
                  console.log(`Added ${pageId} image (${imagePlaceholder}): ${availableImages[availableImageIndex].substring(0, 30)}...`);
                  availableImageIndex++;
                }
              }
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
            selectedPages: selectedPages,
            language: i18n.language // Pass the current language to the API
          }),
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Server error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Store the document ID for later use (e.g., downloading)
        setProcessedDocumentId(data.documentId);
        
        // Use the URLs directly from the API response - these already have language parameters
        setPreviewUrl(data.viewUrl);
        setEditUrl(data.editUrl);
        
        // After successful presentation generation and database update
        if (data.documentId) {
          setProcessedDocumentId(data.documentId);
          
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
        setError(error.message || t('documentViewer.failedToProcessPresentation'));
      } finally {
        setLoading(false);
      }
    };

    processDocument();
  }, [shouldProcess, projectId, placeholders, images, processedDocumentId, selectedPages]);

  // Update the handleDocumentUpload function for the manual generation as well
  const processDocumentManually = async () => {
    if (!projectId || images.length === 0) {
      setError(t('documentViewer.addImagesBeforeProcessing'));
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
      
      // Map images based on selected pages using the same improved approach
      if (selectedPages) {
        console.log('Manual process - Mapping images based on selected pages:', selectedPages);
        
        // Define page-to-image mapping based on exact requirements
        const pageImageMapping: Record<string, string[]> = {
          'projectOverview': ['image1'],
          'buildingLayout': ['image2'],
          'exteriorPhotos': ['image3', 'image4'],
          'interiorPhotos': ['image5', 'image6'],
          'floorPlan': ['image7'],
          'energyCertificate': ['image8', 'image9'],
          // Description and Terms & Conditions don't have images
        };
        
        // Track available images (excluding logo and agent photo)
        const availableImages = images.slice(2);
        let availableImageIndex = 0;
        
        // Only process the pages that actually have images according to requirements
        const pagesWithImages = [
          'projectOverview',
          'buildingLayout',
          'exteriorPhotos',
          'interiorPhotos',
          'floorPlan',
          'energyCertificate'
        ];
        
        // Process pages in order
        for (const pageId of pagesWithImages) {
          if (selectedPages[pageId] && pageImageMapping[pageId]) {
            for (const imagePlaceholder of pageImageMapping[pageId]) {
              if (availableImageIndex < availableImages.length) {
                imageMap[imagePlaceholder] = availableImages[availableImageIndex];
                console.log(`Manual process - Added ${pageId} image (${imagePlaceholder}): ${availableImages[availableImageIndex].substring(0, 30)}...`);
                availableImageIndex++;
              }
            }
          }
        }
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
          selectedPages: selectedPages, // Also send the selectedPages
          language: i18n.language // Pass the current language to the API
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      setProcessedDocumentId(data.documentId);
      
      // Use the URLs directly from the API response - these already have language parameters
      setPreviewUrl(data.viewUrl);
      setEditUrl(data.editUrl);
      
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
      setError(error.message || t('documentViewer.failedToProcessPresentation'));
    } finally {
      setLoading(false);
    }
  };

  // Add a new effect to handle image updates based on selected pages
  useEffect(() => {
    if (!selectedPages || !onImagesUpdate) return;

    // Calculate required image count based on selected pages
    // This calculation determines how many images will be needed for the presentation
    let requiredImageCount = 2; // Start with 2 for logo and agent photo
    
    // Define how many images each page type requires based on exact requirements
    const pageImageCounts: Record<string, number> = {
      'projectOverview': 1,
      'buildingLayout': 1,
      'exteriorPhotos': 2,
      'interiorPhotos': 2,
      'floorPlan': 1,
      'energyCertificate': 2,
      // Description and Terms & Conditions don't have images, no entry needed
    };
    
    // Count required images based on selected pages
    for (const [pageId, isSelected] of Object.entries(selectedPages)) {
      if (isSelected && pageImageCounts[pageId]) {
        requiredImageCount += pageImageCounts[pageId];
      }
    }
    
    console.log(`Required image count based on selections: ${requiredImageCount}`);
    
    // If more images are provided than needed, trim the array
    if (images.length > requiredImageCount) {
      console.log(`Trimming images array from ${images.length} to ${requiredImageCount}`);
      const updatedImages = images.slice(0, requiredImageCount);
      onImagesUpdate(updatedImages);
    }
    
  }, [selectedPages, images, onImagesUpdate]);

  // Download the document as PDF
  const downloadDocument = async () => {
    if (!processedDocumentId) {
      setError(t('documentViewer.noProcessedDocument'));
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
        throw new Error(errorData.message || t('documentViewer.failedToDownloadPDF'));
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
      setError(error.message || t('documentViewer.failedToDownloadPDF'));
    } finally {
      setLoading(false);
    }
  };

  // Add this inside the DocumentViewer component
  const uploadImage = async (file: File) => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
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
      setError(t('documentViewer.failedToUploadImage'));
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
      
      toast.success(t('documentViewer.imageReplacedSuccessfully'));
      
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
      toast.error(error.message || t('documentViewer.failedToReplaceImage'));
    } finally {
      setLoading(false);
    }
  };

  // Function to toggle fullscreen mode
  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
    if (!isFullScreen) {
      setIsEditMode(true);
      // Prevent body scrolling
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable scrolling
      document.body.style.overflow = '';
    }
  };

  // Create fullscreen portal component
  const FullScreenPortal = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    
    useEffect(() => {
      // Create a new div element that will be appended directly to the body
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.top = '0';
      container.style.left = '0';
      container.style.width = '100%';
      container.style.height = '100%';
      container.style.zIndex = '99999';
      container.style.background = '#000';
      
      // Append to body, not inside any other container
      document.body.appendChild(container);
      
      // Store reference
      containerRef.current = container;
      
      // Log for debugging
      console.log("Portal container created, iframe URL:", editUrl);
      
      return () => {
        // Clean up on unmount
        if (containerRef.current && document.body.contains(containerRef.current)) {
          document.body.removeChild(containerRef.current);
        }
        // Restore scrolling on unmount
        document.body.style.overflow = '';
      };
    }, []);
    
    if (!containerRef.current || !editUrl) return null;
    
    return createPortal(
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        <iframe 
          src={createUrlWithLanguage(editUrl)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none'
          }}
          title={t('documentViewer.presentationEditor')}
          allowFullScreen
        />
        <button
          onClick={toggleFullScreen}
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 100000,
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '48px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
          }}
          title={t('documentViewer.exitFullScreen')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>,
      containerRef.current
    );
  };

  // If in fullscreen mode, render a fixed position overlay
  if (isFullScreen && processedDocumentId) {
    // Build URL based on current language
    const currentLang = i18n.language || 'en';
    let fullscreenUrl;
    
    if (currentLang.startsWith('de')) {
      // For German, use same parameters as English but with German language
      fullscreenUrl = `https://docs.google.com/presentation/d/${processedDocumentId}/edit?hl=de&usp=sharing&rm=demo&ui=2&authuser=0&embedded=true`;
    } else {
      // For English, standard parameters
      fullscreenUrl = `https://docs.google.com/presentation/d/${processedDocumentId}/edit?hl=en&usp=sharing&rm=demo&embedded=true`;
    }
    
    console.log(`Using enhanced fullscreen URL (${currentLang}):`, fullscreenUrl);
    
    return (
      <div 
        id="fullscreen-overlay" 
        style={{ 
          position: 'fixed',
          top: '60px', // Leave space for the header (adjust this value based on your header height)
          left: '245px', // Increased space for the sidebar (adjust this value based on your sidebar width)
          right: 0,
          bottom: 0,
          width: 'auto', // Let right: 0 determine the width
          height: 'auto', // Let bottom: 0 determine the height
          zIndex: 2147483647, // Maximum possible z-index value (2^31 - 1)
          background: 'white',
          overflow: 'hidden',
          display: 'block',
          isolation: 'isolate' // Creates a new stacking context
        }}
      >
        <iframe 
          src={fullscreenUrl}
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
          title={t('documentViewer.presentationEditor')}
          allowFullScreen
          id="fullscreen-iframe"
        />
        <button
          onClick={toggleFullScreen}
          style={{
            position: 'fixed',
            top: '70px', // Position just below header
            right: '20px',
            zIndex: 2147483647, // Maximum possible z-index
            background: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '60px', // Larger button
            height: '60px', // Larger button
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5)',
            fontSize: '24px'
          }}
          title={t('documentViewer.exitFullScreen')}
          id="fullscreen-exit-button"
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  }

  // Create client instance using createBrowserClient
  const [supabase] = useState(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ));

  // Fetch session
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, currentSession) => {
      setSession(currentSession);
      // If user logs out while viewing, maybe clear documentUrl or show message?
      // if (!currentSession) setDocumentUrl(null);
    });
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
       if (!session) setSession(initialSession);
    });
    return () => { authListener?.subscription.unsubscribe(); };
  }, [supabase]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white text-gray-800">
        <h3 className="text-lg font-medium text-gray-800">
          {isEditMode ? t('documentViewer.edit') : t('documentViewer.preview')}
        </h3>
        <div className="flex space-x-2">
          {!previewUrl && (
            <button
              onClick={processDocumentManually}
              disabled={loading || images.length === 0}
              className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity text-base"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('documentViewer.generating')}
                </>
              ) : (
                t('documentViewer.generateBrochure')
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
                {t('documentViewer.downloadPDF')}
              </button>
              
              {editUrl && previewUrl && (
                <>
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setIsEditMode(false)}
                      className={`px-4 py-2 rounded ${
                        !isEditMode 
                          ? 'bg-blue-600 text-white' 
                          : 'text-gray-600 hover:text-gray-800'
                      } transition-colors`}
                    >
                      {t('documentViewer.preview')}
                    </button>
                    <button
                      onClick={() => setIsEditMode(true)}
                      className={`px-4 py-2 rounded ${
                        isEditMode 
                          ? 'bg-green-600 text-white' 
                          : 'text-gray-600 hover:text-gray-800'
                      } transition-colors`}
                    >
                      {t('documentViewer.edit')}
                    </button>
                  </div>
                  {isEditMode && (
                    <button
                      onClick={toggleFullScreen}
                      className="text-green-600 hover:text-green-700 transition-colors"
                      title={t('documentViewer.editInFullscreen')}
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
      
      <div className="flex-grow bg-white relative">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-lg">{t('documentViewer.processingPresentation')}</p>
          </div>
        ) : previewUrl ? (
          <>
            <iframe 
              ref={iframeRef}
              src={isEditMode ? getEditUrl() : (previewUrl || '')}
              className="w-full h-full border-0 min-h-[600px]"
              title={isEditMode ? t('documentViewer.presentationEditor') : t('documentViewer.presentationPreview')}
              allowFullScreen
            />
            {isEditMode && (
              <div className="absolute bottom-4 right-4">
                <button
                  onClick={toggleFullScreen}
                  className="bg-green-600 text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-colors"
                  title={t('documentViewer.editInFullscreen')}
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
            <svg className="w-24 h-24 mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-gray-600 text-xl mb-3">{t('documentViewer.noBrochurePreview')}</p>
            <p className="text-gray-500 text-base">{t('documentViewer.clickGenerateBrochure')}</p>
            {error && (
              <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-md max-w-md">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}