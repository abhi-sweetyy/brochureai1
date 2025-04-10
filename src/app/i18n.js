import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

const i18n = createInstance();

i18n.use(initReactI18next).init({
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
  resources: {
    en: {
      translation: {
        // Navigation
        features: "Features",
        demo: "Demo",
        benefits: "Benefits",
        faq: "FAQ",
        login: "Login",
        getStarted: "Get Started",

        // Hero Section
        "hero.title": "Real Estate Brochures",
        "hero.subtitle": "simplified",
        "hero.description":
          "With ExposeFlow, create stunning real estate marketing materials in minutes without design experience",
        "hero.feature1": "Generate professional property descriptions with AI",
        "hero.feature2":
          "Create beautiful layouts without graphic design skills",
        "hero.feature3":
          "Stand out from competitors with premium marketing materials",
        "hero.startCreating": "Start creating",
        "hero.seeExamples": "See Examples",

        // TrustedBy Section
        "trustedBy.title":
          "Trusted by real estate professionals from top agencies",

        // Features Section
        "features.title": "How ExposeFlow Works",
        "features.step1.title": "Enter Property Details",
        "features.step1.description":
          "Upload photos and enter key property information using our simple form interface",
        "features.step2.title": "AI Generates Content",
        "features.step2.description":
          "Our AI writes compelling property descriptions and lays out a professional design",
        "features.step3.title": "Download Your Brochure",
        "features.step3.description":
          "Preview, edit if needed, and download your ready-to-use professional brochure",
        "features.getStarted": "Get Started",

        // Tab Features
        "features.tabs.photoEnhancement": "Photo Enhancement",
        "features.tabs.aiText": "AI-Powered Text Generation",
        "features.tabs.templates": "Professional Templates",
        "features.learnMore": "Learn more",
        "features.photoEnhancement.description":
          "Automatically enhance your property photos with AI suggested professional filters and adjustments. Our technology detects and improves lighting, colors, and clarity to make your listings stand out.",
        "features.aiText.description":
          "Generate compelling property descriptions automatically using advanced AI technology. Our system creates engaging, accurate content that highlights the best features of your properties without the need for manual writing.",
        "features.aiText.imageAlt": "AI Text Generation",
        "features.templates.description":
          "Choose from a variety of professionally designed templates for your brochures or use your previous designs. Our collection of layouts ensures you'll find the perfect style to showcase any property type.",
        "features.templates.imageAlt": "Professional brochure templates",

        // Demo Section
        "demo.title": "See ExposeFlow in Action",
        "demo.placeholder": "Video Demo Placeholder",

        // Benefits Section
        "benefits.title": "Why Choose ExposeFlow",
        "benefits.saveMoney.title": "Save Money",
        "benefits.saveMoney.description": "No expensive design software needed",
        "benefits.saveTime.title": "Save Time",
        "benefits.saveTime.description":
          "Create brochures in minutes, not hours",
        "benefits.professional.title": "Professional Results",
        "benefits.professional.description":
          "Impress clients with high-quality materials",

        // FAQ Section
        "faq.title": "FAQ",
        "faq.items.pricing.question": "How much does ExposeFlow cost?",
        "faq.items.pricing.answer":
          "ExposeFlow offers flexible pricing plans starting at $9.99/month for our Basic plan, which includes up to 10 brochures per month. Our Professional plan at $19.99/month offers unlimited brochures and premium templates. Enterprise pricing is available for teams and agencies.",
        "faq.items.experience.question":
          "Do I need design experience to use ExposeFlow?",
        "faq.items.experience.answer":
          "Not at all! ExposeFlow is specifically designed for real estate professionals with no design experience. Our templates and AI-powered tools handle all the design work for you, so you can create professional-looking brochures in minutes.",
        "faq.items.customize.question":
          "Can I customize the generated content?",
        "faq.items.customize.answer":
          "Yes, absolutely! While our AI generates high-quality content automatically, you can edit any text, change images, adjust layouts, and customize colors to match your brand. You have complete control over the final output.",
        "faq.items.formats.question":
          "What formats can I download my brochures in?",
        "faq.items.formats.answer":
          "You can download your brochures as high-resolution PDFs ready for printing, web-optimized PDFs for digital sharing, or as image files (JPEG/PNG) for use in social media and other online platforms.",
        "faq.items.limits.question":
          "How many properties can I create brochures for?",
        "faq.items.limits.answer":
          "The number of brochures you can create depends on your subscription plan. Our Basic plan allows up to 10 brochures per month, while our Professional and Enterprise plans offer unlimited brochure creation.",
        "faq.items.branding.question":
          "Can I add my brokerage's branding to the brochures?",
        "faq.items.branding.answer":
          "Yes! ExposeFlow allows you to add your logo, custom colors, contact information, and other branding elements to ensure all your marketing materials are consistent with your brand identity.",

        // Footer
        "footer.customerSupport": "Customer Support",
        "footer.supportHours": "Mo-Fr / 9:00 AM - 5:00 PM",
        "footer.helpCenter": "Help Center",
        "footer.copyright": "© {{year}} ExposeFlow",

        // CTA Section
        "cta.title": "Ready to Transform Your Real Estate Marketing?",
        "cta.description":
          "Join thousands of real estate professionals who are saving time and winning more listings with our AI-powered brochure maker.",
        "cta.trustedBy": "Trusted by:",
        "cta.startToday": "Start Creating Today",
        "cta.signUp":
          "Sign up in 60 seconds and create your first brochure for free.",
        "cta.getStartedFree": "Get Started — It's Free",
        "cta.noCredit": "No credit card required",
      },
    },
    de: {
      translation: {
        // Navigation
        features: "Funktionen",
        demo: "Demo",
        benefits: "Vorteile",
        faq: "FAQ",
        login: "Anmelden",
        getStarted: "Jetzt starten",

        // Hero Section
        "hero.title": "Immobilien Exposés",
        "hero.subtitle": "vereinfacht",
        "hero.description":
          "Mit ExposeFlow erstellen Sie Immobilienmarketing-Materialien in Minuten ohne Design-Erfahrung",
        "hero.feature1":
          "Erstellen Sie professionelle Immobilienbeschreibungen mit KI",
        "hero.feature2":
          "Gestalten Sie schöne Layouts ohne Grafikdesign-Kenntnisse",
        "hero.feature3":
          "Heben Sie sich von der Konkurrenz mit Premium-Marketingmaterialien ab",
        "hero.startCreating": "Jetzt erstellen",
        "hero.seeExamples": "Beispiele ansehen",

        // TrustedBy Section
        "trustedBy.title":
          "Vertraut von Immobilienprofis aus führenden Agenturen",

        // Features Section
        "features.title": "Wie ExposeFlow funktioniert",
        "features.step1.title": "Immobiliendetails eingeben",
        "features.step1.description":
          "Laden Sie Fotos hoch und geben Sie wichtige Immobilieninformationen über unsere einfache Formularoberfläche ein",
        "features.step2.title": "KI generiert Inhalte",
        "features.step2.description":
          "Unsere KI schreibt überzeugende Immobilienbeschreibungen und erstellt ein professionelles Design",
        "features.step3.title": "Laden Sie Ihr Exposé herunter",
        "features.step3.description":
          "Vorschau anzeigen, bei Bedarf bearbeiten und Ihre einsatzbereite professionelle Broschüre herunterladen",
        "features.getStarted": "Jetzt starten",

        // Tab Features
        "features.tabs.photoEnhancement": "Bildverbesserung",
        "features.tabs.aiText": "KI-gestützte Texterstellung",
        "features.tabs.templates": "Professionelle Vorlagen",
        "features.learnMore": "Mehr erfahren",
        "features.photoEnhancement.description":
          "Verbessern Sie Ihre Immobilienfotos automatisch mit KI-gestützten professionellen Filtern und Anpassungen. Unsere Technologie erkennt und verbessert Beleuchtung, Farben und Klarheit, um Ihre Angebote hervorzuheben.",
        "features.aiText.description":
          "Generieren Sie überzeugende Immobilienbeschreibungen automatisch mit fortschrittlicher KI-Technologie. Unser System erstellt ansprechende, präzise Inhalte, die die besten Merkmale Ihrer Immobilien hervorheben, ohne manuelle Texterstellung.",
        "features.aiText.imageAlt": "KI Texterstellung",
        "features.templates.description":
          "Wählen Sie aus einer Vielzahl professionell gestalteter Vorlagen für Ihre Broschüren oder verwenden Sie Ihre bisherigen Designs. Unsere Sammlung von Layouts stellt sicher, dass Sie den perfekten Stil für jede Art von Immobilie finden.",
        "features.templates.imageAlt": "Professionelle Broschürenvorlagen",

        // Demo Section
        "demo.title": "Sehen Sie ExposeFlow in Aktion",
        "demo.placeholder": "Video Demo Platzhalter",

        // Benefits Section
        "benefits.title": "Warum Sie ExposeFlow wählen sollten",
        "benefits.saveMoney.title": "Geld sparen",
        "benefits.saveMoney.description":
          "Keine teure Software und Fotobearbeitung erforderlich",
        "benefits.saveTime.title": "Zeit sparen",
        "benefits.saveTime.description":
          "Erstellen Sie Broschüren in Minuten, nicht Stunden",
        "benefits.professional.title": "Professionelle Ergebnisse",
        "benefits.professional.description":
          "Beeindrucken Sie Kunden mit hochwertigen Materialien",

        // FAQ Section
        "faq.title": "FAQ",
        "faq.items.pricing.question": "Wie viel kostet ExposeFlow?",
        "faq.items.pricing.answer":
          "ExposeFlow bietet flexible Preispläne ab XX €/Monat für unseren Basic-Plan, der bis zu 10 Broschüren pro Monat umfasst. Unser Professional-Plan für XX €/Monat bietet unbegrenzte Broschüren und Premium-Vorlagen. Unternehmenspreise sind für Teams und Agenturen verfügbar.",
        "faq.items.experience.question":
          "Benötige ich Design-Erfahrung, um ExposeFlow zu nutzen?",
        "faq.items.experience.answer":
          "Überhaupt nicht! ExposeFlow ist speziell für Immobilienprofis ohne Design-Erfahrung konzipiert. Unsere Vorlagen und KI-gestützten Tools übernehmen die gesamte Designarbeit für Sie, sodass Sie in Minuten professionell aussehende Broschüren erstellen können.",
        "faq.items.customize.question":
          "Kann ich die generierten Inhalte anpassen?",
        "faq.items.customize.answer":
          "Ja, absolut! Während unsere KI automatisch hochwertige Inhalte generiert, können Sie jeden Text bearbeiten, Bilder ändern, Layouts anpassen und Farben an Ihre Marke anpassen. Sie haben vollständige Kontrolle über das Endergebnis.",
        "faq.items.formats.question":
          "In welchen Formaten kann ich meine Broschüren herunterladen?",
        "faq.items.formats.answer":
          "Sie können Ihre Broschüren als hochauflösende PDFs für den Druck, weboptimierte PDFs für die digitale Weitergabe oder als Bilddateien (JPEG/PNG) für die Verwendung in sozialen Medien und anderen Online-Plattformen herunterladen.",
        "faq.items.limits.question":
          "Für wie viele Immobilien kann ich Broschüren erstellen?",
        "faq.items.limits.answer":
          "Die Anzahl der Broschüren, die Sie erstellen können, hängt von Ihrem Abonnementplan ab. Unser Basic-Plan ermöglicht bis zu 10 Broschüren pro Monat, während unsere Professional- und Enterprise-Pläne unbegrenzte Broschürenerstellung bieten.",
        "faq.items.branding.question":
          "Kann ich das Branding meiner Maklerfirma zu den Broschüren hinzufügen?",
        "faq.items.branding.answer":
          "Ja! ExposeFlow ermöglicht es Ihnen, Ihr Logo, individuelle Farben, Kontaktinformationen und andere Branding-Elemente hinzuzufügen, um sicherzustellen, dass alle Ihre Marketingmaterialien mit Ihrer Markenidentität übereinstimmen.",

        // Footer
        "footer.customerSupport": "Kundensupport",
        "footer.supportHours": "Mo-Fr / 9:00 - 17:00 Uhr",
        "footer.helpCenter": "Hilfecenter",
        "footer.copyright": "© {{year}} BrochureAI",
        "footer.stayUpdated": "Bleiben Sie auf dem Laufenden mit ExposeFlow",
        "footer.newsletterDesc": "Erhalten Sie die neuesten Nachrichten, Updates und Tipps zur Erstellung von erstklassigen Immobilienexposés.",
        "footer.emailPlaceholder": "Ihre E-Mail-Adresse",
        "footer.subscribe": "Abonnieren",
        "footer.thankYou": "Vielen Dank für Ihr Abonnement!",
        "footer.subscriptionSuccess": "Sie wurden erfolgreich zu unserer Newsletter-Liste hinzugefügt!",
        "footer.companyDesc": "KI-gestützte Broschürenerstellungsplattform für Immobilienprofis.",
        "footer.navigation": "Navigation",
        "footer.features": "Funktionen",
        "footer.demos": "Demos",
        "footer.benefits": "Vorteile",
        "footer.faq": "FAQ",
        "footer.legal": "Rechtliches",
        "footer.terms": "Nutzungsbedingungen",
        "footer.privacy": "Datenschutz",
        "footer.imprint": "Impressum",
        "footer.getStarted": "Loslegen",
        "footer.login": "Anmelden",
        "footer.pricing": "Preise",
        "footer.register": "Registrieren",
        "footer.contact": "Kontakt",
        "footer.product": "Produkt",
        "footer.company": "Unternehmen",
        "footer.howItWorks": "Wie es funktioniert",
        "footer.about": "Über uns",
        "footer.privacyPolicy": "Datenschutzerklärung",
        "footer.termsOfService": "Nutzungsbedingungen",
        "footer.updates": "Updates",

        // CTA Section
        "cta.title": "Bereit, Ihr Immobilienmarketing zu transformieren?",
        "cta.description":
          "Schließen Sie sich Tausenden von Immobilienfachleuten an, die mit unserem KI-gestützten Broschürenersteller Zeit sparen und mehr Aufträge gewinnen.",
        "cta.trustedBy": "Vertraut von:",
        "cta.startToday": "Starten Sie noch heute",
        "cta.signUp":
          "Melden Sie sich in 60 Sekunden an und erstellen Sie Ihre erste Broschüre kostenlos.",
        "cta.getStartedFree": "Jetzt starten — Es ist kostenlos",
        "cta.noCredit": "Keine Kreditkarte erforderlich",
      },
    },
  },
});

export default i18n;
