"use client";

import React, { useState, useRef, useEffect } from 'react';
import mammoth from 'mammoth';
import { toast } from 'react-hot-toast';
import { PropertyPlaceholders } from '@/types/placeholders';

interface BasicInfoStepProps {
  placeholders: PropertyPlaceholders;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleDocumentUpload: (text: string) => Promise<void>;
  autoFilledFields: string[];
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ 
  placeholders, 
  handleInputChange,
  handleDocumentUpload,
  autoFilledFields
}) => {
  const [docText, setDocText] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log("BasicInfoStep rendered with placeholders:", placeholders);
    console.log("Auto-filled fields:", autoFilledFields);
  }, [placeholders, autoFilledFields]);

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDocText(e.target.value);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setUploadError(null);

      // Process different file types
      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setDocText(result.value);
      } else if (file.name.endsWith('.txt') || file.name.endsWith('.rtf')) {
        const text = await file.text();
        setDocText(text);
      } else {
        setUploadError('Please upload a .docx, .txt, or .rtf file');
        setIsProcessing(false);
        return;
      }

      setIsProcessing(false);
    } catch (error) {
      console.error('Error processing file:', error);
      setUploadError('Failed to process the document');
      setIsProcessing(false);
    }
  };

  const processDocument = async () => {
    if (!docText.trim()) {
      setUploadError('Please upload a document or paste property details');
      return;
    }

    try {
      setIsProcessing(true);
      setUploadError(null);
      
      console.log("Processing document with text:", docText.substring(0, 50) + "...");
      
      try {
        await handleDocumentUpload(docText);
        console.log("Document processed successfully");
      } catch (error) {
        console.error('Error processing document:', error);
        setUploadError('Failed to process property details. Please try again or fill in the fields manually.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const regenerateCriticalFields = async () => {
    if (!docText.trim()) {
      setUploadError('No document text available for regeneration');
      return;
    }

    try {
      setIsProcessing(true);
      toast.loading("Regenerating critical fields...", { id: "regenerate" });
      
      // Get the API key from environment variables
      const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
      
      if (!apiKey) {
        toast.error("API key not configured", { id: "regenerate" });
        setUploadError("API key not configured. Please check your environment variables.");
        setIsProcessing(false);
        return;
      }
      
      // Send a targeted request to extract just title, address and price
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Critical Fields Extractor'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-haiku:free', // More reliable model
          messages: [
            {
              role: 'system',
              content: `Extract ONLY these three critical fields from the real estate property text:
1. TITLE: A professional property title that includes property type and main feature.
2. ADDRESS: The complete property address or location.
3. PRICE: The property price with currency.

Output ONLY a JSON object with these three fields exactly. If information is not found, use an empty string.`
            },
            {
              role: 'user',
              content: docText
            }
          ],
          temperature: 0.1,
          response_format: { type: "json_object" }
        }),
      });
      
      if (!response.ok) {
        console.error(`API request failed with status ${response.status}`);
        toast.error(`API request failed with status ${response.status}`, { id: "regenerate" });
        setUploadError(`API request failed with status ${response.status}`);
        setIsProcessing(false);
        return;
      }
      
      const data = await response.json();
      
      if (!data?.choices?.[0]?.message?.content) {
        console.error("Invalid response format from AI service");
        toast.error("Invalid response from AI service", { id: "regenerate" });
        setUploadError("Invalid response from AI service");
        setIsProcessing(false);
        return;
      }
      
      let extractedContent;
      try {
        const content = data.choices[0].message.content;
        console.log("Raw AI response:", content.substring(0, 200));
        
        if (typeof content !== 'string') {
          throw new Error("Content is not a string");
        }
        
        extractedContent = JSON.parse(content.trim());
        console.log("Regenerated fields:", extractedContent);
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        toast.error("Failed to parse AI response", { id: "regenerate" });
        setUploadError("Failed to parse AI response");
        setIsProcessing(false);
        return;
      }
      
      // Only update fields that were successfully extracted
      let updatedCount = 0;
      
      if (extractedContent.title && typeof extractedContent.title === 'string') {
        const titleEvent = {
          target: {
            name: 'title',
            value: extractedContent.title
          }
        } as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(titleEvent);
        updatedCount++;
      }
      
      if (extractedContent.address && typeof extractedContent.address === 'string') {
        const addressEvent = {
          target: {
            name: 'address',
            value: extractedContent.address
          }
        } as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(addressEvent);
        updatedCount++;
      }
      
      if (extractedContent.price && typeof extractedContent.price === 'string') {
        const priceEvent = {
          target: {
            name: 'price',
            value: extractedContent.price
          }
        } as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(priceEvent);
        updatedCount++;
      }
      
      if (updatedCount > 0) {
        toast.success(`${updatedCount} critical field${updatedCount > 1 ? 's' : ''} regenerated`, { id: "regenerate" });
      } else {
        toast.error("Could not extract any critical fields", { id: "regenerate" });
        setUploadError("Could not extract any critical fields from the document");
      }
      
    } catch (error) {
      console.error("Error regenerating fields:", error);
      toast.error("Failed to regenerate fields", { id: "regenerate" });
      setUploadError("Failed to regenerate fields. Please try again or fill in fields manually.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-[#141f38] border border-[#1c2a47] rounded-lg p-6 mb-6">
        <h3 className="text-white text-lg font-medium mb-4">Property Details from Document</h3>
        <p className="text-gray-400 mb-4">Upload a document or paste property details below:</p>
        
        <div className="mb-4">
          <div className="flex items-center justify-center w-full">
            <label 
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-[#1D2839] border-[#2A3441] hover:bg-[#222f44]"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg className="w-8 h-8 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                </svg>
                <p className="mb-2 text-sm text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                <p className="text-xs text-gray-400">DOCX, TXT, or RTF (MAX. 10MB)</p>
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                className="hidden" 
                accept=".docx,.txt,.rtf" 
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-gray-400 text-sm mb-2">Or paste property details below:</p>
          <textarea
            value={docText}
            onChange={handleTextAreaChange}
            rows={10}
            className="w-full bg-[#1D2839] border border-[#2A3441] rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste property description text here..."
          ></textarea>
        </div>
        
        {uploadError && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-md mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{uploadError}</span>
          </div>
        )}
        
        <button
          type="button"
          onClick={processDocument}
          disabled={isProcessing || !docText.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:hover:bg-blue-600"
        >
          {isProcessing ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
                <polyline points="10 9 9 9 8 9"></polyline>
              </svg>
              Extract Information
            </>
          )}
        </button>
      </div>

      <div className="bg-[#141f38] border border-[#1c2a47] rounded-lg p-6">
        <h3 className="text-white text-lg font-medium mb-4">Required Information</h3>
        <p className="text-gray-400 mb-4">Fill in or edit the property details below:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
              Property Title*
              {autoFilledFields.includes('title') && (
                <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">AI Filled</span>
              )}
            </label>
            <input
              type="text"
              name="title"
              value={placeholders.title || ''}
              onChange={handleInputChange}
              className={`w-full rounded-md px-3 py-2 text-white ${
                autoFilledFields.includes('title') 
                  ? 'bg-blue-900/20 border border-blue-500/30' 
                  : 'bg-[#1D2839] border border-[#2A3441]'
              }`}
              placeholder="Enter property title"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
              Address*
              {autoFilledFields.includes('address') && (
                <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">AI Filled</span>
              )}
            </label>
            <input
              type="text"
              name="address"
              value={placeholders.address || ''}
              onChange={handleInputChange}
              className={`w-full rounded-md px-3 py-2 text-white ${
                autoFilledFields.includes('address') 
                  ? 'bg-blue-900/20 border border-blue-500/30' 
                  : 'bg-[#1D2839] border border-[#2A3441]'
              }`}
              placeholder="Enter property address"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
              Short Description
              {autoFilledFields.includes('shortdescription') && (
                <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">AI Filled</span>
              )}
            </label>
            <textarea
              name="shortdescription"
              value={placeholders.shortdescription || ''}
              onChange={handleInputChange}
              className={`w-full rounded-md px-3 py-2 text-white ${
                autoFilledFields.includes('shortdescription') 
                  ? 'bg-blue-900/20 border border-blue-500/30' 
                  : 'bg-[#1D2839] border border-[#2A3441]'
              }`}
              placeholder="Enter short property description"
              rows={2}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
              Price*
              {autoFilledFields.includes('price') && (
                <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">AI Filled</span>
              )}
            </label>
            <input
              type="text"
              name="price"
              value={placeholders.price || ''}
              onChange={handleInputChange}
              className={`w-full rounded-md px-3 py-2 text-white ${
                autoFilledFields.includes('price') 
                  ? 'bg-blue-900/20 border border-blue-500/30' 
                  : 'bg-[#1D2839] border border-[#2A3441]'
              }`}
              placeholder="Enter property price"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
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
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
              Site Plan Description
              {autoFilledFields.includes('descriptionlarge') && (
                <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">AI Filled</span>
              )}
            </label>
            <textarea
              name="descriptionlarge"
              value={placeholders.descriptionlarge || ''}
              onChange={handleInputChange}
              className={`w-full rounded-md px-3 py-2 text-white ${
                autoFilledFields.includes('descriptionlarge') 
                  ? 'bg-blue-900/20 border border-blue-500/30' 
                  : 'bg-[#1D2839] border border-[#2A3441]'
              }`}
              placeholder="Enter information about the property's site plan and position"
              rows={4}
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
              className={`w-full rounded-md px-3 py-2 text-white ${
                autoFilledFields.includes('descriptionextralarge') 
                  ? 'bg-blue-900/20 border border-blue-500/30' 
                  : 'bg-[#1D2839] border border-[#2A3441]'
              }`}
              placeholder="Enter detailed property description"
              rows={8}
              style={{ whiteSpace: 'pre-wrap' }}
            />
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={regenerateCriticalFields}
            disabled={isProcessing || !docText.trim()}
            className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-50"
          >
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Regenerate Title, Address & Price
          </button>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep; 