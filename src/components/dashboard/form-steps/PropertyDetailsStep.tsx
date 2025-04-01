"use client";

import React from 'react';
import { PropertyPlaceholders } from '@/types/placeholders';

interface PropertyDetailsStepProps {
  placeholders: PropertyPlaceholders;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  autoFilledFields: string[];
}

const PropertyDetailsStep: React.FC<PropertyDetailsStepProps> = ({ 
  placeholders, 
  handleInputChange,
  autoFilledFields
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-white text-lg font-medium mb-4">Property Details</h3>
        <p className="text-gray-400 mb-4">Enter detailed information about the property:</p>
        
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
              Date Available
              {autoFilledFields.includes('date_available') && (
                <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">AI Filled</span>
              )}
            </label>
            <input
              type="text"
              name="date_available"
              value={placeholders.date_available || ''}
              onChange={handleInputChange}
              className={`w-full rounded-md px-3 py-2 text-white ${
                autoFilledFields.includes('date_available') 
                  ? 'bg-blue-900/20 border border-blue-500/30' 
                  : 'bg-[#1D2839] border border-[#2A3441]'
              }`}
              placeholder="When is the property available?"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
              Site Plan & Position Description
              {autoFilledFields.includes('descriptionlarge') && (
                <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">AI Filled</span>
              )}
            </label>
            <textarea
              name="descriptionlarge"
              value={placeholders.descriptionlarge || ''}
              onChange={handleInputChange}
              rows={4}
              className={`w-full rounded-md px-3 py-2 text-white ${
                autoFilledFields.includes('descriptionlarge') 
                  ? 'bg-blue-900/20 border border-blue-500/30' 
                  : 'bg-[#1D2839] border border-[#2A3441]'
              }`}
              placeholder="Enter information about the property's site plan and position"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
              Detailed Property Description
              {autoFilledFields.includes('descriptionextralarge') && (
                <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">AI Filled</span>
              )}
            </label>
            <textarea
              name="descriptionextralarge"
              value={placeholders.descriptionextralarge || ''}
              onChange={handleInputChange}
              rows={6}
              className={`w-full rounded-md px-3 py-2 text-white ${
                autoFilledFields.includes('descriptionextralarge') 
                  ? 'bg-blue-900/20 border border-blue-500/30' 
                  : 'bg-[#1D2839] border border-[#2A3441]'
              }`}
              placeholder="Enter detailed property description"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsStep; 