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

// Define only the fields we need for our placeholders
interface Project {
  id: string;
  title: string;
  address: string;
  presentation_images: string[];
  project_details: {
    phone_number?: string;
    email_address?: string;
    website_name?: string;
    // title is from the main project
    // address is from the main project
    shortdescription?: string;
    price?: string;
    date_available?: string;
    name_brokerfirm?: string;
    descriptionlarge?: string;
    descriptionextralarge?: string;
    address_brokerfirm?: string;
    amenities?: string[];
    selected_pages?: Record<string, boolean>;
  };
  presentation_id?: string;
  last_updated?: string;
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

        // Extract existing placeholder values from projectData.project_details if they exist
        const existingDetails = projectData.project_details || {};
        
        // Build our focused project details with just what we need
        const focusedDetails: Project['project_details'] = {
          phone_number: existingDetails.phone_number || existingDetails.phone || '',
          email_address: existingDetails.email_address || existingDetails.email || '',
          website_name: existingDetails.website_name || existingDetails.website || '',
          shortdescription: existingDetails.shortdescription || existingDetails.summary || '',
          price: existingDetails.price || '',
          date_available: existingDetails.date_available || existingDetails.yearofconstruction || '',
          name_brokerfirm: existingDetails.name_brokerfirm || '',
          descriptionlarge: existingDetails.descriptionlarge || existingDetails.layoutdescription || '',
          descriptionextralarge: existingDetails.descriptionextralarge || existingDetails.summary || '',
          address_brokerfirm: existingDetails.address_brokerfirm || projectData.address || '',
          amenities: existingDetails.amenities || [],
          selected_pages: existingDetails.selected_pages || {}
        };
        
        // Create a focused project object with only what we need
        const focusedProject = {
          id: projectData.id,
          title: projectData.title,
          address: projectData.address,
          presentation_images: projectData.presentation_images || [],
          project_details: focusedDetails,
          presentation_id: projectData.presentation_id,
          last_updated: projectData.last_updated
        };

        setProject(focusedProject);
        setUploadedImages(focusedProject.presentation_images);
        setProjectDetails(focusedDetails);
        
        // Set the placeholders based on our focused data structure
        setPlaceholders({
          'phone_number': focusedDetails.phone_number || '',
          'email_address': focusedDetails.email_address || '',
          'website_name': focusedDetails.website_name || '',
          'title': projectData.title || '',
          'address': projectData.address || '',
          'shortdescription': focusedDetails.shortdescription || '',
          'price': focusedDetails.price || '',
          'date_available': focusedDetails.date_available || '',
          'name_brokerfirm': focusedDetails.name_brokerfirm || '',
          'descriptionlarge': focusedDetails.descriptionlarge || '',
          'descriptionextralarge': focusedDetails.descriptionextralarge || '',
          'address_brokerfirm': focusedDetails.address_brokerfirm || ''
        });
        
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

  // Handle input change - updating both projectDetails and placeholders
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    console.log(`Updating ${name} with value: ${value.substring(0, 30)}...`);
    
    // Update project details with functional update
    setProjectDetails(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Update placeholders directly with functional update
    setPlaceholders(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle title/address changes which are special cases
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Functional update for project state
    setProject(prev => {
      if (!prev) return null;
      return {
        ...prev,
        title: value
      };
    });
    
    // Functional update for placeholders
    setPlaceholders(prev => ({
      ...prev, 
      title: value
    }));
  };
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Functional update for project state
    setProject(prev => {
      if (!prev) return null;
      return {
        ...prev,
        address: value
      };
    });
    
    // Functional update for placeholders
    setPlaceholders(prev => ({
      ...prev, 
      address: value,
      address_brokerfirm: value
    }));
  };

  // Handle saving the focused project details
  const handleSave = async () => {
    if (!session?.user?.id || !project) {
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
      
      // Prepare update payload - IMPORTANT: don't modify original project details structure
      const { data: currentProject } = await supabase
        .from('real_estate_projects')
        .select('project_details')
        .eq('id', project.id)
        .single();
      
      // Create a new object with current project details as base
      const updatedProjectDetails = {
        ...(currentProject?.project_details || {}),
        // Update only our specific placeholders
        phone_number: projectDetails.phone_number,
        email_address: projectDetails.email_address,
        website_name: projectDetails.website_name,
        shortdescription: projectDetails.shortdescription,
        price: projectDetails.price,
        date_available: projectDetails.date_available,
        name_brokerfirm: projectDetails.name_brokerfirm,
        descriptionlarge: projectDetails.descriptionlarge,
        descriptionextralarge: projectDetails.descriptionextralarge,
        address_brokerfirm: projectDetails.address_brokerfirm,
        selected_pages: currentProject?.project_details?.selected_pages || {} // Preserve selected pages
      };
      
      const updatePayload = {
        title: project.title,
        address: project.address,
        project_details: updatedProjectDetails,
        presentation_images: uploadedImages,
        last_updated: new Date().toISOString()
      };

      const { error } = await supabase
        .from('real_estate_projects')
        .update(updatePayload)
        .eq('id', project.id);

      if (error) throw error;
      
      // Update local state safely with the new data
      setProject(prev => {
        if (!prev) return null;
        return {
          ...prev,
          title: project.title,
          address: project.address,
          project_details: {
            ...prev.project_details,
            ...projectDetails
          },
          presentation_images: uploadedImages,
          last_updated: new Date().toISOString()
        };
      });
      
      toast.success('Project saved successfully');
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Failed to save project');
      toast.error('Failed to save project');
    } finally {
      setUpdating(false);
    }
  };

  // Handle image upload
  const handleImagesUploaded = async (urls: string[]) => {
    try {
      setUploading(true);
      
      // Combine existing images with new ones
      const newImages = [...uploadedImages, ...urls];
      
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
      toast.success('Images uploaded successfully');
      
    } catch (error) {
      console.error('Error uploading images:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  // Handle image removal
  const handleImageRemove = async (index: number) => {
    try {
      setUploading(true);
      
      // Get the image URL to be removed
      const imageToRemove = uploadedImages[index];
      
      // Create new array without the removed image
      const newImages = uploadedImages.filter((_, i) => i !== index);
      
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
      
      // Update state
      setUploadedImages(newImages);
      
      // Try to delete the file from storage
      if (imageToRemove) {
        try {
          const urlParts = imageToRemove.split('/');
          const bucketNameIndex = urlParts.findIndex(part => part === 'docx');
          
          if (bucketNameIndex >= 0 && bucketNameIndex < urlParts.length - 1) {
            const filePath = urlParts.slice(bucketNameIndex + 1).join('/').split('?')[0];
            
            await supabase.storage
              .from('docx')
              .remove([filePath]);
          }
        } catch (deleteError) {
          console.error('Error deleting file from storage:', deleteError);
        }
      }
      
      toast.success('Image removed successfully');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    } finally {
      setUploading(false);
    }
  };

  // Fetch user credits
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

    // Add handler for presentation generation
    const handlePresentationGenerated = () => {
      // Use functional update to prevent race conditions
      setProject(prev => {
        if (!prev) return null;
        return {
          ...prev,
          presentation_id: 'generated'
        };
      });
    };

    return (
      <>
        <h1 className="text-2xl font-bold">{project.title || 'Untitled Project'}</h1>
        <p className="text-gray-400">{project.address || 'No address'}</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {!project.presentation_id && (
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
                    Property Info
                  </button>
                  <button
                    onClick={() => setActiveTab('descriptions')}
                    className={`flex-1 py-4 px-4 text-center text-sm font-medium ${
                      activeTab === 'descriptions' 
                        ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white' 
                        : 'text-gray-300 hover:bg-[#111b33] hover:text-white'
                    }`}
                  >
                    Descriptions
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
                          Property Title
                        </label>
                        <input
                          type="text"
                          id="title"
                          name="title"
                          value={project.title || ''}
                          onChange={handleTitleChange}
                          className="w-full bg-[#111b33] border border-[#1c2a47] rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="address" className="block text-sm font-medium text-white mb-1">
                          Property Address
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={project.address || ''}
                          onChange={handleAddressChange}
                          className="w-full bg-[#111b33] border border-[#1c2a47] rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
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
                        <label htmlFor="date_available" className="block text-sm font-medium text-white mb-1">
                          Date Available
                        </label>
                        <input
                          type="text"
                          id="date_available"
                          name="date_available"
                          value={projectDetails.date_available || ''}
                          onChange={handleInputChange}
                          className="w-full bg-[#111b33] border border-[#1c2a47] rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="phone_number" className="block text-sm font-medium text-white mb-1">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          id="phone_number"
                          name="phone_number"
                          value={projectDetails.phone_number || ''}
                          onChange={handleInputChange}
                          className="w-full bg-[#111b33] border border-[#1c2a47] rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email_address" className="block text-sm font-medium text-white mb-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email_address"
                          name="email_address"
                          value={projectDetails.email_address || ''}
                          onChange={handleInputChange}
                          className="w-full bg-[#111b33] border border-[#1c2a47] rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="website_name" className="block text-sm font-medium text-white mb-1">
                          Website
                        </label>
                        <input
                          type="text"
                          id="website_name"
                          name="website_name"
                          value={projectDetails.website_name || ''}
                          onChange={handleInputChange}
                          className="w-full bg-[#111b33] border border-[#1c2a47] rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="name_brokerfirm" className="block text-sm font-medium text-white mb-1">
                          Broker Firm Name
                        </label>
                        <input
                          type="text"
                          id="name_brokerfirm"
                          name="name_brokerfirm"
                          value={projectDetails.name_brokerfirm || ''}
                          onChange={handleInputChange}
                          className="w-full bg-[#111b33] border border-[#1c2a47] rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="address_brokerfirm" className="block text-sm font-medium text-white mb-1">
                          Broker Firm Address
                        </label>
                        <input
                          type="text"
                          id="address_brokerfirm"
                          name="address_brokerfirm"
                          value={projectDetails.address_brokerfirm || ''}
                          onChange={handleInputChange}
                          className="w-full bg-[#111b33] border border-[#1c2a47] rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'descriptions' && (
                    <div className="space-y-6">
                      <div>
                        <label htmlFor="shortdescription" className="block text-sm font-medium text-white mb-1">
                          Short Description
                        </label>
                        <textarea
                          id="shortdescription"
                          name="shortdescription"
                          value={projectDetails.shortdescription || ''}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full bg-[#111b33] border border-[#1c2a47] rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Brief description of the property"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="descriptionlarge" className="block text-sm font-medium text-white mb-1">
                          Layout Description
                        </label>
                        <textarea
                          id="descriptionlarge"
                          name="descriptionlarge"
                          value={projectDetails.descriptionlarge || ''}
                          onChange={handleInputChange}
                          rows={4}
                          className="w-full bg-[#111b33] border border-[#1c2a47] rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Detailed layout description of the property"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="descriptionextralarge" className="block text-sm font-medium text-white mb-1">
                          Detailed Description
                        </label>
                        <textarea
                          id="descriptionextralarge"
                          name="descriptionextralarge"
                          value={projectDetails.descriptionextralarge || ''}
                          onChange={handleInputChange}
                          rows={6}
                          className="w-full bg-[#111b33] border border-[#1c2a47] rounded-lg px-4 py-2 text-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Comprehensive property description"
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'images' && (
                    <div className="space-y-6">
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                        <p className="text-blue-400">
                          Upload and manage images for your project. These images will be used in your brochure.
                        </p>
                      </div>
                      
                      <div className="bg-[#171e2e] rounded-lg p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Property Images</h3>
                        <ImageUploader
                          images={uploadedImages}
                          onUpload={handleImagesUploaded}
                          onRemove={handleImageRemove}
                          uploading={uploading}
                          limit={10}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-between p-6 border-t border-[#1c2a47]">
                  <button
                    onClick={() => {
                      if (activeTab === 'descriptions') setActiveTab('basic-info');
                      else if (activeTab === 'images') setActiveTab('descriptions');
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
                      if (activeTab === 'basic-info') setActiveTab('descriptions');
                      else if (activeTab === 'descriptions') setActiveTab('images');
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
          )}
          
          <div className={`${project.presentation_id ? 'lg:col-span-12' : 'lg:col-span-5'} transition-all duration-300`}>
            <div className={`bg-[#111827] rounded-lg overflow-hidden border border-[#1c2a47] sticky top-8 ${project.presentation_id ? 'min-h-[800px]' : 'h-full'}`}>
              <DocumentViewer
                projectId={params.id as string}
                placeholders={placeholders}
                images={uploadedImages}
                shouldProcess={shouldProcessDocument}
                onImagesUpdate={(newImages) => setUploadedImages(newImages)}
                onPresentationGenerated={handlePresentationGenerated}
                selectedPages={projectDetails.selected_pages}
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B101B] text-gray-100">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
      </div>
      
      <DashboardHeader 
        credits={credits}
        userEmail={session?.user?.email}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      
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
