"use client";

import React from 'react';
import { PropertyPlaceholders } from '@/types/placeholders';

interface ImagePlaceholders {
  '{{logo}}': string;
  '{{image3}}': string; // Project Layout
  '{{image1}}': string; // Project Photo 1
  '{{image2}}': string; // Project Photo 2
  '{{image4}}': string; // Agent Photo
}

type UploadStage = 'idle' | 'uploading' | 'complete' | 'error';

interface ReviewStepProps {
  placeholders: PropertyPlaceholders;
  uploadStage: string;
  uploadedImages: ImagePlaceholders;
  logoUrl: string;
  selectedTemplate?: string;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ placeholders, uploadStage, uploadedImages, logoUrl, selectedTemplate }) => {
  // Helper function to render a section
  const renderSection = (title: string, fields: { label: string; key: keyof PropertyPlaceholders }[]) => (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-white mb-3">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(({ label, key }) => (
          <div key={key} className="bg-[#0A0A0A] border border-[#1D2839] rounded-lg p-3">
            <p className="text-sm text-[#8491A5]">{label}</p>
            {key === 'descriptionextralarge' || key === 'descriptionlarge' ? (
              <div className="text-white mt-1 whitespace-pre-wrap">{placeholders[key] || 'Not provided'}</div>
            ) : (
              <p className="text-white mt-1">{placeholders[key] || 'Not provided'}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white mb-4">{placeholders.title || 'Untitled Project'}</h2>
        <p className="text-[#8491A5] mb-6">
          Please review all information before submitting.
        </p>
      </div>

      {/* Basic Information Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-3">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0A0A0A] border border-[#1D2839] rounded-lg p-3">
            <p className="text-sm text-[#8491A5]">Title</p>
            <p className="text-white mt-1">{placeholders.title || 'Not provided'}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-[#1D2839] rounded-lg p-3">
            <p className="text-sm text-[#8491A5]">Address</p>
            <p className="text-white mt-1">{placeholders.address || 'Not provided'}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-[#1D2839] rounded-lg p-3">
            <p className="text-sm text-[#8491A5]">Price</p>
            <p className="text-white mt-1">{placeholders.price || 'Not provided'}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-[#1D2839] rounded-lg p-3">
            <p className="text-sm text-[#8491A5]">Date Available</p>
            <p className="text-white mt-1">{placeholders.date_available || 'Not provided'}</p>
          </div>
        </div>
      </div>
      
      {/* Description Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-3">Descriptions</h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-[#0A0A0A] border border-[#1D2839] rounded-lg p-3">
            <p className="text-sm text-[#8491A5]">Short Description</p>
            <p className="text-white mt-1">{placeholders.shortdescription || 'Not provided'}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-[#1D2839] rounded-lg p-3">
            <p className="text-sm text-[#8491A5]">Site Plan Description</p>
            <p className="text-white mt-1">{placeholders.descriptionlarge || 'Not provided'}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-[#1D2839] rounded-lg p-3">
            <p className="text-sm text-[#8491A5]">Detailed Description</p>
            <div className="text-white mt-1 whitespace-pre-wrap">{placeholders.descriptionextralarge || 'Not provided'}</div>
          </div>
        </div>
      </div>
      
      {/* Contact Information Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-3">Contact Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0A0A0A] border border-[#1D2839] rounded-lg p-3">
            <p className="text-sm text-[#8491A5]">Phone Number</p>
            <p className="text-white mt-1">{placeholders.phone_number || 'Not provided'}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-[#1D2839] rounded-lg p-3">
            <p className="text-sm text-[#8491A5]">Email Address</p>
            <p className="text-white mt-1">{placeholders.email_address || 'Not provided'}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-[#1D2839] rounded-lg p-3">
            <p className="text-sm text-[#8491A5]">Website Name</p>
            <p className="text-white mt-1">{placeholders.website_name || 'Not provided'}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-[#1D2839] rounded-lg p-3">
            <p className="text-sm text-[#8491A5]">Broker Firm Name</p>
            <p className="text-white mt-1">{placeholders.name_brokerfirm || 'Not provided'}</p>
          </div>
          <div className="bg-[#0A0A0A] border border-[#1D2839] rounded-lg p-3 md:col-span-2">
            <p className="text-sm text-[#8491A5]">Broker Firm Address</p>
            <p className="text-white mt-1">{placeholders.address_brokerfirm || 'Not provided'}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-white mb-3">Images</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(uploadedImages).map(([placeholder, url], index) => (
            <div key={index} className="aspect-video bg-[#0A0A0A] border border-[#1D2839] rounded-lg overflow-hidden">
              {url && typeof url === 'string' ? (
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