"use client";

import React, { useState, useEffect } from 'react';
import ImageUploader from '@/components/ImageUploader';

interface ImagePlaceholders {
  '{{logo}}': string;
  '{{image1}}': string; // Project Photo 1
  '{{image2}}': string; // Project Photo 2
  '{{image3}}': string; // Project Layout
  '{{image4}}': string; // Agent Photo
}

interface ImagesStepProps {
  uploadedImages: ImagePlaceholders;
  logoUrl: string;
  setUploadedImages: React.Dispatch<React.SetStateAction<ImagePlaceholders>>;
  setLogoUrl: (url: string) => void;
}

const ImagesStep: React.FC<ImagesStepProps> = ({ 
  uploadedImages, 
  logoUrl, 
  setUploadedImages, 
  setLogoUrl 
}) => {
  // Create completely separate state for each image
  const [logo, setLogo] = useState<string>(logoUrl || '');
  const [image1, setImage1] = useState<string>(uploadedImages['{{image1}}'] || '');
  const [image2, setImage2] = useState<string>(uploadedImages['{{image2}}'] || '');
  const [image3, setImage3] = useState<string>(uploadedImages['{{image3}}'] || '');
  const [image4, setImage4] = useState<string>(uploadedImages['{{image4}}'] || '');

  // Sync with props when they change
  useEffect(() => {
    setLogo(logoUrl || '');
    setImage1(uploadedImages['{{image1}}'] || '');
    setImage2(uploadedImages['{{image2}}'] || '');
    setImage3(uploadedImages['{{image3}}'] || '');
    setImage4(uploadedImages['{{image4}}'] || '');
  }, [logoUrl, uploadedImages]);

  // Update parent component with all images as an object
  const updateParent = () => {
    // Create a new ImagePlaceholders object
    const newImages: ImagePlaceholders = {
      '{{logo}}': logo,
      '{{image1}}': image1,
      '{{image2}}': image2,
      '{{image3}}': image3,
      '{{image4}}': image4
    };
    
    // Pass the object to the parent
    setUploadedImages(newImages);
  };

  // Handle image1 update with special attention
  const handleImage1Update = (urls: string[]) => {
    console.log("Project Photo 1 update received:", urls);
    
    const url = urls.length > 0 ? urls[0] : '';
    
    // Update local state
    setImage1(url);
    
    // Create a new object for the parent update to ensure it's treated as a new reference
    const newImages: ImagePlaceholders = {
      '{{logo}}': logo,
      '{{image1}}': url, // Use the new URL directly
      '{{image2}}': image2,
      '{{image3}}': image3,
      '{{image4}}': image4
    };
    
    console.log("Updating parent with new images:", newImages);
    
    // Update parent state
    setUploadedImages(newImages);
  };

  // Handle logo update separately
  const handleLogoUpdate = (urls: string[]) => {
    const url = urls.length > 0 ? urls[0] : '';
    setLogo(url);
    setLogoUrl(url); // Update parent's logoUrl
    
    // Create a new object for the parent update
    const newImages: ImagePlaceholders = {
      '{{logo}}': url, // Use the new URL directly
      '{{image1}}': image1,
      '{{image2}}': image2,
      '{{image3}}': image3,
      '{{image4}}': image4
    };
    
    // Update parent state
    setUploadedImages(newImages);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Upload Property Images</h3>
        <p className="text-[#8491A5] mb-6">
          Add high-quality images of your property to attract potential buyers or renters.
        </p>
        
        <div className="space-y-8">
          {/* Logo Upload */}
          <div>
            <h4 className="text-md font-medium text-white mb-2">Logo</h4>
            <p className="text-sm text-gray-400 mb-2">Placeholder: &#123;&#123;logo&#125;&#125;</p>
            <ImageUploader
              onImagesUploaded={handleLogoUpdate}
              existingImages={logo ? [logo] : []}
              limit={1}
            />
          </div>

          {/* Project Photo 1 - Using dedicated handler */}
          <div>
            <h4 className="text-md font-medium text-white mb-2">Project Photo 1</h4>
            <p className="text-sm text-gray-400 mb-2">Placeholder: &#123;&#123;image1&#125;&#125;</p>
            <ImageUploader
              onImagesUploaded={handleImage1Update}
              existingImages={image1 ? [image1] : []}
              limit={1}
            />
          </div>
          
          {/* Project Photo 2 */}
          <div>
            <h4 className="text-md font-medium text-white mb-2">Project Photo 2</h4>
            <p className="text-sm text-gray-400 mb-2">Placeholder: &#123;&#123;image2&#125;&#125;</p>
            <ImageUploader
              onImagesUploaded={(urls) => {
                const url = urls.length > 0 ? urls[0] : '';
                setImage2(url);
                
                // Create a new object for the parent update
                const newImages: ImagePlaceholders = {
                  '{{logo}}': logo,
                  '{{image1}}': image1,
                  '{{image2}}': url, // Use the new URL directly
                  '{{image3}}': image3,
                  '{{image4}}': image4
                };
                
                // Update parent state
                setUploadedImages(newImages);
              }}
              existingImages={image2 ? [image2] : []}
              limit={1}
            />
          </div>

          {/* Project Layout */}
          <div>
            <h4 className="text-md font-medium text-white mb-2">Project Layout</h4>
            <p className="text-sm text-gray-400 mb-2">Placeholder: &#123;&#123;image3&#125;&#125;</p>
            <ImageUploader
              onImagesUploaded={(urls) => {
                const url = urls.length > 0 ? urls[0] : '';
                setImage3(url);
                
                // Create a new object for the parent update
                const newImages: ImagePlaceholders = {
                  '{{logo}}': logo,
                  '{{image1}}': image1,
                  '{{image2}}': image2,
                  '{{image3}}': url, // Use the new URL directly
                  '{{image4}}': image4
                };
                
                // Update parent state
                setUploadedImages(newImages);
              }}
              existingImages={image3 ? [image3] : []}
              limit={1}
            />
          </div>

          {/* Agent Photo */}
          <div>
            <h4 className="text-md font-medium text-white mb-2">Agent Photo</h4>
            <p className="text-sm text-gray-400 mb-2">Placeholder: &#123;&#123;image4&#125;&#125;</p>
            <ImageUploader
              onImagesUploaded={(urls) => {
                const url = urls.length > 0 ? urls[0] : '';
                setImage4(url);
                
                // Create a new object for the parent update
                const newImages: ImagePlaceholders = {
                  '{{logo}}': logo,
                  '{{image1}}': image1,
                  '{{image2}}': image2,
                  '{{image3}}': image3,
                  '{{image4}}': url // Use the new URL directly
                };
                
                // Update parent state
                setUploadedImages(newImages);
              }}
              existingImages={image4 ? [image4] : []}
              limit={1}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagesStep; 