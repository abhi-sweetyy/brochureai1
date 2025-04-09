"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  // Function to scroll to sections
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer className="w-full bg-[#F8F8FC] py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Column - Company Info */}
          <div>
            <div className="text-2xl font-bold text-[#5169FE] mb-3">
              ExposeFlow
            </div>
            <h3 className="text-[#5169FE] text-xl font-bold mb-6">
              {t("footer.customerSupport")}
            </h3>
            <div>
              <a
                href="mailto:support@exposeflow.com"
                className="block hover:text-[#5169FE] mb-1 text-[#171717]"
              >
                support@exposeflow.com
              </a>
              <p className="text-[#171717]">{t("footer.supportHours")}</p>
            </div>
          </div>

          {/* Middle Column - Legal */}
          <div className="md:flex md:justify-center">
            <div className="mt-[52px]">
              {/* This matches the height of the title + spacing */}
              <Link
                href="/legal/impressum"
                className="block hover:text-[#5169FE] text-[#171717]"
              >
                Impressum
              </Link>
              <Link
                href="/legal/terms"
                className="block hover:text-[#5169FE] text-[#171717] mt-3"
              >
                Terms
              </Link>
              <Link
                href="/legal/privacy"
                className="block hover:text-[#5169FE] text-[#171717] mt-3"
              >
                Privacy
              </Link>
            </div>
          </div>

          {/* Right Column - Help */}
          <div className="md:flex md:justify-end">
            <div className="mt-[52px]">
              {/* This matches the height of the title + spacing */}
              <button
                onClick={() => scrollToSection("faq")}
                className="block hover:text-[#5169FE] text-left text-[#171717]"
              >
                FAQ
              </button>
              <Link
                href="/help"
                className="block hover:text-[#5169FE] text-[#171717] mt-3"
              >
                {t("footer.helpCenter")}
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-gray-300 mt-8 mb-6"></div>

        {/* Copyright and Social Media */}
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-[#171717] mb-4 sm:mb-0">
            {t("footer.copyright", "© {{year}} ExposeFlow", {
              year: currentYear,
            })}
          </p>
          <div className="flex justify-end items-center space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/facebook-icon.png"
                alt="Facebook"
                className="h-6 w-6"
              />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/youtube-icon.png" alt="YouTube" className="h-6 w-8" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="/linkedin-icon.png"
                alt="LinkedIn"
                className="h-6 w-6"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
