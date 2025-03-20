'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export interface DashboardHeaderProps {
  credits?: number | null;
  userEmail?: string;
}

const DashboardHeader = ({ credits, userEmail }: DashboardHeaderProps) => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <header className="bg-[#0c1324] border-b border-[#1c2a47] py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <div className="mr-2 h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-white font-bold text-xl">Brochure<span className="text-blue-500">AI</span></span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-6">
            {credits !== undefined && (
              <div className="hidden md:flex items-center px-4 py-1.5 bg-[#111b33] border border-[#1c2a47] rounded-lg">
                <span className="text-gray-400 text-sm mr-2">Credits:</span>
                <span className="text-white font-medium">{credits}</span>
              </div>
            )}
            
            <div className="relative group">
              <button className="flex items-center space-x-2 text-gray-300 hover:text-white focus:outline-none">
                <span className="hidden md:inline-block">{userEmail || 'Account'}</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 bg-[#111b33] border border-[#1c2a47] rounded-lg shadow-xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#192338] hover:text-white">
                  Dashboard
                </Link>
                <Link href="/dashboard/billing" className="block px-4 py-2 text-sm text-gray-300 hover:bg-[#192338] hover:text-white">
                  Billing
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-[#192338] hover:text-white"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;