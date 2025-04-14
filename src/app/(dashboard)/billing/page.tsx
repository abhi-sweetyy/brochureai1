'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

// Define credit packages
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
  const { t } = useTranslation();

  const handlePurchaseCredits = async (packageId: string) => {
    if (!session?.user?.id) {
      toast.error(t("billing.mustBeLoggedIn"));
      return;
    }

    setIsProcessing(packageId);
    
    try {
      // Find the selected package
      const selectedPackage = CREDIT_PACKAGES.find(pkg => pkg.id === packageId);
      if (!selectedPackage) {
        throw new Error(t("billing.invalidPackage"));
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
      
      toast.success(t("billing.purchaseSuccess", { credits: selectedPackage.credits }));
    } catch (error) {
      console.error("Error purchasing credits:", error);
      toast.error(t("billing.purchaseFailed"));
    } finally {
      setIsProcessing(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          <div className="h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-800">{t("billing.loading")}</p>
        </div>
      </div>
    );
  }
  
  // ... existing code ...
} 