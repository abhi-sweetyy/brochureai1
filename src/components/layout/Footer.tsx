"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function Footer() {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Function to scroll to sections
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle newsletter subscription
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // This would normally connect to a backend service
    console.log(`Subscribed with email: ${email}`);
    setSubscribed(true);
    setEmail("");
    
    // Reset subscription confirmation after 5 seconds
    setTimeout(() => {
      setSubscribed(false);
    }, 5000);
  };

  return (
    <footer className="w-full bg-gradient-to-b from-white to-blue-50/50 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Newsletter Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-white rounded-xl p-6 sm:p-8 shadow-sm border border-gray-100">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 text-center">
              {subscribed 
                ? t("footer.thankYou", "Thank you for subscribing!") 
                : t("footer.stayUpdated", "Stay Updated with ExposeFlow")}
            </h3>
            
            {!subscribed ? (
              <>
                <p className="text-gray-600 mb-6 text-center">
                  {t("footer.newsletterDesc", "Get the latest news, updates and tips for creating amazing real estate brochures.")}
                </p>
                
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("footer.emailPlaceholder", "Your email address")}
                    required
                    className="flex-grow py-3 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  />
                  <button
                    type="submit"
                    className="py-3 px-6 bg-[#5169FE] hover:bg-[#4058e0] text-white rounded-lg transition-all duration-200 font-medium text-sm md:text-base hover:shadow-md flex-shrink-0"
                  >
                    {t("footer.subscribe", "Subscribe")}
                  </button>
                </form>
              </>
            ) : (
              <p className="text-green-600 text-center py-3">
                {t("footer.subscriptionSuccess", "You've been successfully added to our newsletter list!")}
              </p>
            )}
          </div>
        </div>
      
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="md:col-span-1">
            <div className="flex items-center mb-4">
              <img
                src="/favicon.png"
                alt="ExposeFlow Logo"
                className="h-8 w-auto mr-2"
              />
              <span className="text-[#5169FE] font-bold text-xl">ExposeFlow</span>
            </div>
            <p className="text-gray-600 mb-6 text-sm">
              {t("footer.companyDesc", "Professional real estate brochure creator powered by AI technology.")}
            </p>
            <h3 className="text-gray-800 font-semibold mb-3">
              {t("footer.customerSupport")}
            </h3>
            <div>
              <a
                href="mailto:support@exposeflow.com"
                className="block hover:text-[#5169FE] mb-1 text-gray-600 transition-colors text-sm"
              >
                support@exposeflow.com
              </a>
              <p className="text-gray-500 text-sm">{t("footer.supportHours")}</p>
            </div>
          </div>

          {/* Navigation Links - Middle Column */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4">{t("footer.navigation")}</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("features")}
                  className="text-gray-600 hover:text-[#5169FE] transition-colors text-sm"
                >
                  {t("footer.features")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("demo")}
                  className="text-gray-600 hover:text-[#5169FE] transition-colors text-sm"
                >
                  {t("footer.demos")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("benefits")}
                  className="text-gray-600 hover:text-[#5169FE] transition-colors text-sm"
                >
                  {t("footer.benefits")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("faq")}
                  className="text-gray-600 hover:text-[#5169FE] transition-colors text-sm"
                >
                  {t("footer.faq")}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4">{t("footer.legal")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 hover:text-[#5169FE] transition-colors text-sm"
                >
                  {t("footer.terms")}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 hover:text-[#5169FE] transition-colors text-sm"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/imprint"
                  className="text-gray-600 hover:text-[#5169FE] transition-colors text-sm"
                >
                  {t("footer.imprint")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Started Links */}
          <div className="md:col-span-1">
            <h3 className="font-semibold text-gray-800 mb-4">{t("footer.getStarted")}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-[#5169FE] transition-colors text-sm"
                >
                  {t("footer.login")}
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-600 hover:text-[#5169FE] transition-colors text-sm"
                >
                  {t("footer.pricing")}
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard"
                  className="text-gray-600 hover:text-[#5169FE] transition-colors text-sm"
                >
                  {t("footer.register")}
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-[#5169FE] transition-colors text-sm"
                >
                  {t("footer.contact")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section with copyright and social media */}
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 mb-4 sm:mb-0">
            {t("footer.copyright", "© {{year}} ExposeFlow", {
              year: currentYear,
            })}
          </p>
          <div className="flex justify-end items-center space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#5169FE] transition-colors"
              aria-label="Facebook"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
              </svg>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#5169FE] transition-colors"
              aria-label="Twitter"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[#5169FE] transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
} 