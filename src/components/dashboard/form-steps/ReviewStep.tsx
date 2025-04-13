"use client";

import React from "react";
import { useTranslation } from "react-i18next";
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
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  autoFilledFields: string[];
}

const ReviewStep: React.FC<ReviewStepProps> = ({
  placeholders,
  uploadStage,
  uploadedImages,
  logoUrl,
  selectedTemplate,
  handleInputChange,
  autoFilledFields,
}) => {
  const { t } = useTranslation();

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
        <h3 className="text-[#171717] text-lg font-medium mb-4">
          {t('review.title')}
        </h3>
        <p className="text-gray-600 mb-4">
          {t('review.description')}
        </p>

        <div className="grid grid-cols-1 gap-6 mb-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-medium mb-3">{t('review.basicInfo')}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">{t('review.propertyType')}</p>
                <p className="text-sm font-medium">
                  {placeholders.property_type || "---"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('review.pricePerMonth')}</p>
                <p className="text-sm font-medium">
                  €{placeholders.price || "---"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('review.propertySize')}</p>
                <p className="text-sm font-medium">
                  {placeholders.property_size
                    ? `${placeholders.property_size} m²`
                    : "---"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('review.rooms')}</p>
                <p className="text-sm font-medium">{placeholders.rooms || "---"}</p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-medium mb-3">{t('review.address')}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">{t('review.street')}</p>
                <p className="text-sm font-medium">
                  {placeholders.street || "---"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('review.city')}</p>
                <p className="text-sm font-medium">{placeholders.city || "---"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('review.zipCode')}</p>
                <p className="text-sm font-medium">
                  {placeholders.zip_code || "---"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('review.country')}</p>
                <p className="text-sm font-medium">
                  {placeholders.country || "---"}
                </p>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-medium mb-3">{t('review.description')}</h4>
            <p className="text-sm">
              {placeholders.description || t('review.noDescription')}
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-medium mb-3">{t('review.amenities')}</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                "balcony",
                "garden",
                "elevator",
                "parking",
                "furnished",
                "basement",
              ].map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  <span
                    className={`w-4 h-4 rounded-full ${
                      placeholders[amenity] === "true"
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  ></span>
                  <span className="text-sm">
                    {t(`review.amenity.${amenity}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-medium mb-3">{t('review.additionalFeatures')}</h4>
            <p className="text-sm">
              {placeholders.additional_features || t('review.noAdditionalFeatures')}
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="text-md font-medium mb-3">{t('review.contactInfo')}</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">{t('review.phoneNumber')}</p>
                <p className="text-sm font-medium">
                  {placeholders.phone_number || "---"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('review.emailAddress')}</p>
                <p className="text-sm font-medium">
                  {placeholders.email_address || "---"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('review.brokerFirm')}</p>
                <p className="text-sm font-medium">
                  {placeholders.name_brokerfirm || "---"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{t('review.websiteName')}</p>
                <p className="text-sm font-medium">
                  {placeholders.website_name || "---"}
                </p>
              </div>
            </div>
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
