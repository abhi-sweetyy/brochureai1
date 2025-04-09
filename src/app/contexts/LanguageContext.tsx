import React, { createContext, useState, useContext, ReactNode } from "react";
import { useTranslation } from "react-i18next";

type LanguageContextType = {
  currentLanguage: string;
  changeLanguage: (langCode: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || "en");

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setCurrentLanguage(langCode);

    // Store the language preference in localStorage for persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("preferred-language", langCode);
    }

    // Optionally, you might want to adjust HTML lang attribute
    if (typeof document !== "undefined") {
      document.documentElement.lang = langCode;
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
