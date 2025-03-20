import { useState } from 'react';

export default function FAQ() {
  const faqs = [
    {
      question: "How does the AI content generation work?",
      answer: "Our AI analyzes real estate property details you provide and generates professional, engaging content that highlights the property's key features and selling points. It follows best practices in real estate marketing to create compelling descriptions, summaries, and feature lists."
    },
    {
      question: "Can I customize the templates?",
      answer: "Yes, all templates are fully customizable. You can change colors, fonts, layout, and content to match your brand and specific property needs. Professional and Agency plans offer even more customization options."
    },
    {
      question: "How many team members can I add?",
      answer: "The Professional plan allows up to 3 team members, while the Agency plan supports up to 10 team members. If you need more seats, contact our sales team for a custom enterprise solution."
    },
    {
      question: "Do you offer white labeling?",
      answer: "Yes, white labeling is available on the Agency plan. This allows you to remove our branding and add your own logo and brand elements to all generated documents and the dashboard interface."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. If you cancel, you'll continue to have access until the end of your billing period. We don't offer refunds for partial months or years."
    },
    {
      question: "What formats can I export my documents in?",
      answer: "Depending on your plan, you can export documents as PDF, DOCX, JPG, or PNG files. The Professional and Agency plans support all formats, while the Starter plan supports PDF exports only."
    }
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 md:py-24 px-4 relative z-20">
      {/* Remove background-related divs */}
      
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-300">
            Get answers to common questions about BrochureAI.
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className={`bg-[#0c1324] border ${openIndex === index ? 'border-blue-500/50' : 'border-[#1c2a47]'} rounded-xl overflow-visible relative z-30`}
            >
              <button
                className="flex justify-between items-center w-full p-6 text-left"
                onClick={() => toggleFaq(index)}
              >
                <h3 className="text-lg font-medium text-white">{faq.question}</h3>
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 text-gray-400 transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`} 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Simple, non-animated answer container */}
              {openIndex === index && (
                <div className="px-6 pb-6 text-gray-300">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-300 mb-4">Still have questions?</p>
          <button 
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg transition-colors shadow-lg"
          >
            Contact Support
          </button>
        </div>
      </div>
    </section>
  );
} 