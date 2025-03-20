"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSessionContext } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import DocumentViewer from '@/components/DocumentViewer';
import ImageUploader from '@/components/ImageUploader';
import { toast } from 'react-hot-toast';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import { motion } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  address: string;
  presentation_images: string[];
  project_details: {
    website?: string;
    email?: string;
    phone?: string;
    summary?: string;
    category?: string;
    yearofconstruction?: string;
    condition?: string;
    qualityofequipment?: string;
    price?: string;
    space?: string;
    layoutdescription?: string;
    balcony?: boolean;
    amenities: string[];
    powerbackup?: boolean;
    security?: boolean;
    gym?: boolean;
    playarea?: boolean;
    maintainence?: string;
  };
  last_updated?: string;
  status?: string;
  template_id?: string;
  document_url?: string;
}

export default function ProjectEditor() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const { session } = useSessionContext();
  
  const [project, setProject] = useState<Project | null>(null);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [projectDetails, setProjectDetails] = useState<Project['project_details']>({
    amenities: []
  });
  const [shouldProcessDocument, setShouldProcessDocument] = useState(false);
  const [placeholders, setPlaceholders] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState('basic-info');
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [credits, setCredits] = useState<number | null>(null);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [isGeneratingLayout, setIsGeneratingLayout] = useState(false);

  // Fetch project data with security checks
  useEffect(() => {
    const fetchProject = async () => {
      try {
        setIsLoading(true);
        
        if (!session?.user?.id) {
          router.replace('/sign-in');
          return;
        }

        const { data: projectData, error } = await supabase
          .from('real_estate_projects')
          .select(`
            *,
            project_details
          `)
          .eq('id', params.id)
          .single();

        if (error) {
          throw error;
        }
        
        if (!projectData) {
          setError('Project not found');
          setIsLoading(false);
          return;
        }

        // Security check: Make sure the user owns this project
        if (projectData.user_id !== session.user.id) {
          setError('You do not have permission to view this project');
          setIsLoading(false);
          return;
        }
        
        // Merge column data with JSONB details
        const mergedData = {
          ...projectData,
          ...projectData.project_details,
          project_details: projectData.project_details || {}
        };

        setProject(mergedData);
        setUploadedImages(mergedData.presentation_images || []);
        setProjectDetails(mergedData.project_details);
        updatePlaceholders(mergedData);
      } catch (error: any) {
        console.error('Error fetching project:', error);
        setError(error.message || 'Failed to load project data');
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchProject();
    }
  }, [params.id, supabase, session, router]);

  // Initialize amenities as an empty array if it doesn't exist
  useEffect(() => {
    if (projectDetails && !projectDetails.amenities) {
      setProjectDetails(prev => ({
        ...prev,
        amenities: []
      }));
    }
  }, [projectDetails]);

  // Update placeholders
  const updatePlaceholders = (projectData: any) => {
    const details = projectData.project_details || {};
    const newPlaceholders: Record<string, string> = {
      '{{projectname}}': projectData.title || '',
      '{{website}}': details.website || '',
      '{{email}}': details.email || '',
      '{{summary}}': details.summary || '',
      '{{phone}}': details.phone || '',
      '{{address}}': projectData.address || '',
      '{{category}}': details.category || '',
      '{{yearofconstruction}}': details.yearofconstruction || '',
      '{{condition}}': details.condition || '',
      '{{qualityofequipment}}': details.qualityofequipment || '',
      '{{price}}': details.price || '',
      '{{space}}': details.space || '',
      '{{balcony}}': details.balcony ? 'Yes' : 'No',
      
      '{{powerbackup}}': details.amenities?.includes('powerbackup') ? 'Yes' : 'No',
      '{{security}}': details.amenities?.includes('security') ? 'Yes' : 'No',
      '{{gym}}': details.amenities?.includes('gym') ? 'Yes' : 'No',
      '{{playarea}}': details.amenities?.includes('playarea') ? 'Yes' : 'No',
      '{{maintainence}}': details.amenities?.includes('maintainence') ? 'Yes' : 'No',
      
      '{{layoutdescription}}': details.layoutdescription || '',
    };

    // For backward compatibility with templates that still expect amenity1, amenity2, etc.
    for (let i = 1; i <= 10; i++) {
      newPlaceholders[`{{amenity${i}}}`] = '';
      newPlaceholders[`{{ad${i}}}`] = '';
    }

    setPlaceholders(newPlaceholders);
  };

  // Handle save
  const handleSave = async () => {
    if (!session?.user?.id) {
      router.replace('/sign-in');
      return;
    }
    
    try {
      setUpdating(true);
      
      // Security check: Verify ownership before update
      const { data: projectCheck, error: checkError } = await supabase
        .from('real_estate_projects')
        .select('user_id')
        .eq('id', params.id)
        .single();
        
      if (checkError) throw checkError;
      
      if (!projectCheck || projectCheck.user_id !== session.user.id) {
        setError('You do not have permission to update this project');
        setUpdating(false);
        return;
      }
      
      // Make sure to include all the updated project details
      const updatePayload = {
        title: project!.title,
        address: project!.address,
        user_id: session.user.id, // Ensure user_id is always set correctly
        project_details: projectDetails,
        presentation_images: uploadedImages,
        last_updated: new Date().toISOString()
      };

      const { error } = await supabase
        .from('real_estate_projects')
        .update(updatePayload)
        .eq('id', project!.id);

      if (error) throw error;
      
      // Show a visual success effect
      toast.success('Project saved successfully');
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Failed to save project');
      toast.error('Failed to save project');
    } finally {
      setUpdating(false);
    }
  };

  // Handle image replacement
  const handleImageReplace = async (index: number, file: File) => {
    try {
      setUploading(true);
      
      // Get the old image URL
      const oldImageUrl = uploadedImages[index];
      
      // Upload the new file with a unique name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${params.id}/${fileName}`;
      
      // Upload the file to the correct bucket
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('docx')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        throw new Error(`Failed to upload new image: ${uploadError.message}`);
      }
      
      // Get the public URL from the correct bucket
      const { data: publicUrlData } = supabase.storage
        .from('docx')
        .getPublicUrl(filePath);
      
      const newImageUrl = publicUrlData.publicUrl;
      
      // Create a new array with the replaced image
      const newImages = [...uploadedImages];
      newImages[index] = newImageUrl;
      
      // Update the database directly
      const { data: updateData, error: updateError } = await supabase
        .from('real_estate_projects')
        .update({ 
          presentation_images: newImages,
          last_updated: new Date().toISOString()
        })
        .eq('id', params.id)
        .select();
      
      if (updateError) {
        throw new Error(`Failed to update project: ${updateError.message}`);
      }
      
      // Update the state
      setUploadedImages(newImages);
      toast.success('Image replaced successfully');
      
      // Try to delete the old file if it exists
      if (oldImageUrl) {
        try {
          // Extract the path from the URL
          const urlParts = oldImageUrl.split('/');
          const bucketNameIndex = urlParts.findIndex(part => part === 'docx');
          
          if (bucketNameIndex >= 0 && bucketNameIndex < urlParts.length - 1) {
            const oldPath = urlParts.slice(bucketNameIndex + 1).join('/').split('?')[0];
            
            const { data: deleteData, error: deleteError } = await supabase.storage
              .from('docx')
              .remove([oldPath]);
          }
        } catch (deleteError) {
          console.error('Error during file deletion:', deleteError);
        }
      }
      
    } catch (error: any) {
      console.error('Image replacement failed:', error);
      toast.error(error.message || 'Failed to replace image');
    } finally {
      setUploading(false);
    }
  };

  // Handle document generation
  const handleGenerateDocument = () => {
    setGenerating(true);
    setShouldProcessDocument(true);
  };

  // Handle document processed
  const handleDocumentProcessed = () => {
    setGenerating(false);
    setShouldProcessDocument(false);
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const inputValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;
    
    // Update project details
    setProjectDetails(prev => ({
      ...prev,
      [name]: inputValue
    }));
  };

  // Helper function to handle amenity checkbox changes
  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    setProjectDetails(prev => {
      // Ensure amenities is initialized as an array
      const currentAmenities = prev.amenities || [];
      
      let newAmenities;
      if (checked) {
        // Add amenity if it doesn't exist
        newAmenities = currentAmenities.includes(amenityId) 
          ? currentAmenities 
          : [...currentAmenities, amenityId];
      } else {
        // Remove amenity if it exists
        newAmenities = currentAmenities.filter(a => a !== amenityId);
      }
      
      return {
        ...prev,
        amenities: newAmenities
      };
    });
  };

  // Handle image upload
  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      
      // Upload the new image
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${params.id}/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('docx')
        .upload(filePath, file);
      
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL from the correct bucket
      const { data: publicUrlData } = supabase.storage
        .from('docx')
        .getPublicUrl(filePath);
      
      const newImageUrl = publicUrlData.publicUrl;
      
      // Add the new image to the array
      const newImages = [...uploadedImages, newImageUrl];
      
      // Update the project in the database
      const { data: updateData, error: updateError } = await supabase
        .from('real_estate_projects')
        .update({ 
          presentation_images: newImages,
          last_updated: new Date().toISOString()
        })
        .eq('id', params.id)
        .select();
      
      if (updateError) {
        throw updateError;
      }
      
      // Only update the state after successful database update
      setUploadedImages(newImages);
      toast.success('Image uploaded successfully');
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

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

  useEffect(() => {
    if (session?.user) {
      fetchCredits();
    }
  }, [session]);

  // Update the handleGenerateSummary function
  const handleGenerateSummary = async () => {
    try {
      if (!session?.user?.id) {
        toast.error('You must be logged in to use AI features');
        return;
      }

      setIsGeneratingSummary(true);
      
      // Collect all form inputs for more comprehensive prompt generation
      const formValues = Object.entries(projectDetails)
        .filter(([key, value]) => {
          // Filter out arrays, objects, and the current field we're generating
          return value !== undefined && 
                 value !== null && 
                 value !== '' && 
                 !Array.isArray(value) &&
                 typeof value !== 'object' &&
                 key !== 'summary' &&
                 key !== 'layoutdescription' &&
                 key !== 'amenities';
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
      const commonAmenities = [
        { id: 'powerbackup', label: 'Power Backup' },
        { id: 'security', label: 'Security' },
        { id: 'gym', label: 'Gym' },
        { id: 'playarea', label: 'Play Area' },
        { id: 'maintainence', label: 'Maintenance' }
      ];
      
      const amenitiesList = projectDetails.amenities.length > 0 
        ? projectDetails.amenities.map(id => {
            // Find the label for this amenity ID
            const amenity = commonAmenities.find(a => a.id === id);
            return amenity ? amenity.label : id;
          }).join(', ')
        : 'None';

      // Create the prompt
      const prompt = `Generate a compelling property summary for a real estate listing with the following details:
        
Project Name: ${project?.title || 'Untitled Project'}
Address: ${project?.address || 'No address provided'}
${formValues}

Available Amenities: ${amenitiesList}

The summary should be engaging, highlight the key features, and be approximately 3-4 sentences long. Focus on the property's unique selling points and the available amenities.`;

      // Make request to OpenRouter API - exactly as in AmenitiesStep.tsx
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
      const generatedSummary = data.choices[0]?.message?.content?.trim() || '';
      
      // Update the projectDetails with the AI-generated summary
      const updatedProjectDetails = {
        ...projectDetails,
        summary: generatedSummary
      };
      
      setProjectDetails(updatedProjectDetails);

      // Update placeholders
      setPlaceholders(prev => ({
        ...prev,
        '{{summary}}': generatedSummary
      }));

      // Also update directly in Supabase for persistence
      const { error } = await supabase
        .from('real_estate_projects')
        .update({ 
          project_details: updatedProjectDetails,
          last_updated: new Date().toISOString()
        })
        .eq('id', params.id);
        
      if (error) {
        console.error('Error saving summary to database:', error);
        toast.error('Generated but failed to save to database');
        return;
      }

      toast.success('Summary generated successfully');
    } catch (error) {
      console.error('Error generating summary:', error);
      toast.error('Failed to generate summary');
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  // Update the handleGenerateLayout function
  const handleGenerateLayout = async () => {
    try {
      if (!session?.user?.id) {
        toast.error('You must be logged in to use AI features');
        return;
      }

      setIsGeneratingLayout(true);
      
      // Collect all form inputs for more comprehensive prompt generation
      const formValues = Object.entries(projectDetails)
        .filter(([key, value]) => {
          // Filter out arrays, objects, and the current field we're generating
          return value !== undefined && 
                 value !== null && 
                 value !== '' && 
                 !Array.isArray(value) &&
                 typeof value !== 'object' &&
                 key !== 'summary' &&
                 key !== 'layoutdescription' &&
                 key !== 'amenities';
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
      const commonAmenities = [
        { id: 'powerbackup', label: 'Power Backup' },
        { id: 'security', label: 'Security' },
        { id: 'gym', label: 'Gym' },
        { id: 'playarea', label: 'Play Area' },
        { id: 'maintainence', label: 'Maintenance' }
      ];
      
      const amenitiesList = projectDetails.amenities.length > 0 
        ? projectDetails.amenities.map(id => {
            // Find the label for this amenity ID
            const amenity = commonAmenities.find(a => a.id === id);
            return amenity ? amenity.label : id;
          }).join(', ')
        : 'None';

      // Create the prompt
      const prompt = `Generate a detailed layout description for a real estate property with the following details:
        
Project Name: ${project?.title || 'Untitled Project'}
Address: ${project?.address || 'No address provided'}
${formValues}

Available Amenities: ${amenitiesList}

The layout description should describe the floor plan, room arrangement, and special features of the property. It should be approximately 3-4 sentences long. Be specific about spatial arrangements and how the amenities fit into the overall layout.`;

      // Make request to OpenRouter API - exactly as in AmenitiesStep.tsx
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
      const generatedLayout = data.choices[0]?.message?.content?.trim() || '';
      
      // Update the projectDetails with the AI-generated layout description
      const updatedProjectDetails = {
        ...projectDetails,
        layoutdescription: generatedLayout
      };
      
      setProjectDetails(updatedProjectDetails);

      // Update placeholders
      setPlaceholders(prev => ({
        ...prev,
        '{{layoutdescription}}': generatedLayout
      }));

      // Also update directly in Supabase for persistence
      const { error } = await supabase
        .from('real_estate_projects')
        .update({ 
          project_details: updatedProjectDetails,
          last_updated: new Date().toISOString()
        })
        .eq('id', params.id);
        
      if (error) {
        console.error('Error saving layout to database:', error);
        toast.error('Generated but failed to save to database');
        return;
      }

      toast.success('Layout description generated successfully');
    } catch (error) {
      console.error('Error generating layout description:', error);
      toast.error('Failed to generate layout description');
    } finally {
      setIsGeneratingLayout(false);
    }
  };

  const renderContent = () => {
    if (!project) {
      return (
        <div className="flex items-center justify-center py-10">
          <div className="text-center">
            <p className="text-red-400">Project data not available</p>
          </div>
        </div>
      );
    }

    return (
      <>
        <h1 className="text-2xl font-bold">{project!.title || 'Untitled Project'}</h1>
        <p className="text-gray-400">{project!.address || 'No address'}</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          <div className="lg:col-span-7">
            <div className="bg-[#0c1324] border border-[#1c2a47] rounded-xl overflow-hidden mb-8 shadow-xl">
              <div className="flex border-b border-[#1c2a47]">
                <button
                  onClick={() => setActiveTab('basic-info')}
                  className={`flex-1 py-4 px-4 text-center text-sm font-medium ${
                    activeTab === 'basic-info' 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white' 
                      : 'text-gray-300 hover:bg-[#111b33] hover:text-white'
                  }`}
                >
                  Basic Info
                </button>
                <button
                  onClick={() => setActiveTab('property-details')}
                  className={`flex-1 py-4 px-4 text-center text-sm font-medium ${
                    activeTab === 'property-details' 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white' 
                      : 'text-gray-300 hover:bg-[#111b33] hover:text-white'
                  }`}
                >
                  Property Details
                </button>
                <button
                  onClick={() => setActiveTab('amenities')}
                  className={`flex-1 py-4 px-4 text-center text-sm font-medium ${
                    activeTab === 'amenities' 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white' 
                      : 'text-gray-300 hover:bg-[#111b33] hover:text-white'
                  }`}
                >
                  Amenities
                </button>
                <button
                  onClick={() => setActiveTab('images')}
                  className={`flex-1 py-4 px-4 text-center text-sm font-medium ${
                    activeTab === 'images' 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white' 
                      : 'text-gray-300 hover:bg-[#111b33] hover:text-white'
                  }`}
                >
                  Images
                </button>
              </div>

              <div className="p-6">
                {activeTab === 'basic-info' && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-white mb-1">
                        Project Name
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        value={project!.title || ''}
                        onChange={(e) => setProject(prev => prev ? {...prev, title: e.target.value} : null)}
                        className="w-full bg-[#111b33] border border-[#1c2a47] rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="website" className="block text-sm font-medium text-white mb-1">
                        Website
                      </label>
                      <input
                        type="text"
                        id="website"
                        name="website"
                        value={projectDetails.website || ''}
                        onChange={handleInputChange}
                        className="w-full bg-[#111b33] border border-[#1c2a47] rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={projectDetails.email || ''}
                        onChange={handleInputChange}
                        className="w-full bg-[#111b33] border border-[#1c2a47] rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-white mb-1">
                        Phone
                      </label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={projectDetails.phone || ''}
                        onChange={handleInputChange}
                        className="w-full bg-[#111b33] border border-[#1c2a47] rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-white mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={project!.address || ''}
                        onChange={(e) => setProject(prev => prev ? {...prev, address: e.target.value} : null)}
                        className="w-full bg-[#111b33] border border-[#1c2a47] rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'property-details' && (
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-white mb-1">
                        Category
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={projectDetails.category || ''}
                        onChange={handleInputChange}
                        className="w-full bg-[#111b33] border border-[#1c2a47] rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select category</option>
                        <option value="Residential">Residential</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Industrial">Industrial</option>
                        <option value="Land">Land</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="yearofconstruction" className="block text-sm font-medium text-white mb-1">
                        Year of Construction
                      </label>
                      <input
                        type="text"
                        id="yearofconstruction"
                        name="yearofconstruction"
                        value={projectDetails.yearofconstruction || ''}
                        onChange={handleInputChange}
                        className="w-full bg-[#111b33] border border-[#1c2a47] rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="condition" className="block text-sm font-medium text-white mb-1">
                        Condition
                      </label>
                      <select
                        id="condition"
                        name="condition"
                        value={projectDetails.condition || ''}
                        onChange={handleInputChange}
                        className="w-full bg-[#111b33] border border-[#1c2a47] rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select condition</option>
                        <option value="New">New</option>
                        <option value="Excellent">Excellent</option>
                        <option value="Good">Good</option>
                        <option value="Fair">Fair</option>
                        <option value="Poor">Poor</option>
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
                        value={projectDetails.price || ''}
                        onChange={handleInputChange}
                        className="w-full bg-[#111b33] border border-[#1c2a47] rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="space" className="block text-sm font-medium text-white mb-1">
                        Space (sq ft)
                      </label>
                      <input
                        type="text"
                        id="space"
                        name="space"
                        value={projectDetails.space || ''}
                        onChange={handleInputChange}
                        className="w-full bg-[#111b33] border border-[#1c2a47] rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}

                {activeTab === 'amenities' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-white">Features & Amenities</h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="powerbackup"
                          name="powerbackup"
                          checked={projectDetails.amenities?.includes('powerbackup') || false}
                          onChange={(e) => handleAmenityChange('powerbackup', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="powerbackup" className="ml-2 block text-sm text-white">
                          Power Backup
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="security"
                          name="security"
                          checked={projectDetails.amenities?.includes('security') || false}
                          onChange={(e) => handleAmenityChange('security', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="security" className="ml-2 block text-sm text-white">
                          Security
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="gym"
                          name="gym"
                          checked={projectDetails.amenities?.includes('gym') || false}
                          onChange={(e) => handleAmenityChange('gym', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="gym" className="ml-2 block text-sm text-white">
                          Gym
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="playarea"
                          name="playarea"
                          checked={projectDetails.amenities?.includes('playarea') || false}
                          onChange={(e) => handleAmenityChange('playarea', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="playarea" className="ml-2 block text-sm text-white">
                          Play Area
                        </label>
                      </div>
                      
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="maintainence"
                          name="maintainence"
                          checked={projectDetails.amenities?.includes('maintainence') || false}
                          onChange={(e) => handleAmenityChange('maintainence', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="maintainence" className="ml-2 block text-sm text-white">
                          Maintenance
                        </label>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="summary" className="block text-sm font-medium text-white">
                          Project Summary
                        </label>
                        <button
                          onClick={handleGenerateSummary}
                          disabled={isGeneratingSummary}
                          className="group relative inline-flex items-center overflow-hidden rounded-md bg-gradient-to-r from-blue-600 to-indigo-700 px-3 py-1 text-xs font-medium text-white transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg focus:outline-none disabled:opacity-70"
                        >
                          {isGeneratingSummary ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Generating...
                            </>
                          ) : (
                            <>Generate with AI</>
                          )}
                        </button>
                      </div>
                      <motion.div
                        initial={{ opacity: 0.8 }}
                        animate={{
                          opacity: isGeneratingSummary ? [0.5, 1, 0.5] : 1,
                          transition: {
                            duration: 2,
                            repeat: isGeneratingSummary ? Infinity : 0
                          }
                        }}
                      >
                        <textarea
                          id="summary"
                          name="summary"
                          value={projectDetails.summary || ''}
                          onChange={handleInputChange}
                          rows={4}
                          className={`w-full bg-[#111b33] border ${isGeneratingSummary ? 'border-blue-500/50' : 'border-[#1c2a47]'} rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300`}
                          placeholder="Enter a summary of your project or use AI to generate one"
                          disabled={isGeneratingSummary}
                        />
                      </motion.div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label htmlFor="layoutdescription" className="block text-sm font-medium text-white">
                          Layout Description
                        </label>
                        <button
                          onClick={handleGenerateLayout}
                          disabled={isGeneratingLayout}
                          className="group relative inline-flex items-center overflow-hidden rounded-md bg-gradient-to-r from-blue-600 to-indigo-700 px-3 py-1 text-xs font-medium text-white transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg focus:outline-none disabled:opacity-70"
                        >
                          {isGeneratingLayout ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Generating...
                            </>
                          ) : (
                            <>Generate with AI</>
                          )}
                        </button>
                      </div>
                      <motion.div
                        initial={{ opacity: 0.8 }}
                        animate={{
                          opacity: isGeneratingLayout ? [0.5, 1, 0.5] : 1,
                          transition: {
                            duration: 2,
                            repeat: isGeneratingLayout ? Infinity : 0
                          }
                        }}
                      >
                        <textarea
                          id="layoutdescription"
                          name="layoutdescription"
                          value={projectDetails.layoutdescription || ''}
                          onChange={handleInputChange}
                          rows={4}
                          className={`w-full bg-[#111b33] border ${isGeneratingLayout ? 'border-blue-500/50' : 'border-[#1c2a47]'} rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300`}
                          placeholder="Describe the layout of your property or use AI to generate a description"
                          disabled={isGeneratingLayout}
                        />
                      </motion.div>
                    </div>
                  </div>
                )}

                {activeTab === 'images' && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-medium text-white mb-4">Uploaded Images</h3>
                    
                    <ImageUploader
                      images={uploadedImages}
                      onUpload={handleImageUpload}
                      onReplace={handleImageReplace}
                      uploading={uploading}
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-between p-6 border-t border-[#1c2a47]">
                <button
                  onClick={() => {
                    if (activeTab === 'property-details') setActiveTab('basic-info');
                    else if (activeTab === 'amenities') setActiveTab('property-details');
                    else if (activeTab === 'images') setActiveTab('amenities');
                  }}
                  disabled={activeTab === 'basic-info'}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'basic-info'
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gray-700 hover:bg-gray-600'
                  }`}
                >
                  Previous
                </button>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSave}
                  disabled={updating}
                  className="group relative inline-flex items-center overflow-hidden rounded-md bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-2 transition-all duration-300 ease-out hover:shadow-lg focus:outline-none disabled:opacity-70"
                >
                  {updating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>Save Changes</>
                  )}
                </motion.button>
                
                <button
                  onClick={() => {
                    if (activeTab === 'basic-info') setActiveTab('property-details');
                    else if (activeTab === 'property-details') setActiveTab('amenities');
                    else if (activeTab === 'amenities') setActiveTab('images');
                  }}
                  disabled={activeTab === 'images'}
                  className={`px-4 py-2 rounded-md text-sm font-medium ${
                    activeTab === 'images'
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#111827] rounded-lg overflow-hidden border border-[#1c2a47] sticky top-8 h-full">
              <DocumentViewer
                projectId={params.id as string}
                placeholders={placeholders}
                images={uploadedImages}
                shouldProcess={shouldProcessDocument}
                onImagesUpdate={(newImages) => setUploadedImages(newImages)}
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#070c1b] text-white">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
      </div>
      
      <DashboardHeader credits={credits} userEmail={session?.user?.email} />
      
      <div className="container mx-auto px-4 py-12">
        {error ? (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p>{error}</p>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
          </div>
        ) : !project ? (
          <div className="flex items-center justify-center py-10">
            <div className="text-center">
              <p className="text-red-400">Project data not available</p>
            </div>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
}
