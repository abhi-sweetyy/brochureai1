"use client";

import React from "react";

interface TemplateStepProps {
  templates: Array<{
    id: string;
    name: string;
    description: string;
    preview_image_url: string;
  }>;
  selectedTemplate: string;
  onSelect: (templateId: string) => void;
}

const TemplateStep: React.FC<TemplateStepProps> = ({
  templates,
  selectedTemplate,
  onSelect,
}) => {
  const defaultTemplates = [
    {
      id: "1Vr2RP8eZvxrGDKXxBOgwKo_d_U0xKEeI-k_qwXr-UYE", // Modern Real Estate
      name: "Modern Real Estate",
      description: "A clean, modern template perfect for luxury properties",
      preview_image_url: "/templates/modern-real-estate.png",
    },
    {
      id: "1DmJ6m2b4wvsSqXoYTXzJ3DTvN92oa8SFXwAaMQXYVYE", // Classic Property
      name: "Classic Property",
      description: "Traditional design with emphasis on property details",
      preview_image_url: "/templates/classic-property.png",
    },
    {
      id: "1X-okYwWgK9J5PKEjY5sJ5_ZvBf_kxdJ6Z2-dtXxGH_E", // Luxury Villa
      name: "Luxury Villa",
      description: "Elegant template designed for high-end properties",
      preview_image_url: "/templates/luxury-villa.png",
    },
  ];

  // Use provided templates or fall back to default templates
  const displayTemplates = templates.length > 0 ? templates : defaultTemplates;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayTemplates.map((template) => (
          <div
            key={template.id}
            className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
              selectedTemplate === template.id
                ? "border-[#5169FE] ring-2 ring-[#5169FE]/20"
                : "border-gray-200 hover:border-gray-400"
            }`}
            onClick={() => onSelect(template.id)}
          >
            <div className="aspect-video bg-gray-100 relative">
              {template.preview_image_url ? (
                <img
                  src={template.preview_image_url}
                  alt={template.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No preview available
                </div>
              )}
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2 bg-[#5169FE] text-white rounded-full p-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-4 bg-white">
              <h3 className="font-medium text-[#171717]">{template.name}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {template.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateStep;
