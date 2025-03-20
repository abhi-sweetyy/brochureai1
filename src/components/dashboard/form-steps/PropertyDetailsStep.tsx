"use client";

import React from 'react';

interface PropertyDetailsStepProps {
  projectData: {
    yearofconstruction: string;
    condition: string;
    qualityofequipment: string;
    price: string;
    space: string;
    balcony: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const PropertyDetailsStep: React.FC<PropertyDetailsStepProps> = ({ projectData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="yearofconstruction" className="block text-sm font-medium text-white mb-1">
          Year of Construction
        </label>
        <input
          type="text"
          id="yearofconstruction"
          name="yearofconstruction"
          value={projectData.yearofconstruction}
          onChange={handleInputChange}
          className="w-full bg-[#0A0A0A] border border-[#1D2839] rounded-lg px-4 py-2 text-white"
          placeholder="e.g. 2020"
        />
      </div>
      
      <div>
        <label htmlFor="condition" className="block text-sm font-medium text-white mb-1">
          Condition
        </label>
        <select
          id="condition"
          name="condition"
          value={projectData.condition}
          onChange={handleInputChange}
          className="w-full bg-[#0A0A0A] border border-[#1D2839] rounded-lg px-4 py-2 text-white"
        >
          <option value="">Select condition</option>
          <option value="New">New</option>
          <option value="Excellent">Excellent</option>
          <option value="Good">Good</option>
          <option value="Fair">Fair</option>
          <option value="Needs Renovation">Needs Renovation</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="qualityofequipment" className="block text-sm font-medium text-white mb-1">
          Quality of Equipment
        </label>
        <select
          id="qualityofequipment"
          name="qualityofequipment"
          value={projectData.qualityofequipment}
          onChange={handleInputChange}
          className="w-full bg-[#0A0A0A] border border-[#1D2839] rounded-lg px-4 py-2 text-white"
        >
          <option value="">Select quality</option>
          <option value="Luxury">Luxury</option>
          <option value="High-end">High-end</option>
          <option value="Standard">Standard</option>
          <option value="Basic">Basic</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="price" className="block text-sm font-medium text-white mb-1">
          Price
        </label>
        <input
          type="text"
          id="price"
          name="price"
          value={projectData.price}
          onChange={handleInputChange}
          className="w-full bg-[#0A0A0A] border border-[#1D2839] rounded-lg px-4 py-2 text-white"
          placeholder="e.g. $500,000"
        />
      </div>
      
      <div>
        <label htmlFor="space" className="block text-sm font-medium text-white mb-1">
          Space (sq ft/m²)
        </label>
        <input
          type="text"
          id="space"
          name="space"
          value={projectData.space}
          onChange={handleInputChange}
          className="w-full bg-[#0A0A0A] border border-[#1D2839] rounded-lg px-4 py-2 text-white"
          placeholder="e.g. 1500 sq ft"
        />
      </div>
      
      <div>
        <label htmlFor="balcony" className="block text-sm font-medium text-white mb-1">
          Balcony/Terrace
        </label>
        <input
          type="text"
          id="balcony"
          name="balcony"
          value={projectData.balcony}
          onChange={handleInputChange}
          className="w-full bg-[#0A0A0A] border border-[#1D2839] rounded-lg px-4 py-2 text-white"
          placeholder="e.g. Yes, 100 sq ft"
        />
      </div>
    </div>
  );
};

export default PropertyDetailsStep; 