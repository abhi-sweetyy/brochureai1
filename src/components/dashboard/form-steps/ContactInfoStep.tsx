"use client";

import React from 'react';
import { PropertyPlaceholders } from '@/types/placeholders';

interface ContactInfoStepProps {
  placeholders: PropertyPlaceholders;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  autoFilledFields: string[];
}

const ContactInfoStep: React.FC<ContactInfoStepProps> = ({ 
  placeholders, 
  handleInputChange,
  autoFilledFields
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-[#141f38] border border-[#1c2a47] rounded-lg p-6">
        <h3 className="text-white text-lg font-medium mb-4">Contact Information</h3>
        <p className="text-gray-400 mb-4">Enter contact details for this listing:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
              Phone Number
              {autoFilledFields.includes('phone_number') && (
                <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">AI Filled</span>
              )}
            </label>
            <input
              type="text"
              name="phone_number"
              value={placeholders.phone_number || ''}
              onChange={handleInputChange}
              className={`w-full rounded-md px-3 py-2 text-white ${
                autoFilledFields.includes('phone_number') 
                  ? 'bg-blue-900/20 border border-blue-500/30' 
                  : 'bg-[#1D2839] border border-[#2A3441]'
              }`}
              placeholder="Enter contact phone number"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
              Email Address
              {autoFilledFields.includes('email_address') && (
                <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">AI Filled</span>
              )}
            </label>
            <input
              type="email"
              name="email_address"
              value={placeholders.email_address || ''}
              onChange={handleInputChange}
              className={`w-full rounded-md px-3 py-2 text-white ${
                autoFilledFields.includes('email_address') 
                  ? 'bg-blue-900/20 border border-blue-500/30' 
                  : 'bg-[#1D2839] border border-[#2A3441]'
              }`}
              placeholder="Enter contact email address"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
              Website Name
              {autoFilledFields.includes('website_name') && (
                <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">AI Filled</span>
              )}
            </label>
            <input
              type="text"
              name="website_name"
              value={placeholders.website_name || ''}
              onChange={handleInputChange}
              className={`w-full rounded-md px-3 py-2 text-white ${
                autoFilledFields.includes('website_name') 
                  ? 'bg-blue-900/20 border border-blue-500/30' 
                  : 'bg-[#1D2839] border border-[#2A3441]'
              }`}
              placeholder="Enter website name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
              Broker Firm Name
              {autoFilledFields.includes('name_brokerfirm') && (
                <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">AI Filled</span>
              )}
            </label>
            <input
              type="text"
              name="name_brokerfirm"
              value={placeholders.name_brokerfirm || ''}
              onChange={handleInputChange}
              className={`w-full rounded-md px-3 py-2 text-white ${
                autoFilledFields.includes('name_brokerfirm') 
                  ? 'bg-blue-900/20 border border-blue-500/30' 
                  : 'bg-[#1D2839] border border-[#2A3441]'
              }`}
              placeholder="Enter broker firm name"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
              Broker Firm Address
              {autoFilledFields.includes('address_brokerfirm') && (
                <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">AI Filled</span>
              )}
            </label>
            <input
              type="text"
              name="address_brokerfirm"
              value={placeholders.address_brokerfirm || ''}
              onChange={handleInputChange}
              className={`w-full rounded-md px-3 py-2 text-white ${
                autoFilledFields.includes('address_brokerfirm') 
                  ? 'bg-blue-900/20 border border-blue-500/30' 
                  : 'bg-[#1D2839] border border-[#2A3441]'
              }`}
              placeholder="Enter broker firm address"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoStep; 