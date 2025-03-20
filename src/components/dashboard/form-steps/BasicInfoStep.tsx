"use client";

import React from 'react';

interface BasicInfoStepProps {
  projectData: {
    projectname: string;
    category: string;
    address: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ projectData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="projectname" className="block text-sm font-medium text-white mb-1">
          Project Name*
        </label>
        <input
          type="text"
          id="projectname"
          name="projectname"
          value={projectData.projectname}
          onChange={handleInputChange}
          className="w-full bg-[#0A0A0A] border border-[#1D2839] rounded-lg px-4 py-2 text-white"
          placeholder="Enter project name"
          required
        />
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-white mb-1">
          Category*
        </label>
        <select
          id="category"
          name="category"
          value={projectData.category}
          onChange={handleInputChange}
          className="w-full bg-[#0A0A0A] border border-[#1D2839] rounded-lg px-4 py-2 text-white"
          required
        >
          <option value="">Select category</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
          <option value="Industrial">Industrial</option>
          <option value="Land">Land</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-white mb-1">
          Address*
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={projectData.address}
          onChange={handleInputChange}
          className="w-full bg-[#0A0A0A] border border-[#1D2839] rounded-lg px-4 py-2 text-white"
          placeholder="Enter property address"
          required
        />
      </div>
    </div>
  );
};

export default BasicInfoStep; 