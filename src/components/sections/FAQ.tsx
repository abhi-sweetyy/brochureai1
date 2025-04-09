"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function FAQ() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const { t } = useTranslation();

  // FAQ data
  const faqs = [
    {
      question: t(
        "faq.items.pricing.question",
        "How much does ExposeFlow cost?",
      ),
      answer: t(
        "faq.items.pricing.answer",
        "ExposeFlow offers flexible pricing plans starting at $XX/month for our Basic plan, which includes up to 10 brochures per month. Our Professional plan at $XX/month offers unlimited brochures and premium templates. Enterprise pricing is available for teams and agencies.",
      ),
    },
    {
      question: t(
        "faq.items.experience.question",
        "Do I need design experience to use ExposeFlow?",
      ),
      answer: t(
        "faq.items.experience.answer",
        "Not at all! ExposeFlow is specifically designed for real estate professionals with no design experience. Our templates and AI-powered tools handle all the design work for you, so you can create professional-looking brochures in minutes.",
      ),
    },
    {
      question: t(
        "faq.items.customize.question",
        "Can I customize the generated content?",
      ),
      answer: t(
        "faq.items.customize.answer",
        "Yes, absolutely! While our AI generates high-quality content automatically, you can edit any text, change images, adjust layouts, and customize colors to match your brand. You have complete control over the final output.",
      ),
    },
    {
      question: t(
        "faq.items.formats.question",
        "What formats can I download my brochures in?",
      ),
      answer: t(
        "faq.items.formats.answer",
        "You can download your brochures as high-resolution PDFs ready for printing, web-optimized PDFs for digital sharing, or as image files (JPEG/PNG) for use in social media and other online platforms.",
      ),
    },
    {
      question: t(
        "faq.items.limits.question",
        "How many properties can I create brochures for?",
      ),
      answer: t(
        "faq.items.limits.answer",
        "The number of brochures you can create depends on your subscription plan. Our Basic plan allows up to 10 brochures per month, while our Professional and Enterprise plans offer unlimited brochure creation.",
      ),
    },
    {
      question: t(
        "faq.items.branding.question",
        "Can I add my brokerage's branding to the brochures?",
      ),
      answer: t(
        "faq.items.branding.answer",
        "Yes! ExposeFlow allows you to add your logo, custom colors, contact information, and other branding elements to ensure all your marketing materials are consistent with your brand identity.",
      ),
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <section id="faq" className="my-20 px-4 bg-white">
      <h2 className="text-4xl font-bold text-center mb-12 text-[#171717]">
        {t("faq.title")}
      </h2>
      <div className="max-w-4xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            style={{
              backgroundColor: openFaqIndex === index ? "#EAEDFF" : "#F8F8FC",
            }}
            className="rounded-lg overflow-hidden transition-all duration-200 group"
          >
            <div
              onClick={() => toggleFAQ(index)}
              className="p-6 cursor-pointer flex justify-between items-center"
            >
              <h3
                className={`text-lg transition-colors ${
                  openFaqIndex === index
                    ? "text-[#171717]"
                    : "text-[#171717] group-hover:text-[#5169FE]"
                }`}
              >
                {faq.question}
              </h3>
              <button
                className={`text-2xl transition-colors ${
                  openFaqIndex === index
                    ? "text-[#171717]"
                    : "text-[#171717] group-hover:text-[#5169FE]"
                }`}
              >
                {openFaqIndex === index ? "×" : "+"}
              </button>
            </div>
            {openFaqIndex === index && (
              <div className="px-6 pb-6 text-gray-600">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
