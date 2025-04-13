"use client";

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/app/contexts/LanguageContext';
import i18n from '@/app/i18n';

interface LanguageOption {
  code: string;
  name: string;
  flag: string;
}

export default function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { currentLanguage, changeLanguage } = useLanguage();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Language options with SVG flag images
  const languages: LanguageOption[] = [
    { 
      code: "en", 
      name: "EN",
      flag: "/images/flags/en.png"
    },
    { 
      code: "de", 
      name: "DE",
      flag: "/images/flags/de.png"
    },
  ];

  // Debug current language when it changes
  useEffect(() => {
    console.log('Current language in LanguageSwitcher:', currentLanguage);
    console.log('i18n language:', i18n.language);
    console.log('i18n initialized:', i18n.isInitialized);
  }, [currentLanguage]);

  // Handle language selection
  const handleLanguageSelect = (langCode: string) => {
    console.log('Language selected:', langCode);
    changeLanguage(langCode);
    console.log('After changeLanguage, i18n language:', i18n.language);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentLang = languages.find(lang => lang.code === currentLanguage) || languages[0];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-20 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-800 transition-colors"
        aria-label="Select language"
      >
        <div className="flex items-center">
          <img
            src={currentLang.flag}
            alt={`${currentLang.name} flag`}
            className="w-5 h-4 object-cover"
          />
          <span className="ml-1">{currentLanguage.toUpperCase()}</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Language Dropdown */}
      <div 
        className={`absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg overflow-hidden z-50 border border-gray-200 transition-all duration-200 origin-top-right ${
          isOpen 
            ? 'transform scale-100 opacity-100' 
            : 'transform scale-95 opacity-0 pointer-events-none'
        }`}
      >
        {languages.map((language) => (
          <button
            key={language.code}
            onClick={() => handleLanguageSelect(language.code)}
            className={`flex items-center w-full px-4 py-2.5 text-sm text-left hover:bg-gray-100 transition-colors ${
              currentLanguage === language.code ? "bg-gray-50" : ""
            }`}
          >
            <img
              src={language.flag}
              alt={`${language.name} flag`}
              className="w-5 h-4 object-cover mr-2"
            />
            <span className="text-gray-600">
              {language.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
} 