"use client";

import React from "react";
import { PropertyPlaceholders } from "@/types/placeholders";

interface ImagePlaceholders {
  "{{logo}}": string;
  "{{agent}}": string;
  "{{image1}}": string;
  "{{image2}}": string;
  "{{image3}}": string;
  "{{image4}}": string;
  "{{image5}}": string;
  "{{image6}}": string;
  "{{image7}}": string;
  "{{image8}}": string;
  "{{image9}}": string;
}

type UploadStage = "idle" | "uploading" | "complete" | "error";

interface ReviewStepProps {
  placeholders: PropertyPlaceholders;
  uploadStage: string;
  uploadedImages: ImagePlaceholders;
  logoUrl: string;
  selectedTemplate?: string;
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  placeholders,
  uploadStage,
  uploadedImages,
  logoUrl,
  selectedTemplate,
}) => {
  // Helper function to render a section
  const renderSection = (
    title: string,
    fields: { label: string; key: keyof PropertyPlaceholders }[],
  ) => (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-[#171717] mb-3">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {fields.map(({ label, key }) => (
          <div
            key={key}
            className="bg-[#F8F8FC] border border-gray-200 rounded-lg p-3"
          >
            <p className="text-sm text-gray-600">{label}</p>
            {key === "descriptionextralarge" || key === "descriptionlarge" ? (
              <div className="text-[#171717] mt-1 whitespace-pre-wrap">
                {placeholders[key] || "Not provided"}
              </div>
            ) : (
              <p className="text-[#171717] mt-1">
                {placeholders[key] || "Not provided"}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#171717] mb-4">
          {placeholders.title || "Untitled Project"}
        </h2>
        <p className="text-gray-600 mb-6">
          Please review all information before submitting.
        </p>
      </div>

      {/* Basic Information Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-[#171717] mb-3">
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#F8F8FC] border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-600">Title</p>
            <p className="text-[#171717] mt-1">
              {placeholders.title || "Not provided"}
            </p>
          </div>
          <div className="bg-[#F8F8FC] border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-600">Address</p>
            <p className="text-[#171717] mt-1">
              {placeholders.address || "Not provided"}
            </p>
          </div>
          <div className="bg-[#F8F8FC] border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-600">Price</p>
            <p className="text-[#171717] mt-1">
              {placeholders.price || "Not provided"}
            </p>
          </div>
          <div className="bg-[#F8F8FC] border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-600">Date Available</p>
            <p className="text-[#171717] mt-1">
              {placeholders.date_available || "Not provided"}
            </p>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-[#171717] mb-3">
          Descriptions
        </h3>
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-[#F8F8FC] border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-600">Short Description</p>
            <p className="text-[#171717] mt-1">
              {placeholders.shortdescription || "Not provided"}
            </p>
          </div>
          <div className="bg-[#F8F8FC] border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-600">Site Plan Description</p>
            <p className="text-[#171717] mt-1">
              {placeholders.descriptionlarge || "Not provided"}
            </p>
          </div>
          <div className="bg-[#F8F8FC] border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-600">Detailed Description</p>
            <div className="text-[#171717] mt-1 whitespace-pre-wrap">
              {placeholders.descriptionextralarge || "Not provided"}
            </div>
          </div>
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-[#171717] mb-3">
          Contact Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#F8F8FC] border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-600">Phone Number</p>
            <p className="text-[#171717] mt-1">
              {placeholders.phone_number || "Not provided"}
            </p>
          </div>
          <div className="bg-[#F8F8FC] border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-600">Email Address</p>
            <p className="text-[#171717] mt-1">
              {placeholders.email_address || "Not provided"}
            </p>
          </div>
          <div className="bg-[#F8F8FC] border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-600">Website Name</p>
            <p className="text-[#171717] mt-1">
              {placeholders.website_name || "Not provided"}
            </p>
          </div>
          <div className="bg-[#F8F8FC] border border-gray-200 rounded-lg p-3">
            <p className="text-sm text-gray-600">Broker Firm Name</p>
            <p className="text-[#171717] mt-1">
              {placeholders.name_brokerfirm || "Not provided"}
            </p>
          </div>
          <div className="bg-[#F8F8FC] border border-gray-200 rounded-lg p-3 md:col-span-2">
            <p className="text-sm text-gray-600">Broker Firm Address</p>
            <p className="text-[#171717] mt-1">
              {placeholders.address_brokerfirm || "Not provided"}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-[#171717] mb-3">Images</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Object.entries(uploadedImages).map(([placeholder, url], index) => (
            <div
              key={index}
              className="aspect-video bg-[#F8F8FC] border border-gray-200 rounded-lg overflow-hidden"
            >
              {url && typeof url === "string" ? (
                <img
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
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
