"use client";

import React from 'react';

interface ImagePlaceholders {
  '{{logo}}': string;
  '{{image3}}': string; // Project Layout
  '{{image1}}': string; // Project Photo 1
  '{{image2}}': string; // Project Photo 2
  '{{image4}}': string; // Agent Photo
}

type UploadStage = 'idle' | 'uploading' | 'complete' | 'error';

interface ReviewStepProps {
  projectData: any;
  uploadStage: UploadStage;
  uploadedImages: ImagePlaceholders;
  logoUrl: string;
  selectedTemplate?: string;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ projectData, uploadStage, uploadedImages, logoUrl, selectedTemplate }) => {
  // Helper function to render a section
  const renderSection = (title: string, fields: { label: string; key: string }[]) => (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-white mb-3">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(({ label, key }) => (
          <div key={key} className="bg-[#0A0A0A] border border-[#1D2839] rounded-lg p-3">
            <p className="text-sm text-[#8491A5]">{label}</p>
            <p className="text-white mt-1">{projectData[key] || 'Not provided'}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-4">{projectData.projectname || 'Untitled Project'}</h2>
        <p className="text-[#8491A5] mb-6">
          Please review all information before submitting.
        </p>
      </div>

      {renderSection('Basic Information', [
        { label: 'Project Name', key: 'projectname' },
        { label: 'Category', key: 'category' },
        { label: 'Address', key: 'address' }
      ])}

      {renderSection('Property Details', [
        { label: 'Year of Construction', key: 'yearofconstruction' },
        { label: 'Condition', key: 'condition' },
        { label: 'Quality of Equipment', key: 'qualityofequipment' },
        { label: 'Price', key: 'price' },
        { label: 'Space', key: 'space' },
        { label: 'Balcony', key: 'balcony' }
      ])}

      {renderSection('Features', [
        { label: 'Power Backup', key: 'powerbackup' },
        { label: 'Security', key: 'security' },
        { label: 'Gym', key: 'gym' },
        { label: 'Play Area', key: 'playarea' },
        { label: 'Maintenance', key: 'maintainence' }
      ])}

      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-3">Summary</h3>
        <div className="bg-[#0A0A0A] border border-[#1D2839] rounded-lg p-3">
          <p className="text-white whitespace-pre-wrap">{projectData.summary || 'Not provided'}</p>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-3">Layout Description</h3>
        <div className="bg-[#0A0A0A] border border-[#1D2839] rounded-lg p-3">
          <p className="text-white whitespace-pre-wrap">{projectData.layoutdescription || 'Not provided'}</p>
        </div>
      </div>

      {renderSection('Contact Information', [
        { label: 'Phone', key: 'phone' },
        { label: 'Email', key: 'email' },
        { label: 'Website', key: 'website' }
      ])}

      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-3">Images</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(uploadedImages).map(([placeholder, url], index) => (
            <div key={index} className="aspect-video bg-[#0A0A0A] border border-[#1D2839] rounded-lg overflow-hidden">
              {url ? (
                <img src={url} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-[#8491A5]">
                  No image uploaded for {placeholder}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewStep;