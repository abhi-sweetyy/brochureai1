'use client';

import { useState } from 'react';
import { formatDate } from '@/lib/utils';

interface SubscriptionActionsProps {
  isSubscribed: boolean;
  currentPeriodEnd: number | null;
}

export default function SubscriptionActions({ isSubscribed, currentPeriodEnd }: SubscriptionActionsProps) {
  const [isLoading, setIsLoading] = useState(false);

  const createCheckoutSession = async () => {
    setIsLoading(true);
    
    // Here you would implement your checkout logic
    // For example, redirecting to a Stripe checkout page
    
    // Simulate API call for demo purposes
    setTimeout(() => {
      alert('This would redirect to a payment page in a real application.');
      setIsLoading(false);
    }, 1000);
  };

  const createPortalSession = async () => {
    setIsLoading(true);
    
    // Here you would implement your customer portal logic
    // For example, redirecting to a Stripe customer portal
    
    // Simulate API call for demo purposes
    setTimeout(() => {
      alert('This would redirect to a customer portal in a real application.');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div>
      {isSubscribed ? (
        <>
          <div className="mb-4 text-sm text-gray-600">
            Your subscription renews on {currentPeriodEnd && formatDate(new Date(currentPeriodEnd * 1000))}.
          </div>
          <button
            onClick={createPortalSession}
            disabled={isLoading}
            className="w-full py-2 px-4 border border-gray-300 text-sm font-medium rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {isLoading ? 'Loading...' : 'Manage Subscription'}
          </button>
        </>
      ) : (
        <button
          onClick={createCheckoutSession}
          disabled={isLoading}
          className="w-full py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Subscribe to Pro'
          )}
        </button>
      )}
    </div>
  );
} 