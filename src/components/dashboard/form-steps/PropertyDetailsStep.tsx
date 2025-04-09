"use client";

import React from "react";
import { PropertyPlaceholders } from "@/types/placeholders";

interface PropertyDetailsStepProps {
  placeholders: PropertyPlaceholders;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  autoFilledFields: string[];
}

const PropertyDetailsStep: React.FC<PropertyDetailsStepProps> = ({
  placeholders,
  handleInputChange,
  autoFilledFields,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-[#171717] text-lg font-medium mb-4">
          Property Details
        </h3>
        <p className="text-gray-600 mb-4">
          Enter detailed information about the property:
        </p>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              Date Available
              {autoFilledFields.includes("date_available") && (
                <span className="ml-2 text-xs bg-[#5169FE]/10 text-[#5169FE] px-2 py-0.5 rounded">
                  AI Filled
                </span>
              )}
            </label>
            <input
              type="text"
              name="date_available"
              value={placeholders.date_available || ""}
              onChange={handleInputChange}
              className={`w-full rounded-md px-3 py-2 text-[#171717] ${
                autoFilledFields.includes("date_available")
                  ? "bg-[#5169FE]/5 border border-[#5169FE]/30"
                  : "bg-white border border-gray-300"
              } focus:ring-2 focus:ring-[#5169FE] focus:border-transparent`}
              placeholder="When is the property available?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              Site Plan & Position Description
              {autoFilledFields.includes("descriptionlarge") && (
                <span className="ml-2 text-xs bg-[#5169FE]/10 text-[#5169FE] px-2 py-0.5 rounded">
                  AI Filled
                </span>
              )}
            </label>
            <textarea
              name="descriptionlarge"
              value={placeholders.descriptionlarge || ""}
              onChange={handleInputChange}
              rows={4}
              className={`w-full rounded-md px-3 py-2 text-[#171717] ${
                autoFilledFields.includes("descriptionlarge")
                  ? "bg-[#5169FE]/5 border border-[#5169FE]/30"
                  : "bg-white border border-gray-300"
              } focus:ring-2 focus:ring-[#5169FE] focus:border-transparent`}
              placeholder="Enter information about the property's site plan and position"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              Detailed Property Description
              {autoFilledFields.includes("descriptionextralarge") && (
                <span className="ml-2 text-xs bg-[#5169FE]/10 text-[#5169FE] px-2 py-0.5 rounded">
                  AI Filled
                </span>
              )}
            </label>
            <textarea
              name="descriptionextralarge"
              value={placeholders.descriptionextralarge || ""}
              onChange={handleInputChange}
              rows={6}
              className={`w-full rounded-md px-3 py-2 text-[#171717] ${
                autoFilledFields.includes("descriptionextralarge")
                  ? "bg-[#5169FE]/5 border border-[#5169FE]/30"
                  : "bg-white border border-gray-300"
              } focus:ring-2 focus:ring-[#5169FE] focus:border-transparent`}
              placeholder="Enter detailed property description"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsStep;
