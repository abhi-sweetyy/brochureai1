'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';
import { toast } from 'react-hot-toast';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Credit package options with competitive pricing
const CREDIT_PACKAGES = [
  { id: 'basic', name: 'Basic', credits: 10, price: 9.99, popular: false },
  { id: 'standard', name: 'Standard', credits: 25, price: 19.99, popular: true, bestValue: false },
  { id: 'pro', name: 'Pro', credits: 50, price: 29.99, popular: false, bestValue: true },
  { id: 'enterprise', name: 'Enterprise', credits: 100, price: 49.99, popular: false }
];

export default function BillingPage() {
  const { session, isLoading } = useSessionContext();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  // Fetch user credits
  useEffect(() => {
    if (!session && !isLoading) {
      router.replace('/sign-in');
      return;
    }

    async function fetchUserData() {
      if (!session?.user) return;

      try {
        // Always use profiles table for credits
        const { data, error } = await supabase
          .from('profiles')
          .select('credits')
          .eq('id', session.user.id)
          .single();
        
        if (error) {
          // If profile doesn't exist yet, create it with 0 credits
          if (error.code === 'PGRST116') {
            await supabase
              .from('profiles')
              .insert({ id: session.user.id, credits: 0 });
            
            setUserCredits(0);
          } else {
            console.error("Error fetching user credits:", error);
            setUserCredits(0);
          }
        } else {
          setUserCredits(data?.credits || 0);
        }
      } catch (error) {
        console.error("Error fetching user credits:", error);
        setUserCredits(0);
      }
    }

    fetchUserData();
  }, [session, isLoading, router, supabase]);

  const handlePurchaseCredits = async (packageId: string) => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to purchase credits");
      return;
    }

    setIsProcessing(packageId);
    
    try {
      // Find the selected package
      const selectedPackage = CREDIT_PACKAGES.find(pkg => pkg.id === packageId);
      if (!selectedPackage) {
        throw new Error("Invalid package selected");
      }
      
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if profile exists first
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', session.user.id)
        .single();
      
      // Calculate new credit amount
      const currentCredits = existingProfile?.credits || 0;
      const newCreditAmount = currentCredits + selectedPackage.credits;
      
      // Insert or update user credits in the profiles table
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: session.user.id,
          credits: newCreditAmount
        });
      
      if (error) {
        console.error("Database update error:", error);
        throw error;
      }
      
      // Update local state
      setUserCredits(newCreditAmount);
      
      toast.success(`Successfully purchased ${selectedPackage.credits} credits!`);
    } catch (error) {
      console.error("Error purchasing credits:", error);
      toast.error("Failed to process your purchase. Please try again.");
    } finally {
      setIsProcessing(null);
    }
  };

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

  if (!session) return null;

  return (
    <div className="min-h-screen">
      {/* Background elements matching dashboard */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Billing & Credits</h1>
          <p className="text-gray-600 mt-2">Purchase credits to create brochures and use premium features</p>
        </div>

        {/* Credit Balance Card */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-xl p-6 mb-8 text-white">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <p className="text-blue-100 text-sm mb-1">Current Balance</p>
              <h2 className="text-4xl font-bold">{userCredits !== null ? userCredits : '...'} Credits</h2>
              <p className="mt-2 text-blue-100">Each brochure costs 1 credit to generate</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button 
                onClick={() => document.getElementById('credit-packages')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-2.5 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                Buy More Credits
              </button>
            </div>
          </div>
        </div>

        {/* Credit Packages */}
        <div id="credit-packages" className="bg-white border border-gray-200 rounded-xl shadow-md p-8 mb-12">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Credit Packages</h2>
            <p className="text-gray-600">Choose a package that suits your needs</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CREDIT_PACKAGES.map((pkg) => (
              <div 
                key={pkg.id}
                className={`relative p-6 rounded-xl border ${
                  pkg.popular ? 'border-blue-300 ring-2 ring-blue-500 ring-opacity-50' : 
                  pkg.bestValue ? 'border-green-300' : 'border-gray-200'
                } bg-white hover:shadow-md transition-shadow`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 right-4 px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
                    Most Popular
                  </div>
                )}
                {pkg.bestValue && (
                  <div className="absolute -top-3 right-4 px-3 py-1 bg-green-600 text-white text-xs rounded-full">
                    Best Value
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{pkg.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">${pkg.price.toFixed(2)}</span>
                </div>
                <div className="mb-6 pb-6 border-b border-gray-200">
                  <p className="text-sm text-gray-600 mb-2">What's included:</p>
                  <div className="flex items-center text-gray-700 mb-2">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-medium">{pkg.credits} Credits</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Just ${(pkg.price / pkg.credits).toFixed(2)} per credit</span>
                  </div>
                </div>
                <button
                  onClick={() => handlePurchaseCredits(pkg.id)}
                  disabled={isProcessing === pkg.id}
                  className={`w-full py-2.5 px-4 border rounded-lg text-sm font-medium transition-colors ${
                    pkg.popular || pkg.bestValue 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 border-transparent' 
                      : 'bg-white text-gray-900 hover:bg-gray-50 border-gray-300'
                  }`}
                >
                  {isProcessing === pkg.id ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Purchase Now'
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Usage Information */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 mb-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How Credits Work</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Purchase Credits</h3>
                <p className="mt-1 text-gray-600">Buy credit packages that best suit your needs.</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Create Brochures</h3>
                <p className="mt-1 text-gray-600">Use 1 credit for each brochure you generate.</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">No Expiration</h3>
                <p className="mt-1 text-gray-600">Your credits never expire and can be used anytime.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 