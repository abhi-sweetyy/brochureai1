"use client";

import { useSessionContext } from "@supabase/auth-helpers-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import Link from "next/link";
import {
  BasicInfoStep,
  PropertyDetailsStep,
  AmenitiesStep,
  ContactInfoStep,
  ReviewStep,
  ImagesStep,
  TemplateStep,
  PagesSelectionStep
} from '@/components/dashboard/form-steps';
import { availablePages, PageOption } from '@/components/dashboard/form-steps/PagesSelectionStep';
import { processPropertyDescription } from '@/utils/ai-helpers';
import { extractTitle, extractPrice, extractSpace, extractYear } from '@/utils/extractors';
import mammoth from 'mammoth';
import { toast } from 'react-hot-toast';
import { verifyApiConnection } from '@/utils/test-api';

// Define the steps for the form
const FORM_STEPS = [
  { title: "Template", description: "Select a template for your project" },
  { title: "Pages", description: "Select pages to include" },
  { title: "Basic Info", description: "Enter basic information about your project" },
  { title: "Property Details", description: "Enter property specifications" },
  { title: "Images", description: "Upload images for your project" },
  { title: "Amenities", description: "Add amenities and features" },
  { title: "Contact Info", description: "Add contact information" },
  { title: "Review", description: "Review your project before creating" }
];

interface Project {
  id: string;
  title: string;
  address: string;
  created_at: string;
  status: string;
  template_id: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  preview_image_url: string;
}

type UploadStage = 'idle' | 'uploading' | 'complete' | 'error';

interface ImagePlaceholders {
  '{{logo}}': string;
  '{{agent}}': string;
  '{{image1}}': string;
  '{{image2}}': string;
  '{{image3}}': string;
  '{{image4}}': string;
  '{{image5}}': string;
  '{{image6}}': string;
  '{{image7}}': string;
  '{{image8}}': string;
  '{{image9}}': string;
}

interface PropertyPlaceholders {
  phone_number: string;
  email_address: string;
  website_name: string;
  title: string;
  address: string;
  shortdescription: string;
  price: string;
  date_available: string;
  name_brokerfirm: string;
  descriptionlarge: string;
  descriptionextralarge: string;
  address_brokerfirm: string;
}

const Dashboard = () => {
  const { session, isLoading } = useSessionContext();
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [uploadStage, setUploadStage] = useState<UploadStage>('idle');
  const supabase = createClientComponentClient();
  const [error, setError] = useState<string | null>(null);
  const [uploadedImages, setUploadedImages] = useState<ImagePlaceholders>({
    '{{logo}}': '',
    '{{agent}}': '',
    '{{image1}}': '',
    '{{image2}}': '',
    '{{image3}}': '',
    '{{image4}}': '',
    '{{image5}}': '',
    '{{image6}}': '',
    '{{image7}}': '',
    '{{image8}}': '',
    '{{image9}}': ''
  });
  const [logoUrl, setLogoUrl] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  // Replace this:
  const [projectData, setProjectData] = useState({
    // Basic Info (Step 1)
    projectname: '',
    category: '',
    address: '',
    
    // Property Details (Step 2)
    yearofconstruction: '',
    condition: '',
    qualityofequipment: '',
    price: '',
    space: '',
    balcony: '',
    
    // Features (Step 3)
    powerbackup: '',
    security: '',
    gym: '',
    playarea: '',
    maintainence: '',
    summary: '',
    layoutdescription: '',
    
    // Contact Info (Step 4)
    phone: '',
    email: '',
    website: '',
    
    // Store amenities as an array
    amenities: [] as string[]
  });

  // With this:
  const [placeholders, setPlaceholders] = useState<PropertyPlaceholders>({
    phone_number: '',
    email_address: '',
    website_name: '',
    title: '',
    address: '',
    shortdescription: '',
    price: '',
    date_available: '',
    name_brokerfirm: '',
    descriptionlarge: '',
    descriptionextralarge: '',
    address_brokerfirm: ''
  });

  // Add new state for tracking auto-filled fields and raw property data
  const [autoFilledFields, setAutoFilledFields] = useState<string[]>([]);
  const [missingFields, setMissingFields] = useState<string[]>([]);
  const [rawPropertyData, setRawPropertyData] = useState<string>('');

  // Add selectedPages state
  const [selectedPages, setSelectedPages] = useState<Record<string, boolean>>(() => {
    // Initialize all pages as selected by default
    const initialPages: Record<string, boolean> = {};
    availablePages.forEach((page: PageOption) => {
      initialPages[page.id] = true;
    });
    return initialPages;
  });

  // Protect the dashboard route
  useEffect(() => {
    if (!session && !isLoading) {
      router.replace('/sign-in');
    }
  }, [session, isLoading, router]);

  // Check API connectivity on initial load
  useEffect(() => {
    const checkApiConnection = async () => {
      try {
        const result = await verifyApiConnection();
        
        if (!result.success) {
          // Show specific error messages based on the error type
          let errorMessage = "API connection failed.";
          
          switch (result.error) {
            case "API_KEY_MISSING":
              errorMessage = "OpenRouter API key is missing. Please add it to your .env file.";
              break;
            case "API_KEY_INVALID_FORMAT":
              errorMessage = "OpenRouter API key has invalid format. It should start with 'sk-or-v1-'.";
              break;
            case "API_KEY_INVALID":
              errorMessage = "Invalid OpenRouter API key. Please check your credentials.";
              break;
            case "API_RATE_LIMIT":
              errorMessage = "OpenRouter API rate limit exceeded. Please try again later.";
              break;
            case "NETWORK_ERROR":
              errorMessage = "Network error connecting to OpenRouter API. Check your internet connection.";
              break;
            default:
              errorMessage = result.message || "OpenRouter API connection failed.";
          }
          
          toast.error(errorMessage, { 
            id: "api-connection",
            duration: 10000
          });
          
          console.error("API connection error:", result.error, result.message);
        }
      } catch (error) {
        console.error("Error checking API connection:", error);
        toast.error("Failed to verify API connection", { 
          id: "api-connection",
          duration: 10000
        });
      }
    };
    
    checkApiConnection();
  }, []);

  // Fetch projects
  const fetchProjects = async () => {
    if (!session?.user?.id) return;
    
    const { data, error } = await supabase
      .from('real_estate_projects')
      .select('*')
      .eq('user_id', session.user.id)  // Filter by current user's ID
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching projects:', error);
      return;
    }

    if (data) {
      setProjects(data);
    }
  };

  // Fetch templates
  const fetchTemplates = async () => {
    const { data, error } = await supabase
      .from('templates')
      .select('*');

    if (data) {
      setTemplates(data);
    }
  };

  // Fetch credits
  const fetchCredits = async () => {
    if (session?.user) {
      const { data, error } = await supabase
        .from('users')
        .select('credits')
        .eq('id', session.user.id)
        .single();
      
      if (data) {
        setCredits(data.credits);
      }
    }
  };

  // Listen for credits updates
  useEffect(() => {
    const channel = supabase
      .channel('credits')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'users',
          filter: `id=eq.${session?.user?.id}`,
        },
        (payload: any) => {
          setCredits(payload.new.credits);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [session, supabase]);

  // Handle successful payment
  useEffect(() => {
    if (sessionId) {
      try {
        window.history.replaceState({}, '', '/dashboard');
        fetchProjects();
        fetchTemplates();
        fetchCredits();
      } catch (error) {
        console.error('Error handling successful payment:', error);
      }
    }
  }, [sessionId]);

  useEffect(() => {
    fetchProjects();
    fetchTemplates();
    fetchCredits();
  }, [supabase, session]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPlaceholders(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form navigation
  const goToNextStep = () => {
    // Validate current step before proceeding
    if (currentStep === 0 && !selectedTemplate) {
      setError('Please select a template to continue');
      return;
    }
    
    if (currentStep === 1 && !selectedPages) {
      setError('Please select pages to continue');
      return;
    }
    
    if (currentStep === 2 && !placeholders.title) {
      setError('Project title is required');
      return;
    }
    
    // Clear any previous errors
    setError(null);
    
    // Move to the next step
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Handle image uploads
  const handleImagesUploaded = (urls: string[]) => {
    console.log('Images uploaded:', urls);
    
    // Create a new copy of the uploadedImages object
    const newImages = { ...uploadedImages };
    
    // Map the uploaded URLs to the appropriate placeholders
    const keys = Object.keys(newImages) as Array<keyof ImagePlaceholders>;
    
    // Skip the logo key as it's handled separately
    const imageKeys = keys.filter(key => key !== '{{logo}}');
    
    // Update each image placeholder with its corresponding URL
    for (let i = 0; i < Math.min(urls.length, imageKeys.length); i++) {
      newImages[imageKeys[i]] = urls[i] || '';
    }
    
    setUploadedImages(newImages);
  };

  // Handle logo upload
  const handleLogoUploaded = (url: string) => {
    console.log('Logo uploaded:', url);
    setLogoUrl(url);
  };

  // Update the handleDocumentUpload function
  const handleDocumentUpload = async (text: string) => {
    try {
      // Display loading toast
      toast.loading("Extracting property information...", { id: "ai-extraction" });
      
      // Store raw text for later use
      setRawPropertyData(text);
      
      console.log("Starting AI extraction for:", text.substring(0, 100) + "...");
      
      // Check API key first
      const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
      if (!apiKey) {
        toast.error("API key not configured", { id: "ai-extraction" });
        return;
      }
      
      // Process the document text with AI
      const result = await processPropertyDescription(text);
      console.log("AI extraction result:", result);
      
      // Check if we got valid results
      if (!result) {
        toast.error("Failed to extract information from document", { id: "ai-extraction" });
        return;
      }
      
      // Update placeholders with AI results
      const newPlaceholders = { ...placeholders };
      const filledFields: string[] = [];
      
      // Loop through all placeholder fields
      Object.entries(result.placeholders || {}).forEach(([key, value]) => {
        if (value && typeof value === 'string' && value.trim() !== '') {
          // Update the value in our state
          newPlaceholders[key as keyof PropertyPlaceholders] = value;
          filledFields.push(key);
          console.log(`Field '${key}' filled with: "${value}"`);
        }
      });
      
      // Specifically log critical fields for debugging
      console.log("Title extracted:", newPlaceholders.title || "");
      console.log("Address extracted:", newPlaceholders.address || "");
      console.log("Price extracted:", newPlaceholders.price || "");
      
      // Update state with new values
      setPlaceholders(newPlaceholders);
      setAutoFilledFields(filledFields);
      
      // Show success message
      if (filledFields.length > 0) {
        toast.success(`Successfully extracted ${filledFields.length} field${filledFields.length > 1 ? 's' : ''}`, { id: "ai-extraction" });
        
        // Show warning if critical fields weren't extracted
        const missingCriticalFields = [];
        if (!filledFields.includes('title')) missingCriticalFields.push('Title');
        if (!filledFields.includes('address')) missingCriticalFields.push('Address');
        if (!filledFields.includes('price')) missingCriticalFields.push('Price');
        
        if (missingCriticalFields.length > 0) {
          toast(`Some critical fields couldn't be extracted: ${missingCriticalFields.join(', ')}. Please fill them manually.`, { 
            duration: 5000,
            icon: '⚠️'
          });
        }
      } else {
        toast.error("No fields could be extracted from the document. Please fill in fields manually.", { id: "ai-extraction" });
      }
      
    } catch (error) {
      console.error('Error in document upload:', error);
      toast.error("Error processing document. Please check console for details.", { id: "ai-extraction" });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If we're not on the final review step, just navigate to the next step
    if (currentStep < FORM_STEPS.length - 1) {
      goToNextStep();
      return;
    }
    
    // Ensure user is logged in
    if (!session?.user?.id) {
      setError('You must be logged in to create a project');
      return;
    }
    
    // Only proceed with project creation if we're on the final review step
    try {
      setError(null); // Clear any previous errors
      setUploadStage('uploading');
      
      // Validate required fields
      if (!placeholders.title) {
        setError('Property title is required');
        setUploadStage('idle');
        return;
      }
      
      if (!selectedTemplate) {
        setError('Please select a template');
        setUploadStage('idle');
        return;
      }
      
      // Prepare images array from the image placeholders
      const presentationImages = [];
      
      // Add logo first if it exists
      if (logoUrl) {
        presentationImages.push(logoUrl);
      }
      
      // Add agent photo if it exists
      if (uploadedImages['{{agent}}']) {
        presentationImages.push(uploadedImages['{{agent}}']);
      }
      
      // Define types for the image mapping
      type PageId = 'projectOverview' | 'buildingLayout' | 'exteriorPhotos' | 'interiorPhotos' | 'floorPlan' | 'energyCertificate';
      type ImagePlaceholderKey = keyof ImagePlaceholders;
      
      // Filter and add images based on selected pages
      const imageMapping: Record<PageId, ImagePlaceholderKey[]> = {
        'projectOverview': ['{{image1}}'],
        'buildingLayout': ['{{image2}}'],
        'exteriorPhotos': ['{{image3}}', '{{image4}}'],
        'interiorPhotos': ['{{image5}}', '{{image6}}'],
        'floorPlan': ['{{image7}}'],
        'energyCertificate': ['{{image8}}', '{{image9}}']
      };

      // Add images only for selected pages
      (Object.entries(selectedPages) as [PageId, boolean][]).forEach(([pageId, isSelected]) => {
        if (isSelected && imageMapping[pageId]) {
          imageMapping[pageId].forEach(placeholder => {
            if (uploadedImages[placeholder]) {
              presentationImages.push(uploadedImages[placeholder]);
            }
          });
        }
      });
      
      console.log('Creating project with images:', presentationImages);
      console.log('Selected pages:', selectedPages);
      
      // Get user ID directly from session
      const userId = session.user.id;
      
      // Create the project with all the placeholders and selected pages
      const { data: newProject, error: insertError } = await supabase
        .from('real_estate_projects')
        .insert({
          title: placeholders.title || '',
          address: placeholders.address || '',
          template_id: selectedTemplate,
          user_id: userId,
          project_details: {
            ...placeholders,
            raw_property_data: rawPropertyData,
            selected_pages: selectedPages,
            page_configuration: {
              selectedPages,
              imageMapping
            }
          },
          presentation_images: presentationImages,
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('Error creating project:', insertError);
        setError(insertError.message);
        setUploadStage('error');
        return;
      }
      
      console.log('Project created successfully:', newProject);
      setUploadStage('complete');
      
      // Use requestAnimationFrame to ensure state updates are complete before navigation
      requestAnimationFrame(() => {
        if (newProject) {
          // Use replace instead of push to prevent back navigation issues
          router.replace(`/project/${newProject.id}`);
        }
      });
      
    } catch (error: any) {
      console.error('Error in form submission:', error);
      setError(error.message || 'An unexpected error occurred');
      setUploadStage('error');
    }
  };

  // Handle template selection
  const handleTemplateSelection = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  // Add a function to handle amenities updates
  const handleAmenitiesChange = (amenities: string[]) => {
    setPlaceholders(prev => ({
      ...prev,
      amenities
    }));
  };

  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <TemplateStep 
          templates={templates} 
          selectedTemplate={selectedTemplate || ''} 
          onSelect={handleTemplateSelection}
        />;
      case 1:
        return <PagesSelectionStep 
          selectedPages={selectedPages}
          onPagesChange={setSelectedPages}
        />;
      case 2:
        return (
          <BasicInfoStep 
            placeholders={placeholders} 
            handleInputChange={handleInputChange}
            handleDocumentUpload={handleDocumentUpload}
            autoFilledFields={autoFilledFields}
          />
        );
      case 3:
        return (
          <PropertyDetailsStep 
            placeholders={placeholders} 
            handleInputChange={handleInputChange}
            autoFilledFields={autoFilledFields}
          />
        );
      case 4:
        return (
          <ImagesStep
            uploadedImages={uploadedImages}
            logoUrl={logoUrl}
            setUploadedImages={setUploadedImages}
            setLogoUrl={setLogoUrl}
            selectedPages={selectedPages}
          />
        );
      case 5:
        return (
          <AmenitiesStep 
            placeholders={placeholders}
            handleInputChange={handleInputChange}
          />
        );
      case 6:
        return (
          <ContactInfoStep 
            placeholders={placeholders} 
            handleInputChange={handleInputChange}
            autoFilledFields={autoFilledFields}
          />
        );
      case 7:
        return (
          <ReviewStep 
            placeholders={placeholders} 
            uploadStage={uploadStage} 
            uploadedImages={uploadedImages} 
            logoUrl={logoUrl} 
            selectedTemplate={selectedTemplate || undefined}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#070c1b]">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-white">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070c1b] text-white">
      {/* Background elements matching homepage */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
      </div>
      
      <DashboardHeader credits={credits} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white">My Brochures</h1>
            <p className="text-gray-400 mt-2">Create and manage your real estate brochures</p>
          </div>
          
          <button
            onClick={() => router.push('/dashboard/new')}
            className="group relative inline-flex items-center overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-3 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg focus:outline-none"
          >
            <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
            <span className="relative flex items-center text-white font-medium">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create New Brochure
            </span>
          </button>
        </div>
        
        {/* Project Creation Form */}
        <div className="bg-[#0c1324] border border-[#1c2a47] rounded-xl shadow-xl p-8 mb-12">
          <div className="flex items-center mb-8">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white">Create New Brochure</h2>
          </div>
          
          {/* Form Steps Progress */}
          <div className="mb-8">
            <div className="flex overflow-x-auto pb-2 hide-scrollbar">
              {FORM_STEPS.map((step, index) => (
                <div 
                  key={index}
                  className={`flex flex-col items-center min-w-[100px] ${
                    index === currentStep 
                      ? 'text-blue-500' 
                      : index < currentStep 
                        ? 'text-blue-400' 
                        : 'text-gray-500'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                    index === currentStep 
                      ? 'bg-blue-500 text-white' 
                      : index < currentStep 
                        ? 'bg-blue-500/20 text-blue-500' 
                        : 'bg-gray-800 text-gray-500'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="text-xs font-medium text-center">{step.title}</div>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-800 h-1 mt-4 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / (FORM_STEPS.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-lg mb-6 flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#111b33] border border-[#1c2a47] rounded-lg p-6">
              {renderStep()}
            </div>
            
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={goToPreviousStep}
                disabled={currentStep === 0}
                className="px-6 py-3 bg-[#111b33] text-white rounded-lg border border-[#1c2a47] hover:bg-[#192338] transition-colors disabled:opacity-50 disabled:hover:bg-[#111b33] flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              
              {currentStep < FORM_STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={goToNextStep}
                  className="group relative inline-flex items-center overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-3 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg focus:outline-none"
                >
                  <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
                  <span className="relative flex items-center text-white font-medium">
                    Next
                    <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={uploadStage === 'uploading'}
                  className="group relative inline-flex items-center overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-3 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg focus:outline-none disabled:opacity-70"
                >
                  <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
                  <span className="relative flex items-center text-white font-medium">
                    {uploadStage === 'uploading' ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        Create Brochure
                        <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </>
                    )}
                  </span>
                </button>
              )}
            </div>
          </form>
        </div>
        
        {/* Projects List */}
        <div className="bg-[#0c1324] border border-[#1c2a47] rounded-xl shadow-xl p-8">
          <div className="flex items-center mb-8">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center mr-4">
              <svg className="w-5 h-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white">Your Brochures</h2>
          </div>
          
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-[#111b33] rounded-lg border border-dashed border-[#1c2a47]">
              <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              <p className="text-gray-400 text-lg mb-2">You haven't created any brochures yet</p>
              <p className="text-gray-500 mb-6 max-w-md">Create your first professional real estate brochure with our easy-to-use AI templates</p>
              <button
                onClick={() => router.push('/dashboard/new')}
                className="group relative inline-flex items-center overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-3 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg focus:outline-none"
              >
                <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 transform bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
                <span className="relative flex items-center text-white font-medium">
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Create Your First Brochure
                </span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <Link 
                  href={`/project/${project.id}`} 
                  key={project.id}
                  className="group bg-[#111b33] border border-[#1c2a47] rounded-xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10 flex flex-col"
                >
                  <div className="h-40 bg-gradient-to-r from-blue-900/30 to-indigo-900/30 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-16 h-16 text-blue-500/20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z"/>
                      </svg>
                    </div>
                  </div>
                  
                  <div className="p-6 flex-grow">
                    <h3 className="font-medium text-lg text-white mb-2 group-hover:text-blue-400 transition-colors">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{project.address}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;