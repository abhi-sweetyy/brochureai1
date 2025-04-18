"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export interface DashboardHeaderProps {
  userEmail?: string;
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  credits?: number | null;
}

const DashboardHeader = ({ userEmail, isMenuOpen, setIsMenuOpen, credits }: DashboardHeaderProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4 shadow-sm fixed top-0 left-0 right-0 z-40 h-16">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 mr-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close sidebar" : "Open sidebar"}
          >
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
          {/* Language Switcher */}
          <LanguageSwitcher />
          
          {/* Credits display in header */}
          <div className="hidden sm:flex items-center px-3 py-1.5 bg-gray-50 rounded-lg border border-gray-200">
            <svg className="w-4 h-4 mr-1.5 text-blue-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium text-gray-900 text-sm whitespace-nowrap">{credits ?? 0} {t('dashboard.credits')}</span>
          </div>

          {/* User info dropdown */}
          <div className="relative flex items-center">
            <div className="flex items-center px-3 py-1.5 rounded-lg text-sm text-gray-700 hover:bg-gray-50">
              <span className="max-w-[120px] truncate hidden sm:block">{userEmail}</span>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium ml-2">
                {userEmail ? userEmail[0].toUpperCase() : "U"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
