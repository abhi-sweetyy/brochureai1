"use client";

import React from 'react';

interface ContactInfoStepProps {
  projectData: {
    phone: string;
    email: string;
    website: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const ContactInfoStep: React.FC<ContactInfoStepProps> = ({ projectData, handleInputChange }) => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={projectData.phone}
          onChange={handleInputChange}
          className="w-full bg-[#0A0A0A] border border-[#1D2839] rounded-lg px-4 py-2 text-white"
          placeholder="Enter contact phone number"
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={projectData.email}
          onChange={handleInputChange}
          className="w-full bg-[#0A0A0A] border border-[#1D2839] rounded-lg px-4 py-2 text-white"
          placeholder="Enter contact email"
        />
      </div>
      
      <div>
        <label htmlFor="website" className="block text-sm font-medium text-white mb-1">
          Website
        </label>
        <input
          type="url"
          id="website"
          name="website"
          value={projectData.website}
          onChange={handleInputChange}
          className="w-full bg-[#0A0A0A] border border-[#1D2839] rounded-lg px-4 py-2 text-white"
          placeholder="Enter website URL"
        />
      </div>
    </div>
  );
};

export default ContactInfoStep; 