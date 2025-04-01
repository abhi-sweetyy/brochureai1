"use client";

import React, { useState, useEffect } from 'react';
import ImageUploader from '@/components/ImageUploader';
import { availablePages, PageOption } from './PagesSelectionStep';

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
  selectedPages: Record<string, boolean>;
}

const ImagesStep: React.FC<ImagesStepProps> = ({ 
  uploadedImages, 
  logoUrl, 
  setUploadedImages, 
  setLogoUrl,
  selectedPages
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

  // Get required image placeholders based on selected pages
  const getRequiredImagePlaceholders = () => {
    const requiredPlaceholders = new Set<string>();
    
    // Always include logo
    requiredPlaceholders.add('{{logo}}');
    
    // Add placeholders from selected pages
    availablePages.forEach(page => {
      if (selectedPages[page.id] && page.placeholderKeys) {
        page.placeholderKeys.forEach(key => requiredPlaceholders.add(key));
      }
    });
    
    return requiredPlaceholders;
  };

  // Update parent component with all images as an object
  const updateParent = () => {
    const newImages: ImagePlaceholders = {
      '{{logo}}': logo,
      '{{image1}}': image1,
      '{{image2}}': image2,
      '{{image3}}': image3,
      '{{image4}}': image4
    };
    setUploadedImages(newImages);
  };

  // Handle image updates
  const handleImageUpdate = (placeholder: keyof ImagePlaceholders, urls: string[]) => {
    const url = urls.length > 0 ? urls[0] : '';
    
    // Update local state
    switch (placeholder) {
      case '{{logo}}':
        setLogo(url);
        setLogoUrl(url);
        break;
      case '{{image1}}':
        setImage1(url);
        break;
      case '{{image2}}':
        setImage2(url);
        break;
      case '{{image3}}':
        setImage3(url);
        break;
      case '{{image4}}':
        setImage4(url);
        break;
    }
    
    // Create a new object for the parent update
    const newImages: ImagePlaceholders = {
      '{{logo}}': placeholder === '{{logo}}' ? url : logo,
      '{{image1}}': placeholder === '{{image1}}' ? url : image1,
      '{{image2}}': placeholder === '{{image2}}' ? url : image2,
      '{{image3}}': placeholder === '{{image3}}' ? url : image3,
      '{{image4}}': placeholder === '{{image4}}' ? url : image4
    };
    
    // Update parent state
    setUploadedImages(newImages);
  };

  // Get image sections to display
  const getImageSections = () => {
    const requiredPlaceholders = getRequiredImagePlaceholders();
    const sections: JSX.Element[] = [];

    // Image section configurations
    const imageConfigs = [
      {
        placeholder: '{{logo}}' as keyof ImagePlaceholders,
        title: 'Logo',
        description: 'Company or project logo'
      },
      {
        placeholder: '{{image1}}' as keyof ImagePlaceholders,
        title: 'Project Photo 1',
        description: 'Main project photo'
      },
      {
        placeholder: '{{image2}}' as keyof ImagePlaceholders,
        title: 'Project Photo 2',
        description: 'Secondary project photo'
      },
      {
        placeholder: '{{image3}}' as keyof ImagePlaceholders,
        title: 'Project Layout',
        description: 'Floor plan or layout image'
      },
      {
        placeholder: '{{image4}}' as keyof ImagePlaceholders,
        title: 'Agent Photo',
        description: 'Real estate agent photo'
      }
    ];

    // Add sections for required placeholders
    imageConfigs.forEach(config => {
      if (requiredPlaceholders.has(config.placeholder)) {
        sections.push(
          <div key={config.placeholder}>
            <h4 className="text-md font-medium text-white mb-2">{config.title}</h4>
            <p className="text-sm text-gray-400 mb-2">
              Placeholder: {config.placeholder}
              <br />
              <span className="text-xs">{config.description}</span>
            </p>
            <ImageUploader
              onImagesUploaded={(urls) => handleImageUpdate(config.placeholder, urls)}
              existingImages={uploadedImages[config.placeholder] ? [uploadedImages[config.placeholder]] : []}
              limit={1}
            />
          </div>
        );
      }
    });

    return sections;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-white mb-4">Upload Property Images</h3>
        <p className="text-[#8491A5] mb-6">
          Add high-quality images for your selected pages. Only the image upload fields for your selected pages will be shown.
        </p>
        
        <div className="space-y-8">
          {getImageSections()}
        </div>
      </div>
    </div>
  );
};

export default ImagesStep; 