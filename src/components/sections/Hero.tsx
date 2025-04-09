"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

export default function Hero() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);

  // Function to scroll to sections
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Add animation on load
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="bg-white w-full pt-20 md:pt-24 pb-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 sm:px-6 md:px-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 md:gap-8">
          {/* Left column - Text Content */}
          <div className={`w-full md:w-1/2 md:pr-6 transition-all duration-700 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Real Estate Brochures<br />
              <span className="text-[#5169FE]">simplified</span>
            </h1>
            
            <p className="mt-4 text-gray-700 text-base sm:text-lg">
              With ExposeFlow, create stunning real estate marketing<br className="hidden sm:block" />
              materials in minutes without design experience
            </p>
            
            <ul className="mt-6 space-y-3">
              <li className="flex items-start gap-2.5">
                <div className="flex-shrink-0 text-[#5169FE] mt-1">✓</div>
                <span className="text-gray-700">Generate professional property descriptions with AI</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="flex-shrink-0 text-[#5169FE] mt-1">✓</div>
                <span className="text-gray-700">Create beautiful layouts without graphic design skills</span>
              </li>
              <li className="flex items-start gap-2.5">
                <div className="flex-shrink-0 text-[#5169FE] mt-1">✓</div>
                <span className="text-gray-700">Stand out from competitors with premium marketing materials</span>
              </li>
            </ul>
            
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <button className="px-5 py-2.5 bg-[#5169FE] text-white rounded-lg font-medium hover:bg-[#4058e0] transition-colors">
                  Start creating
                </button>
              </Link>
              <button
                onClick={() => scrollToSection("demo")}
                className="px-5 py-2.5 bg-white text-[#5169FE] border border-[#5169FE] rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                See Examples
              </button>
            </div>
          </div>
          
          {/* Right column - Image */}
          <div className={`w-full md:w-1/2 mt-10 md:mt-0 transition-all duration-1000 delay-200 transform ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-12 opacity-0'}`}>
            <div className="relative mx-auto max-w-lg">
              {/* Main browser mockup */}
              <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                {/* Browser chrome */}
                <div className="h-6 bg-gray-100 flex items-center px-2 rounded-t-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                
                {/* Brochure content */}
                <div className="relative">
                  <img
                    src="/brochure-preview.png"
                    alt="Real Estate Brochure Preview"
                    className="w-full h-auto object-contain block"
                  />
                </div>
              </div>
              
              {/* Edit cursor decoration */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="h-14 w-14 bg-white rounded-full shadow-xl flex items-center justify-center">
                  <svg className="h-7 w-7 text-[#5169FE]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
                  </svg>
                </div>
              </div>
              
              {/* Mouse cursor position */}
              <div className="absolute bottom-16 right-10 animate-pulse">
                <svg className="h-6 w-6 text-black" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.1 0.9L8.6 6.4C9 6.8 9 7.5 8.6 7.9C8.2 8.3 7.5 8.3 7.1 7.9L5 5.8L5 15C5 15.6 4.6 16 4 16C3.4 16 3 15.6 3 15L3 5.8L0.9 7.9C0.5 8.3 -0.2 8.3 -0.6 7.9C-1 7.5 -1 6.8 -0.6 6.4L4.9 0.9C5.3 0.5 6 0.5 6.4 0.9L3.1 0.9Z" transform="translate(8 4)" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
