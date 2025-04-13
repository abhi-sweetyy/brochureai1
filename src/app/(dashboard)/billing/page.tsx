'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useSessionContext } from '@supabase/auth-helpers-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { formatDate } from '@/lib/utils';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

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

    // ... existing code ...
    
    try {
      // ... existing code ...
      
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