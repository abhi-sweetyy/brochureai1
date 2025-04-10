"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSessionContext } from "@supabase/auth-helpers-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { toast } from 'react-hot-toast';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ImageUploader from '@/components/ImageUploader';

interface AccountFormData {
  logo_url: string;
  broker_photo_url: string;
  phone_number: string;
  email_address: string;
  website_name: string;
  broker_name: string;
  company_name: string;
  address: string;
  fax_number: string;
}

interface FormErrors {
  logo_url: boolean;
  broker_photo_url: boolean;
  phone_number: boolean;
  email_address: boolean;
  website_name: boolean;
}

export default function AccountPage() {
  const router = useRouter();
  const { session, isLoading } = useSessionContext();
  const supabase = createClientComponentClient();
  const [credits, setCredits] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [formData, setFormData] = useState<AccountFormData>({
    logo_url: '',
    broker_photo_url: '',
    phone_number: '',
    email_address: '',
    website_name: '',
    broker_name: '',
    company_name: '',
    address: '',
    fax_number: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    logo_url: false,
    broker_photo_url: false,
    phone_number: false,
    email_address: false,
    website_name: false
  });

  // Protect the account page route
  useEffect(() => {
    if (!session && !isLoading) {
      router.replace('/sign-in');
    }
  }, [session, isLoading, router]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (session?.user?.id) {
        console.log("Fetching profile for user:", session.user.id);
        const { data, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', session.user.id)
          .single();
        
        console.log("Profile data:", data);
        console.log("Profile error:", error);
        
        if (data && data.is_onboarded) {
          setIsExistingUser(true);
          setFormData({
            logo_url: data.logo_url || '',
            broker_photo_url: data.broker_photo_url || '',
            phone_number: data.phone_number || '',
            email_address: data.email_address || '',
            website_name: data.website_name || '',
            broker_name: data.broker_name || '',
            company_name: data.company_name || '',
            address: data.address || '',
            fax_number: data.fax_number || ''
          });
        } else if (session?.user?.email) {
          // Pre-fill email for new users
          setFormData(prev => ({
            ...prev,
            email_address: session.user.email || ''
          }));
        }
      }
    };

    fetchUserProfile();
  }, [session, supabase]);

  // Handle image upload functions
  const handleLogoUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setFormData(prev => ({ ...prev, logo_url: urls[0] }));
      setFormErrors(prev => ({ ...prev, logo_url: false }));
    }
  };

  const handleBrokerPhotoUpload = (urls: string[]) => {
    if (urls.length > 0) {
      setFormData(prev => ({ ...prev, broker_photo_url: urls[0] }));
      setFormErrors(prev => ({ ...prev, broker_photo_url: false }));
    }
  };

  // Custom upload function for account page that uses the userinfo bucket
  const uploadAccountImage = async (file: File): Promise<string> => {
    try {
      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 15);
      const fileName = `${timestamp}_${randomString}.${fileExt}`;
      const filePath = `${session?.user?.id}/${fileName}`;
      
      // Upload to the userinfo bucket
      const { error: uploadError } = await supabase.storage
        .from('userinfo')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }
      
      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('userinfo')
        .getPublicUrl(filePath);
      
      return urlData.publicUrl;
    } catch (error) {
      console.error('Error in uploadAccountImage:', error);
      throw error;
    }
  };

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prev => ({ ...prev, [name]: false }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const errors = {
      logo_url: !formData.logo_url,
      broker_photo_url: !formData.broker_photo_url,
      phone_number: !formData.phone_number,
      email_address: !formData.email_address || !/^\S+@\S+\.\S+$/.test(formData.email_address),
      website_name: !formData.website_name
    };
    
    setFormErrors(errors);
    
    // Check if any errors exist
    if (Object.values(errors).some(error => error)) {
      toast.error("Please fill in all required fields correctly");
      return;
    }
    
    // Format website URL if needed (add https:// if not present)
    let websiteUrl = formData.website_name;
    if (websiteUrl && !websiteUrl.match(/^https?:\/\//)) {
      websiteUrl = 'https://' + websiteUrl;
    }
    
    // Show loading state
    setIsSubmitting(true);
    toast.loading("Saving your information...", { id: "account-update" });
    
    try {
      // Save the profile data with all fields
      const { error } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: session?.user?.id,
          logo_url: formData.logo_url,
          broker_photo_url: formData.broker_photo_url,
          phone_number: formData.phone_number,
          email_address: formData.email_address,
          website_name: websiteUrl,
          broker_name: formData.broker_name,
          company_name: formData.company_name,
          address: formData.address,
          fax_number: formData.fax_number,
          is_onboarded: true
        });
      
      if (error) {
        toast.error("Failed to save your information", { id: "account-update" });
        console.error("Profile update error:", error);
        return;
      }
      
      toast.success(isExistingUser 
        ? "Profile updated successfully" 
        : "Profile completed successfully! Redirecting to dashboard...", 
        { id: "account-update" }
      );
      
      // If this is a new user completing onboarding, redirect to dashboard
      if (!isExistingUser) {
        // Short delay to show the success message before redirecting
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An unexpected error occurred", { id: "account-update" });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    console.log("Account page mounted");
    console.log("Session:", session);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-800">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
      </div>
      
      {isExistingUser && (
        <DashboardHeader 
          isMenuOpen={false} 
          setIsMenuOpen={() => {}} 
          userEmail={session?.user?.email} 
        />
      )}
      
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {isExistingUser ? "Account Settings" : "Complete Your Profile"}
            </h1>
            <p className="text-gray-600 mt-1">
              {isExistingUser 
                ? "Manage your profile information" 
                : "Before you can create brochures, we need some basic information about you"}
            </p>
          </div>
          
          {isExistingUser && (
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
          )}
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl shadow-md p-8 mb-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Section Header */}
            <div className="border-b border-gray-200 pb-5">
              <h2 className="text-2xl font-semibold text-gray-900">Broker Profile Information</h2>
              <p className="mt-1 text-sm text-gray-500">This information will be used in your real estate brochures and templates.</p>
            </div>
            
            {/* Upload Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Logo Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Company Logo <span className="text-red-500">*</span>
                </label>
                <div className={`border-2 ${formErrors.logo_url ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'} rounded-lg p-4`}>
                  {formData.logo_url ? (
                    <div className="flex flex-col items-center">
                      <img src={formData.logo_url} alt="Logo" className="h-24 w-auto object-contain mb-4" />
                      <button 
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, logo_url: '' }))}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <ImageUploader
                      existingImages={[]}
                      onImagesUploaded={(urls) => {
                        if (urls.length > 0) {
                          setFormData(prev => ({ ...prev, logo_url: urls[0] }));
                          setFormErrors(prev => ({ ...prev, logo_url: false }));
                        }
                      }}
                      limit={1}
                    />
                  )}
                  {formErrors.logo_url && (
                    <p className="mt-2 text-sm text-red-600">Business logo is required</p>
                  )}
                </div>
              </div>
              
              {/* Broker Photo Upload */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Broker Photo <span className="text-red-500">*</span>
                </label>
                <div className={`border-2 ${formErrors.broker_photo_url ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'} rounded-lg p-4`}>
                  {formData.broker_photo_url ? (
                    <div className="flex flex-col items-center">
                      <img src={formData.broker_photo_url} alt="Broker" className="h-32 w-auto object-cover object-center mb-4 rounded-lg" />
                      <button 
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, broker_photo_url: '' }))}
                        className="text-sm text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <ImageUploader
                      existingImages={[]}
                      onImagesUploaded={(urls) => {
                        if (urls.length > 0) {
                          setFormData(prev => ({ ...prev, broker_photo_url: urls[0] }));
                          setFormErrors(prev => ({ ...prev, broker_photo_url: false }));
                        }
                      }}
                      limit={1}
                    />
                  )}
                  {formErrors.broker_photo_url && (
                    <p className="mt-2 text-sm text-red-600">Broker photo is required</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Contact Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Broker Name */}
                <div>
                  <label htmlFor="broker_name" className="block text-sm font-medium text-gray-700">
                    Broker Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="broker_name"
                    name="broker_name"
                    value={formData.broker_name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="John Smith"
                    required
                  />
                </div>
                
                {/* Company Name */}
                <div>
                  <label htmlFor="company_name" className="block text-sm font-medium text-gray-700">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="company_name"
                    name="company_name"
                    value={formData.company_name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Real Estate Company LLC"
                    required
                  />
                </div>
                
                {/* Email Address */}
                <div>
                  <label htmlFor="email_address" className="block text-sm font-medium text-gray-700">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email_address"
                    name="email_address"
                    value={formData.email_address}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formErrors.email_address ? 'border-red-300' : ''}`}
                    placeholder="john@realestate.com"
                    required
                  />
                  {formErrors.email_address && (
                    <p className="mt-1 text-sm text-red-600">Valid email address is required</p>
                  )}
                </div>
                
                {/* Phone Number */}
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formErrors.phone_number ? 'border-red-300' : ''}`}
                    placeholder="+1 (123) 456-7890"
                    required
                  />
                  {formErrors.phone_number && (
                    <p className="mt-1 text-sm text-red-600">Phone number is required</p>
                  )}
                </div>
                
                {/* Fax Number (Optional) */}
                <div>
                  <label htmlFor="fax_number" className="block text-sm font-medium text-gray-700">
                    Fax Number <span className="text-xs text-gray-500 font-normal">(optional)</span>
                  </label>
                  <input
                    type="text"
                    id="fax_number"
                    name="fax_number"
                    value={formData.fax_number}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="+1 (123) 456-7891"
                  />
                </div>
                
                {/* Website */}
                <div>
                  <label htmlFor="website_name" className="block text-sm font-medium text-gray-700">
                    Website <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="website_name"
                    name="website_name"
                    value={formData.website_name}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${formErrors.website_name ? 'border-red-300' : ''}`}
                    placeholder="www.yourcompany.com"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Enter your website address (https:// will be added automatically if needed)</p>
                  {formErrors.website_name && (
                    <p className="mt-1 text-sm text-red-600">Website is required</p>
                  )}
                </div>
              </div>
              
              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="123 Main Street, Apt 4B, New York, NY 10001"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">Enter complete address: street name, house number, ZIP code, and city</p>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="pt-5">
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Save Profile Information
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 