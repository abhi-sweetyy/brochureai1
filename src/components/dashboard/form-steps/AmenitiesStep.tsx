"use client";

import React, { useState } from 'react';
import { PropertyPlaceholders } from '@/types/placeholders';

interface AmenitiesStepProps {
  placeholders: PropertyPlaceholders;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const AmenitiesStep: React.FC<AmenitiesStepProps> = ({ 
  placeholders, 
  handleInputChange 
}) => {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingLayout, setIsGeneratingLayout] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // This step could be used to extend the shortdescription, descriptionlarge, or descriptionextralarge
  // fields with AI-generated content based on the basic information

  const generateContent = async (contentType: 'shortdescription' | 'descriptionlarge' | 'descriptionextralarge') => {
    try {
      if (contentType === 'shortdescription') {
        setIsGeneratingSummary(true);
      } else {
        setIsGeneratingLayout(true);
      }
      
      setError(null);

      // Here you would typically call an AI API to generate content
      // For now, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Sample content for demonstration
      let generatedContent = '';
      
      if (contentType === 'shortdescription') {
        generatedContent = `Beautiful ${placeholders.title} located at ${placeholders.address}. Available for viewing today!`;
      } else if (contentType === 'descriptionlarge') {
        generatedContent = `This property features an excellent site plan with optimal positioning. ${placeholders.title} offers a great opportunity in a prime location.`;
      } else {
        generatedContent = `${placeholders.title} is a premium property located at ${placeholders.address}. With a competitive price of ${placeholders.price}, this property won't last long on the market. Contact us at ${placeholders.phone_number} to arrange a viewing.`;
      }
      
      // Update placeholder with generated content
      // This is where you'd typically use a function passed from props
      const event = {
        target: {
          name: contentType,
          value: generatedContent
        }
      } as React.ChangeEvent<HTMLTextAreaElement>;
      
      handleInputChange(event);
      
    } catch (error: any) {
      console.error('Error generating content:', error);
      setError(error.message || 'Failed to generate content');
    } finally {
      setIsGeneratingSummary(false);
      setIsGeneratingLayout(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-white text-lg font-medium mb-4">Additional Property Details & AI Assistance</h3>
        <p className="text-gray-400 mb-6">Enhance your property description with AI-generated content</p>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-[#111927] border border-[#1c2a47] rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-white font-medium mb-1">Short Description</h4>
                <p className="text-sm text-gray-400 mb-4">A brief summary of the property</p>
              </div>
              <button
                type="button"
                onClick={() => generateContent('shortdescription')}
                disabled={isGeneratingSummary}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center disabled:opacity-50"
              >
                {isGeneratingSummary ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Generate with AI
                  </>
                )}
              </button>
            </div>
            <textarea
              name="shortdescription"
              value={placeholders.shortdescription || ''}
              onChange={handleInputChange}
              rows={2}
              className="w-full bg-[#1D2839] border border-[#2A3441] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              placeholder="Enter a short property description"
            />
          </div>
          
          <div className="bg-[#111927] border border-[#1c2a47] rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-white font-medium mb-1">Site Plan Description</h4>
                <p className="text-sm text-gray-400 mb-4">Describe the property's site plan and position</p>
              </div>
              <button
                type="button"
                onClick={() => generateContent('descriptionlarge')}
                disabled={isGeneratingLayout}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center disabled:opacity-50"
              >
                {isGeneratingLayout ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Generate with AI
                  </>
                )}
              </button>
            </div>
            <textarea
              name="descriptionlarge"
              value={placeholders.descriptionlarge || ''}
              onChange={handleInputChange}
              rows={4}
              className="w-full bg-[#1D2839] border border-[#2A3441] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              placeholder="Enter details about the property's site plan and position"
            />
          </div>
          
          <div className="bg-[#111927] border border-[#1c2a47] rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-white font-medium mb-1">Detailed Property Description</h4>
                <p className="text-sm text-gray-400 mb-4">Provide a comprehensive description of the property</p>
              </div>
              <button
                type="button"
                onClick={() => generateContent('descriptionextralarge')}
                disabled={isGeneratingLayout}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm flex items-center disabled:opacity-50"
              >
                {isGeneratingLayout ? (
                  <>
                    <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Generate with AI
                  </>
                )}
              </button>
            </div>
            <textarea
              name="descriptionextralarge"
              value={placeholders.descriptionextralarge || ''}
              onChange={handleInputChange}
              rows={10}
              className="w-full bg-[#1D2839] border border-[#2A3441] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 mt-1"
              style={{ whiteSpace: 'pre-wrap' }}
              placeholder="Enter a detailed description of the property"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AmenitiesStep; 