"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface DashboardHeaderProps {
  userEmail?: string;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  credits?: number | null;
}

const DashboardHeader = ({ userEmail, isMenuOpen, setIsMenuOpen, credits }: DashboardHeaderProps) => {
  const router = useRouter();

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 shadow-sm fixed top-0 left-0 right-0 z-40 h-16">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 mr-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? (
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          <Link href="/" className="flex items-center">
            <img
              src="/favicon.png"
              alt="ExposeFlow Logo"
              className="h-8 w-auto mr-2"
            />
            <span className="text-[#5169FE] font-bold text-xl">
              ExposeFlow
            </span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* User email display */}
          <div className="hidden sm:flex items-center text-gray-600">
            <span className="text-sm font-medium">
              {userEmail || "Account"}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
