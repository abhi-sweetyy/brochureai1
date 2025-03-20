"use client";

import React, { useState } from 'react';
import { MagicWandIcon } from '@radix-ui/react-icons';

interface AmenitiesStepProps {
  projectData: {
    amenities: string[];
    summary: string;
    layoutdescription: string;
    [key: string]: any;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleAmenitiesChange: (amenities: string[]) => void;
}

const AmenitiesStep: React.FC<AmenitiesStepProps> = ({ 
  projectData, 
  handleInputChange,
  handleAmenitiesChange
}) => {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingLayout, setIsGeneratingLayout] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Common amenities that match your database structure
  const commonAmenities = [
    { id: 'powerbackup', label: 'Power Backup' },
    { id: 'security', label: 'Security' },
    { id: 'gym', label: 'Gym' },
    { id: 'playarea', label: 'Play Area' },
    { id: 'maintainence', label: 'Maintenance' }
  ];

  // Handle checkbox changes - simplified for the new data structure
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    
    // Update the amenities array based on checkbox state
    if (checked) {
      // Add the amenity if it's not already in the array
      if (!projectData.amenities.includes(name)) {
        handleAmenitiesChange([...projectData.amenities, name]);
      }
    } else {
      // Remove the amenity from the array
      handleAmenitiesChange(projectData.amenities.filter(item => item !== name));
    }
  };

  const generateContent = async (contentType: 'summary' | 'layout') => {
    try {
      if (contentType === 'summary') {
        setIsGeneratingSummary(true);
      } else {
        setIsGeneratingLayout(true);
      }
      setError(null);

      // Collect all form inputs for more comprehensive prompt generation
      const formValues = Object.entries(projectData)
        .filter(([key, value]) => {
          // Filter out arrays, objects, and the current field we're generating
          return value !== undefined && 
                 value !== null && 
                 value !== '' && 
                 !Array.isArray(value) &&
                 typeof value !== 'object' &&
                 key !== 'summary' &&
                 key !== 'layoutdescription';
        })
        .map(([key, value]) => {
          // Format key to be more readable
          const formattedKey = key
            .replace(/([A-Z])/g, ' $1')
            .replace(/^./, str => str.toUpperCase())
            .trim();
            
          return `${formattedKey}: ${value}`;
        })
        .join('\n');
        
      // Format amenities for the prompt
      const amenitiesList = projectData.amenities.length > 0 
        ? projectData.amenities.map(id => {
            // Find the label for this amenity ID
            const amenity = commonAmenities.find(a => a.id === id);
            return amenity ? amenity.label : id;
          }).join(', ')
        : 'None';

      let prompt = '';
      if (contentType === 'summary') {
        prompt = `Generate a compelling property summary for a real estate listing with the following details:
          
${formValues}

Available Amenities: ${amenitiesList}

The summary should be engaging, highlight the key features, and be approximately 3-4 sentences long. Focus on the property's unique selling points and the available amenities.`;
      } else {
        prompt = `Generate a detailed layout description for a real estate property with the following details:
          
${formValues}

Available Amenities: ${amenitiesList}

The layout description should describe the floor plan, room arrangement, and special features of the property. It should be approximately 3-4 sentences long. Be specific about spatial arrangements and how the amenities fit into the overall layout.`;
      }

      // Show loading animation in the textarea
      const loadingMessage = `✨ Generating ${contentType === 'summary' ? 'property summary' : 'layout description'}...`;
      const loadingEvent = {
        target: {
          name: contentType === 'summary' ? 'summary' : 'layoutdescription',
          value: loadingMessage
        }
      } as React.ChangeEvent<HTMLTextAreaElement>;
      handleInputChange(loadingEvent);

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || ''}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Real Estate Project Generator'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.0-pro-exp-02-05:free',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 500
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.choices[0]?.message?.content?.trim() || '';

      const syntheticEvent = {
        target: {
          name: contentType === 'summary' ? 'summary' : 'layoutdescription',
          value: generatedText
        }
      } as React.ChangeEvent<HTMLTextAreaElement>;

      handleInputChange(syntheticEvent);

    } catch (err) {
      console.error('Error generating content:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate content');
      
      // Clear loading message on error
      const clearEvent = {
        target: {
          name: contentType === 'summary' ? 'summary' : 'layoutdescription',
          value: ''
        }
      } as React.ChangeEvent<HTMLTextAreaElement>;
      handleInputChange(clearEvent);
      
    } finally {
      if (contentType === 'summary') {
        setIsGeneratingSummary(false);
      } else {
        setIsGeneratingLayout(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <h2 className="text-xl font-semibold">Features & Amenities</h2>
      
      {/* Amenities checkboxes moved from property details */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {commonAmenities.map(amenity => (
            <div key={amenity.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={amenity.id}
                name={amenity.id}
                checked={projectData.amenities.includes(amenity.id)}
                onChange={handleCheckboxChange}
                className="h-4 w-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 bg-[#1D2839]"
              />
              <label htmlFor={amenity.id} className="text-sm text-gray-300">
                {amenity.label}
              </label>
            </div>
          ))}
        </div>
      </div>
      
      {/* Project Summary */}
      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Project Summary
          </label>
          <button
            type="button"
            onClick={() => generateContent('summary')}
            disabled={isGeneratingSummary}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded flex items-center space-x-1"
          >
            {isGeneratingSummary ? (
              <>
                <span>Generating</span>
                <div className="flex space-x-1 ml-1">
                  <div className="h-1 w-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-1 w-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-1 w-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </>
            ) : (
              <>
                <span>Generate with AI</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>
        </div>
        <div className="relative">
          <textarea
            name="summary"
            value={projectData.summary}
            onChange={handleInputChange}
            rows={4}
            className={`w-full bg-[#1D2839] border border-[#2A3441] rounded-md px-3 py-2 text-white ${isGeneratingSummary ? 'opacity-50' : ''}`}
            placeholder="Enter a summary of your project"
            disabled={isGeneratingSummary}
          ></textarea>
          {isGeneratingSummary && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>
      
      {/* Layout Description */}
      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Layout Description
          </label>
          <button
            type="button"
            onClick={() => generateContent('layout')}
            disabled={isGeneratingLayout}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded flex items-center space-x-1"
          >
            {isGeneratingLayout ? (
              <>
                <span>Generating</span>
                <div className="flex space-x-1 ml-1">
                  <div className="h-1 w-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-1 w-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-1 w-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </>
            ) : (
              <>
                <span>Generate with AI</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>
        </div>
        <div className="relative">
          <textarea
            name="layoutdescription"
            value={projectData.layoutdescription}
            onChange={handleInputChange}
            rows={4}
            className={`w-full bg-[#1D2839] border border-[#2A3441] rounded-md px-3 py-2 text-white ${isGeneratingLayout ? 'opacity-50' : ''}`}
            placeholder="Describe the layout of your property"
            disabled={isGeneratingLayout}
          ></textarea>
          {isGeneratingLayout && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AmenitiesStep; 