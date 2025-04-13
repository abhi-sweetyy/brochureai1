"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t } = useTranslation();

  // Function to scroll to sections
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMobileMenuOpen(false);
  };

  // Handle scroll events to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    { label: t("features"), id: "features" },
    { label: t("demo"), id: "demo" },
    { label: t("benefits"), id: "benefits" },
    { label: t("faq"), id: "faq" },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white shadow-md py-2' 
          : 'bg-white/90 backdrop-blur-sm py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-8">
        <div className="flex items-center gap-8">
          {/* Logo and Brand */}
          <div
            className="flex items-center cursor-pointer transition-transform hover:scale-105 duration-200"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img
              src="/favicon.png"
              alt="ExposeFlow Logo"
              className="h-8 w-auto mr-2"
            />
            <span className="text-[#5169FE] font-bold text-xl">ExposeFlow</span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-[#171717] hover:text-[#5169FE] font-medium text-sm transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#5169FE] transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {/* Language Switcher Component */}
          <LanguageSwitcher />

          {/* Login button */}
          <Link href="/dashboard" className="hidden sm:block">
            <button className="bg-white hover:bg-gray-100 text-[#5169FE] px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm border border-[#5169FE] hover:shadow-sm">
              {t("login")}
            </button>
          </Link>

          {/* Signup button */}
          <Link href="/dashboard">
            <button className="bg-[#5169FE] hover:bg-[#4058e0] text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium text-sm whitespace-nowrap border border-[#5169FE] hover:shadow-md">
              {t("getStarted")}
            </button>
          </Link>

          {/* Mobile Menu Button with improved animation */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-[#171717] rounded-md hover:bg-gray-100 transition-colors"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          >
            <div className="w-6 h-5 relative">
              <span 
                className={`absolute h-0.5 w-6 bg-gray-800 transform transition-all duration-300 ${
                  isMobileMenuOpen ? 'rotate-45 top-2.5' : 'top-0'
                }`}
              ></span>
              <span 
                className={`absolute h-0.5 bg-gray-800 transform transition-all duration-300 ${
                  isMobileMenuOpen ? 'opacity-0 w-0' : 'opacity-100 w-6 top-2'
                }`}
              ></span>
              <span 
                className={`absolute h-0.5 w-6 bg-gray-800 transform transition-all duration-300 ${
                  isMobileMenuOpen ? '-rotate-45 top-2.5' : 'top-4'
                }`}
              ></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu with animation */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-80' : 'max-h-0'
        }`}
      >
        <div className="bg-white px-4 pb-4 pt-2 shadow-inner">
          <div className="flex flex-col space-y-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-left py-2.5 text-[#171717] hover:text-[#5169FE] font-medium transition-colors rounded-lg hover:bg-gray-50 px-3"
              >
                {item.label}
              </button>
            ))}

            {/* Mobile-only login link */}
            <Link href="/dashboard">
              <button className="text-left py-2.5 px-3 text-[#5169FE] font-medium rounded-lg hover:bg-gray-50 transition-colors sm:hidden w-full">
                {t("login")}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
