import { createInstance } from "i18next";
import { initReactI18next } from "react-i18next";

// Create i18n instance
const i18n = createInstance();

// Initialize i18n with async detection
const initI18n = async () => {
  await i18n.use(initReactI18next).init({
    lng: "en", // default language
    fallbackLng: "en",
    debug: false, // Disable debug mode
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      useSuspense: false, // This is important to prevent issues with SSR
      bindI18n: "languageChanged", // Re-render components when language changes
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
          "hero.feature1":
            "Generate professional property descriptions with AI",
          "hero.feature2":
            "Create beautiful layouts without graphic design skills",
          "hero.feature3":
            "Stand out from competitors with premium marketing materials",
          "hero.startCreating": "Start creating",
          "hero.seeExamples": "View Demo",

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
          "benefits.saveMoney.description":
            "No expensive design software needed",
          "benefits.saveTime.title": "Save Time",
          "benefits.saveTime.description":
            "Create brochures in minutes, not hours",
          "benefits.professional.title": "Professional Results",
          "benefits.professional.description":
            "Impress clients with high-quality materials",

          // Testimonial Section
          "testimonial.quote":
            "ExposeFlow allows me to create compelling exposes much more easily - a real time saver for my real estate business! The ease of use and professional designs are particularly helpful. I also have the option of using my own previous designs as templates.",
          "testimonial.name": "Franz Sorger",
          "testimonial.position": "Real Estate Broker",

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
          "footer.product": "Product",
          "footer.features": "Features",
          "footer.pricing": "Pricing",
          "footer.howItWorks": "How it Works",
          "footer.company": "Company",
          "footer.about": "About",
          "footer.contact": "Contact",
          "footer.faq": "FAQ",
          "footer.legal": "Legal",
          "footer.privacyPolicy": "Privacy Policy",
          "footer.termsOfService": "Terms of Service",
          "footer.companyDesc":
            "AI-powered brochure generation platform for real estate professionals.",

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
          "cta.bookDemo": "Book a Demo",
          "cta.bookDemoDescription":
            "Schedule a 30-minute appointment with our team.",
          "cta.scheduleButton": "Choose a Time",

          // Dashboard Section
          "dashboard.title": "Dashboard",
          "dashboard.subtitle": "Create and manage your real estate brochures",
          "dashboard.credits": "Credits",
          "dashboard.buyCredits": "Buy Credits",
          "dashboard.createBrochure": "Create New Brochure",
          "dashboard.loading": "Loading your dashboard...",
          "dashboard.settingUp": "Setting up your account...",
          "dashboard.menu": "Menu",
          "dashboard.myBrochures": "My Brochures",
          "dashboard.accountSettings": "Account Settings",
          "dashboard.billing": "Billing",
          "dashboard.signOut": "Sign Out",

          // Brochures Page
          "brochures.title": "My Brochures",
          "brochures.subtitle": "View and manage your real estate brochures",
          "brochures.createNew": "Create New Brochure",
          "brochures.yourBrochures": "Your Brochures",
          "brochures.noBrochuresYet": "You haven't created any brochures yet",
          "brochures.createFirstDescription":
            "Create your first professional real estate brochure with our easy-to-use AI templates",
          "brochures.createFirstButton": "Create Your First Brochure",

          // Billing Page
          "billing.mustBeLoggedIn": "You must be logged in to purchase credits",
          "billing.invalidPackage": "Invalid package selected",
          "billing.purchaseSuccess":
            "Successfully purchased {{credits}} credits!",
          "billing.purchaseFailed":
            "Failed to process your purchase. Please try again.",
          "billing.loading": "Loading...",
          "billing.title": "Billing & Credits",
          "billing.subtitle":
            "Purchase credits to create brochures and use premium features",
          "billing.currentBalance": "Current Balance",
          "billing.credits": "Credits",
          "billing.costPerBrochure": "Each brochure costs 1 credit to generate",
          "billing.buyMoreCredits": "Buy More Credits",
          "billing.creditPackages": "Credit Packages",
          "billing.choosePackage": "Choose a package that suits your needs",
          "billing.mostPopular": "Most Popular",
          "billing.bestValue": "Best Value",
          "billing.whatsIncluded": "What's included",
          "billing.justPerCredit": "Just ${{price}} per credit",
          "billing.processing": "Processing...",
          "billing.purchaseNow": "Purchase Now",
          "billing.howCreditsWork": "How Credits Work",
          "billing.purchaseCredits": "Purchase Credits",
          "billing.purchaseCreditsDesc":
            "Buy credit packages that best suit your needs.",
          "billing.createBrochures": "Create Brochures",
          "billing.createBrochuresDesc":
            "Use 1 credit for each brochure you generate.",
          "billing.noExpiration": "No Expiration",
          "billing.noExpirationDesc":
            "Your credits never expire and can be used anytime.",

          // Account Page
          "account.fillAllFields":
            "Please fill in all required fields correctly",
          "account.savingInfo": "Saving your information...",
          "account.saveFailed": "Failed to save your information",
          "account.profileUpdated": "Profile updated successfully",
          "account.profileCompleted":
            "Profile completed successfully! Redirecting to dashboard...",
          "account.unexpectedError": "An unexpected error occurred",
          "account.settings": "Account Settings",
          "account.completeProfile": "Complete Your Profile",
          "account.manageProfile": "Manage your profile information",
          "account.beforeCreate":
            "Before you can create brochures, we need some basic information about you",
          "account.backToDashboard": "Back to Dashboard",
          "account.brokerProfileInfo": "Broker Profile Information",
          "account.infoForBrochures":
            "This information will be used in your real estate brochures and templates.",
          "account.companyLogo": "Company Logo",
          "account.brokerPhoto": "Broker Photo",
          "account.remove": "Remove",
          "account.logoRequired": "Business logo is required",
          "account.photoRequired": "Broker photo is required",
          "account.contactInfo": "Contact Information",
          "account.brokerName": "Broker Name",
          "account.companyName": "Company Name",
          "account.emailAddress": "Email Address",
          "account.phoneNumber": "Phone Number",
          "account.faxNumber": "Fax Number",
          "account.website": "Website",
          "account.address": "Address",
          "account.optional": "optional",
          "account.brokerNamePlaceholder": "John Smith",
          "account.companyNamePlaceholder": "Real Estate Company LLC",
          "account.emailPlaceholder": "john@realestate.com",
          "account.phonePlaceholder": "+1 (123) 456-7890",
          "account.faxPlaceholder": "+1 (123) 456-7891",
          "account.websitePlaceholder": "www.yourcompany.com",
          "account.addressPlaceholder":
            "123 Main Street, Apt 4B, New York, NY 10001",
          "account.websiteNote":
            "Enter your website address (https:// will be added automatically if needed)",
          "account.addressNote":
            "Enter complete address: street name, house number, ZIP code, and city",
          "account.validEmailRequired": "Valid email address is required",
          "account.phoneRequired": "Phone number is required",
          "account.websiteRequired": "Website is required",
          "account.saveProfileInfo": "Save Profile Information",

          // Form Steps
          "formSteps.template.title": "Template",
          "formSteps.template.description":
            "Select a template for your project",
          "formSteps.pages.title": "Pages",
          "formSteps.pages.description": "Select pages to include",
          "formSteps.basicInfo.title": "Basic Info",
          "formSteps.basicInfo.description":
            "Enter basic information about your project",
          "formSteps.images.title": "Images",
          "formSteps.images.description": "Upload images for your project",
          "formSteps.amenities.title": "Amenities",
          "formSteps.amenities.description": "Add amenities and features",
          "formSteps.contactInfo.title": "Contact Info",
          "formSteps.contactInfo.description": "Add contact information",
          "formSteps.review.title": "Review",
          "formSteps.review.description": "Review your project before creating",

          // Form Navigation
          "form.previous": "Previous",
          "form.next": "Next",
          "form.createBrochure": "Create Brochure",
          "form.creating": "Creating...",

          // Form Validation Errors
          "error.selectTemplate": "Please select a template to continue",
          "error.selectPages": "Please select pages to continue",
          "error.titleRequired": "Project title is required",
          "error.loginRequired": "You must be logged in to create a project",

          // API Error Messages
          "api.connectionFailed": "API connection failed.",
          "api.keyMissing":
            "OpenRouter API key is missing. Please add it to your .env file.",
          "api.keyInvalidFormat":
            "OpenRouter API key has invalid format. It should start with 'sk-or-v1-'.",
          "api.keyInvalid":
            "Invalid OpenRouter API key. Please check your credentials.",
          "api.rateLimit":
            "OpenRouter API rate limit exceeded. Please try again later.",
          "api.networkError":
            "Network error connecting to OpenRouter API. Check your internet connection.",
          "api.verifyFailed": "Failed to verify API connection",

          // Document Processing
          "document.extracting": "Extracting property information...",
          "document.extractFailed":
            "Failed to extract information from document",
          "document.extractSuccess": "Successfully extracted {{count}} field",
          "document.extractSuccess_plural":
            "Successfully extracted {{count}} fields",
          "document.missingFields":
            "Some critical fields couldn't be extracted: {{fields}}. Please fill them manually.",
          "document.noFieldsExtracted":
            "No fields could be extracted from the document. Please fill in fields manually.",
          "basicInfo.documentTitle": "Document Upload",
          "basicInfo.uploadInstructions":
            "Upload a document or paste text to extract property information",
          "basicInfo.clickToUpload": "Click to upload",
          "basicInfo.dragDrop": "or drag and drop",
          "basicInfo.supportedFormats": "DOCX, TXT, RTF",
          "basicInfo.orPaste": "Or paste text below",
          "basicInfo.pasteHere": "Paste property description text here...",
          "basicInfo.processing": "Processing...",
          "basicInfo.extractInfo": "Extract Information",
          "basicInfo.requiredInfo": "Required Information",
          "basicInfo.fillEdit": "Fill in or edit the following information",
          "basicInfo.propertyTitle": "Property Title",
          "basicInfo.aiFilled": "AI Filled",
          "basicInfo.enterTitle": "Enter property title",
          "basicInfo.address": "Address",
          "basicInfo.enterAddress": "Enter property address",
          "basicInfo.shortDescription": "Short Description",
          "basicInfo.enterShortDescription": "Enter a short description",
          "basicInfo.price": "Price",
          "basicInfo.enterPrice": "Enter property price",
          "basicInfo.dateAvailable": "Date Available",
          "basicInfo.enterDateAvailable": "Enter date available",
          "basicInfo.sitePlanDescription": "Site Plan Description",
          "basicInfo.enterSitePlanDescription": "Enter site plan description",
          "basicInfo.detailedDescription": "Detailed Description",
          "basicInfo.enterDetailedDescription":
            "Enter detailed property description",
          "basicInfo.regenerateCriticalFields": "Regenerate Critical Fields",

          // Pages selection translations for English
          "pagesSelection.title": "Pages to Include",
          "pagesSelection.description":
            "Select which pages to include in your brochure",
          "pagesSelection.images": "images",
          "pagesSelection.image": "image",
          "pages.projectOverview": "Project Overview",
          "pages.buildingLayout": "Building Layout Plan",
          "pages.description": "Description",
          "pages.exteriorPhotos": "Exterior Photos",
          "pages.interiorPhotos": "Interior Photos",
          "pages.floorPlan": "Floor Plan",
          "pages.energyCertificate": "Excerpt from Energy Certificate",
          "pages.termsConditions": "Terms & Conditions",

          // ImagesStep translations
          "imagesStep.companyLogo": "Company Logo",
          "imagesStep.companyLogoDesc":
            "Upload your company logo that will appear on all pages",
          "imagesStep.agentPhoto": "Agent Photo",
          "imagesStep.agentPhotoDesc":
            "Upload a professional photo of the agent",
          "imagesStep.projectOverview": "Project Overview Image",
          "imagesStep.projectOverviewDesc": "Upload the main project image",
          "imagesStep.buildingLayout": "Building Layout Plan",
          "imagesStep.buildingLayoutDesc": "Upload the building layout plan",
          "imagesStep.exteriorPhotos": "Exterior Photos",
          "imagesStep.exteriorPhotosDesc":
            "Upload exterior photos of the property (max 2)",
          "imagesStep.exteriorPhoto1": "Exterior Photo 1",
          "imagesStep.exteriorPhoto2": "Exterior Photo 2",
          "imagesStep.interiorPhotos": "Interior Photos",
          "imagesStep.interiorPhotosDesc":
            "Upload interior photos of the property (max 2)",
          "imagesStep.interiorPhoto1": "Interior Photo 1",
          "imagesStep.interiorPhoto2": "Interior Photo 2",
          "imagesStep.floorPlan": "Floor Plan",
          "imagesStep.floorPlanDesc": "Upload the floor plan image",
          "imagesStep.energyCertificate": "Energy Certificate",
          "imagesStep.energyCertificateDesc":
            "Upload the energy certificate images (max 2)",
          "imagesStep.energyPage1": "Energy Certificate Page 1",
          "imagesStep.energyPage2": "Energy Certificate Page 2",
          "imagesStep.uploadInfo":
            "Upload images for your selected pages. The system will automatically organize them in your brochure.",

          // ImageUploader translations
          "imageUploader.addImage": "Add Image",
          "imageUploader.uploading": "Uploading...",
          "imageUploader.dropHere": "Drop file here or click to browse",
          "imageUploader.uploadImages": "Upload Property Images",
          "imageUploader.dragAndDrop":
            "Drag and drop your images here, or click to browse your files",
          "imageUploader.supportedFormats":
            "Supported formats: JPG, PNG, WEBP • Max size: 5MB",
          "imageUploader.edit": "Edit",
          "imageUploader.remove": "Remove",
          "imageUploader.enhanceImage": "Enhance Image",
          "imageUploader.enhanceTip":
            "Increase Lighting in image. Click reset if needed",
          "imageUploader.enhancing": "Enhancing image...",
          "imageUploader.saving": "Saving image...",
          "imageUploader.saveChanges": "Save Changes",
          "imageUploader.reset": "Reset",
          "imageUploader.adjustments": "Adjustments",
          "imageUploader.brightness": "Brightness",
          "imageUploader.contrast": "Contrast",
          "imageUploader.blurAreas": "Blur Areas",
          "imageUploader.drawingMode": "Drawing Mode",
          "imageUploader.selectMode": "Select Mode",
          "imageUploader.blurStrength": "Blur Strength",
          "imageUploader.blurInstructions1":
            "Click and drag to draw blur regions",
          "imageUploader.blurInstructions2":
            "Double-click a region to remove it",
          "imageUploader.clearBlur": "Clear All Blur Regions",
          "imageUploader.editBeforeUpload": "Edit Before Upload",

          // AmenitiesStep translations
          "amenities.title": "Property Amenities & Features",
          "amenities.enterInfo":
            "Enter information about the property's amenities and features",
          "amenities.shortDescription": "Short Description",
          "amenities.enterShortDescription":
            "Enter a short description of the property highlighting key amenities",
          "amenities.additionalFeatures": "Additional Feature Details",
          "amenities.enterAdditionalFeatures":
            "Enter additional information about property features and amenities",

          // ContactInfoStep translations
          "contactInfo.title": "Contact Information",
          "contactInfo.enterInfo": "Enter contact information for the property",
          "contactInfo.phoneNumber": "Phone Number",
          "contactInfo.enterPhoneNumber": "Enter phone number",
          "contactInfo.emailAddress": "Email Address",
          "contactInfo.enterEmailAddress": "Enter email address",
          "contactInfo.websiteName": "Website Name",
          "contactInfo.enterWebsiteName": "Enter website name",
          "contactInfo.brokerInfo": "Broker Information",
          "contactInfo.brokerFirmName": "Broker Firm Name",
          "contactInfo.enterBrokerFirmName": "Enter broker firm name",
          "contactInfo.brokerFirmAddress": "Broker Firm Address",
          "contactInfo.enterBrokerFirmAddress": "Enter broker firm address",

          // ReviewStep translations
          "review.title": "Review your information",
          "review.description":
            "Please review all information before submitting.",
          "review.basicInfo": "Basic Information",
          "review.descriptions": "Descriptions",
          "review.contactInfo": "Contact Information",
          "review.images": "Images",
          "review.notProvided": "Not provided",
          "review.title": "Title",
          "review.address": "Address",
          "review.price": "Price",
          "review.dateAvailable": "Date Available",
          "review.shortDescription": "Short Description",
          "review.sitePlanDescription": "Site Plan Description",
          "review.detailedDescription": "Detailed Description",
          "review.phoneNumber": "Phone Number",
          "review.emailAddress": "Email Address",
          "review.websiteName": "Website Name",
          "review.brokerFirmName": "Broker Firm Name",
          "review.brokerFirmAddress": "Broker Firm Address",

          // Project page translations
          "project.dataNotAvailable": "Project data not available",
          "project.untitledProject": "Untitled Project",
          "project.noAddress": "No address",
          "project.propertyInfo": "Property Info",
          "project.descriptions": "Descriptions",
          "project.images": "Images",
          "project.propertyTitle": "Property Title",
          "project.propertyAddress": "Property Address",
          "project.price": "Price",
          "project.dateAvailable": "Date Available",
          "project.phoneNumber": "Phone Number",
          "project.emailAddress": "Email Address",
          "project.website": "Website",
          "project.brokerFirmName": "Broker Firm Name",
          "project.brokerFirmAddress": "Broker Firm Address",
          "project.shortDescription": "Short Description",
          "project.briefDescriptionPlaceholder":
            "Brief description of the property",
          "project.layoutDescription": "Layout Description",
          "project.detailedLayoutPlaceholder":
            "Detailed layout description of the property",
          "project.detailedDescription": "Detailed Description",
          "project.comprehensiveDescriptionPlaceholder":
            "Comprehensive property description",
          "project.uploadImagesInfo":
            "Upload and manage images for your project. These images will be used in your brochure.",
          "project.propertyImages": "Property Images",
          "project.previous": "Previous",
          "project.saving": "Saving...",
          "project.saveChanges": "Save Changes",
          "project.next": "Next",
          "project.error": "Error",

          // DocumentViewer translations
          "documentViewer.addImagesBeforeProcessing":
            "Please add at least one image before processing",
          "documentViewer.failedToProcessPresentation":
            "Failed to process presentation",
          "documentViewer.noProcessedDocument":
            "No processed document to download",
          "documentViewer.failedToDownloadPDF":
            "Failed to download presentation as PDF",
          "documentViewer.failedToUploadImage": "Failed to upload image",
          "documentViewer.imageReplacedSuccessfully":
            "Image replaced successfully",
          "documentViewer.failedToReplaceImage": "Failed to replace image",
          "documentViewer.edit": "Edit",
          "documentViewer.preview": "Preview",
          "documentViewer.generating": "Generating...",
          "documentViewer.generateBrochure": "Generate Brochure",
          "documentViewer.downloadPDF": "Download PDF",
          "documentViewer.editInFullscreen": "Edit in Fullscreen",
          "documentViewer.processingPresentation": "Processing presentation...",
          "documentViewer.presentationEditor": "Presentation Editor",
          "documentViewer.presentationPreview": "Presentation Preview",
          "documentViewer.noBrochurePreview": "No Brochure preview available.",
          "documentViewer.clickGenerateBrochure":
            'Click "Generate Brochure" to create a presentation with your data.',
          "documentViewer.exitFullScreen": "Exit Full Screen",
          "documentViewer.openInNewTab": "Open in New Tab",
          "documentViewer.openGoogleSlides": "Open Google Slides",
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
            "Heben Sie sich von der Konkurrenz mit Premium-Materialien ab",
          "hero.startCreating": "Jetzt erstellen",
          "hero.seeExamples": "Demo ansehen",

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

          // Testimonial Section
          "testimonial.quote":
            "Mit ExposeFlow kann ich deutlich einfacher ansprechende Exposés erstellen – ein echter Zeitsparer für mein Maklergeschäft! Die einfache Handhabung und die professionellen Designs sind besonders hilfreich. Ich habe die Möglichkeit, meine eigenen vorherigen Designs als Vorlagen zu nutzen.",
          "testimonial.name": "Franz Sorger",
          "testimonial.position": "Makler für Gastronomie-Immobilien",

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
          "footer.newsletterDesc":
            "Erhalten Sie die neuesten Nachrichten, Updates und Tipps zur Erstellung von erstklassigen Immobilienexposés.",
          "footer.emailPlaceholder": "Ihre E-Mail-Adresse",
          "footer.subscribe": "Abonnieren",
          "footer.thankYou": "Vielen Dank für Ihr Abonnement!",
          "footer.subscriptionSuccess":
            "Sie wurden erfolgreich zu unserer Newsletter-Liste hinzugefügt!",
          "footer.companyDesc":
            "KI-gestützte Broschürenerstellungsplattform für Immobilienprofis.",
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
          "cta.bookDemo": "Demo vereinbaren",
          "cta.bookDemoDescription":
            "Buchen Sie einen 30-minütigen Termin mit unserem Team.",
          "cta.scheduleButton": "Termin aussuchen",

          // Dashboard Section
          "dashboard.title": "Dashboard",
          "dashboard.subtitle":
            "Erstellen und verwalten Sie Ihre Immobilienbroschüren",
          "dashboard.credits": "Guthaben",
          "dashboard.buyCredits": "Guthaben kaufen",
          "dashboard.createBrochure": "Neue Broschüre erstellen",
          "dashboard.loading": "Dashboard wird geladen...",
          "dashboard.settingUp": "Konto wird eingerichtet...",
          "dashboard.menu": "Menü",
          "dashboard.myBrochures": "Meine Broschüren",
          "dashboard.accountSettings": "Kontoeinstellungen",
          "dashboard.billing": "Abrechnung",
          "dashboard.signOut": "Abmelden",

          // Brochures Page
          "brochures.title": "Meine Broschüren",
          "brochures.subtitle":
            "Ansicht und Verwaltung Ihrer Immobilienbroschüren",
          "brochures.createNew": "Neue Broschüre erstellen",
          "brochures.yourBrochures": "Ihre Broschüren",
          "brochures.noBrochuresYet":
            "Sie haben noch keine Broschüren erstellt",
          "brochures.createFirstDescription":
            "Erstellen Sie Ihre erste professionelle Immobilienbroschüre mit unseren einfachen AI-Vorlagen",
          "brochures.createFirstButton": "Erstellen Sie Ihre erste Broschüre",

          // Billing Page
          "billing.mustBeLoggedIn":
            "Sie müssen angemeldet sein, um Kredite zu kaufen",
          "billing.invalidPackage": "Ungültiges Paket ausgewählt",
          "billing.purchaseSuccess": "{{credits}} Kredite erfolgreich gekauft!",
          "billing.purchaseFailed":
            "Fehler beim Verarbeiten Ihrer Bestellung. Bitte versuchen Sie es erneut.",
          "billing.loading": "Wird geladen...",
          "billing.title": "Abrechnung & Guthaben",
          "billing.subtitle":
            "Kredite kaufen, um Broschüren zu erstellen und Premium-Funktionen zu verwenden",
          "billing.currentBalance": "Aktuelles Guthaben",
          "billing.credits": "Kredite",
          "billing.costPerBrochure":
            "Jede Broschüre kostet 1 Kredit zum Generieren",
          "billing.buyMoreCredits": "Mehr Kredite kaufen",
          "billing.creditPackages": "Kreditpakete",
          "billing.choosePackage":
            "Wählen Sie ein Paket, das zu Ihren Bedürfnissen passt",
          "billing.mostPopular": "Am Beliebtesten",
          "billing.bestValue": "Bestes Wert",
          "billing.whatsIncluded": "Was ist enthalten",
          "billing.justPerCredit": "Nur ${{price}} pro Kredit",
          "billing.processing": "Wird verarbeitet...",
          "billing.purchaseNow": "Jetzt kaufen",
          "billing.howCreditsWork": "Wie Kredite funktionieren",
          "billing.purchaseCredits": "Kredite kaufen",
          "billing.purchaseCreditsDesc":
            "Kreditpakete kaufen, die am besten zu Ihren Bedürfnissen passen.",
          "billing.createBrochures": "Broschüren erstellen",
          "billing.createBrochuresDesc":
            "1 Kredit für jede Broschüre, die Sie generieren.",
          "billing.noExpiration": "Keine Ablaufzeit",
          "billing.noExpirationDesc":
            "Ihre Kredite verfallen nie und können jederzeit verwendet werden.",

          // Account Page
          "account.fillAllFields":
            "Bitte füllen Sie alle erforderlichen Felder korrekt aus",
          "account.savingInfo": "Informationen werden gespeichert...",
          "account.saveFailed":
            "Informationen konnten nicht gespeichert werden",
          "account.profileUpdated": "Profil erfolgreich aktualisiert",
          "account.profileCompleted":
            "Profil erfolgreich abgeschlossen! Umleitung zur Dashboard...",
          "account.unexpectedError": "Ein unerwarteter Fehler ist aufgetreten",
          "account.settings": "Kontoeinstellungen",
          "account.completeProfile": "Profil vollständig ausfüllen",
          "account.manageProfile": "Profilinformationen verwalten",
          "account.beforeCreate":
            "Bevor Sie Broschüren erstellen können, benötigen wir einige grundlegende Informationen über Sie",
          "account.backToDashboard": "Zurück zum Dashboard",
          "account.brokerProfileInfo": "Maklerprofilinformationen",
          "account.infoForBrochures":
            "Diese Informationen werden in Ihren Immobilienbroschüren und Vorlagen verwendet.",
          "account.companyLogo": "Firmenlogo",
          "account.brokerPhoto": "Maklerfoto",
          "account.remove": "Entfernen",
          "account.logoRequired": "Geschäftslogo ist erforderlich",
          "account.photoRequired": "Maklerfoto ist erforderlich",
          "account.contactInfo": "Kontaktinformationen",
          "account.brokerName": "Maklername",
          "account.companyName": "Firmenname",
          "account.emailAddress": "E-Mail-Adresse",
          "account.phoneNumber": "Telefonnummer",
          "account.faxNumber": "Faxnummer",
          "account.website": "Webseite",
          "account.address": "Adresse",
          "account.optional": "optional",
          "account.brokerNamePlaceholder": "John Smith",
          "account.companyNamePlaceholder": "Real Estate Company LLC",
          "account.emailPlaceholder": "john@realestate.com",
          "account.phonePlaceholder": "+1 (123) 456-7890",
          "account.faxPlaceholder": "+1 (123) 456-7891",
          "account.websitePlaceholder": "www.yourcompany.com",
          "account.addressPlaceholder":
            "123 Main Street, Apt 4B, New York, NY 10001",
          "account.websiteNote":
            "Geben Sie Ihre Webseite ein (https:// wird automatisch hinzugefügt, wenn es benötigt wird)",
          "account.addressNote":
            "Geben Sie die vollständige Adresse ein: Straßenname, Hausnummer, ZIP-Code und Stadt",
          "account.validEmailRequired":
            "Gültige E-Mail-Adresse ist erforderlich",
          "account.phoneRequired": "Telefonnummer ist erforderlich",
          "account.websiteRequired": "Webseite ist erforderlich",
          "account.saveProfileInfo": "Profilinformationen speichern",

          // Form Steps
          "formSteps.template.title": "Vorlage",
          "formSteps.template.description":
            "Wählen Sie eine Vorlage für Ihr Projekt",
          "formSteps.pages.title": "Seiten",
          "formSteps.pages.description":
            "Wählen Sie die einzuschließenden Seiten",
          "formSteps.basicInfo.title": "Grundlegende Infos",
          "formSteps.basicInfo.description":
            "Geben Sie grundlegende Informationen zu Ihrem Projekt ein",
          "formSteps.images.title": "Bilder",
          "formSteps.images.description":
            "Laden Sie Bilder für Ihr Projekt hoch",
          "formSteps.amenities.title": "Ausstattung",
          "formSteps.amenities.description":
            "Fügen Sie Ausstattungsmerkmale hinzu",
          "formSteps.contactInfo.title": "Kontaktinformationen",
          "formSteps.contactInfo.description":
            "Fügen Sie Kontaktinformationen hinzu",
          "formSteps.review.title": "Überprüfung",
          "formSteps.review.description":
            "Überprüfen Sie Ihr Projekt vor der Erstellung",

          // Form Navigation
          "form.previous": "Zurück",
          "form.next": "Weiter",
          "form.createBrochure": "Broschüre erstellen",
          "form.creating": "Wird erstellt...",

          // Form Validation Errors
          "error.selectTemplate":
            "Bitte wählen Sie eine Vorlage aus, um fortzufahren",
          "error.selectPages": "Bitte wählen Sie Seiten aus, um fortzufahren",
          "error.titleRequired": "Projekttitel ist erforderlich",
          "error.loginRequired":
            "Sie müssen angemeldet sein, um ein Projekt zu erstellen",

          // API Error Messages
          "api.connectionFailed": "API-Verbindung fehlgeschlagen.",
          "api.keyMissing":
            "OpenRouter API-Schlüssel fehlt. Bitte fügen Sie ihn zu Ihrer .env-Datei hinzu.",
          "api.keyInvalidFormat":
            "OpenRouter API-Schlüssel hat ein ungültiges Format. Er sollte mit 'sk-or-v1-' beginnen.",
          "api.keyInvalid":
            "Ungültiger OpenRouter API-Schlüssel. Bitte überprüfen Sie Ihre Anmeldedaten.",
          "api.rateLimit":
            "OpenRouter API-Ratenlimit überschritten. Bitte versuchen Sie es später erneut.",
          "api.networkError":
            "Netzwerkfehler bei der Verbindung zur OpenRouter API. Überprüfen Sie Ihre Internetverbindung.",
          "api.verifyFailed": "API-Verbindung konnte nicht verifiziert werden",

          // Document Processing
          "document.extracting": "Immobilieninformationen werden extrahiert...",
          "document.extractFailed":
            "Informationen konnten nicht aus dem Dokument extrahiert werden",
          "document.extractSuccess": "{{count}} Feld erfolgreich extrahiert",
          "document.extractSuccess_plural":
            "{{count}} Felder erfolgreich extrahiert",
          "document.missingFields":
            "Einige wichtige Felder konnten nicht extrahiert werden: {{fields}}. Bitte füllen Sie diese manuell aus.",
          "document.noFieldsExtracted":
            "Es konnten keine Felder aus dem Dokument extrahiert werden. Bitte füllen Sie die Felder manuell aus.",

          // Add the BasicInfo translations
          "basicInfo.documentTitle": "Dokument hochladen",
          "basicInfo.uploadInstructions":
            "Laden Sie ein Dokument hoch oder fügen Sie Text ein, um Immobilieninformationen zu extrahieren",
          "basicInfo.clickToUpload": "Klicken zum Hochladen",
          "basicInfo.dragDrop": "oder per Drag & Drop",
          "basicInfo.supportedFormats": "DOCX, TXT, RTF",
          "basicInfo.orPaste": "Oder Text unten einfügen",
          "basicInfo.pasteHere": "Immobilienbeschreibung hier einfügen...",
          "basicInfo.processing": "Wird verarbeitet...",
          "basicInfo.extractInfo": "Informationen extrahieren",
          "basicInfo.requiredInfo": "Erforderliche Informationen",
          "basicInfo.fillEdit":
            "Füllen Sie die folgenden Informationen aus oder bearbeiten Sie sie",
          "basicInfo.propertyTitle": "Immobilientitel",
          "basicInfo.aiFilled": "KI-ausgefüllt",
          "basicInfo.enterTitle": "Immobilientitel eingeben",
          "basicInfo.address": "Adresse",
          "basicInfo.enterAddress": "Immobilienadresse eingeben",
          "basicInfo.shortDescription": "Kurzbeschreibung",
          "basicInfo.enterShortDescription":
            "Geben Sie eine kurze Beschreibung ein",
          "basicInfo.price": "Preis",
          "basicInfo.enterPrice": "Immobilienpreis eingeben",
          "basicInfo.dateAvailable": "Verfügbarkeitsdatum",
          "basicInfo.enterDateAvailable": "Verfügbarkeitsdatum eingeben",
          "basicInfo.sitePlanDescription": "Lageplan-Beschreibung",
          "basicInfo.enterSitePlanDescription":
            "Lageplan-Beschreibung eingeben",
          "basicInfo.detailedDescription": "Detaillierte Beschreibung",
          "basicInfo.enterDetailedDescription":
            "Detaillierte Immobilienbeschreibung eingeben",
          "basicInfo.regenerateCriticalFields":
            "Kritische Felder neu generieren",

          // Pages selection translations for German
          "pagesSelection.title": "Einzuschließende Seiten",
          "pagesSelection.description":
            "Wählen Sie aus, welche Seiten in Ihre Broschüre aufgenommen werden sollen",
          "pagesSelection.images": "Bilder",
          "pagesSelection.image": "Bild",
          "pages.projectOverview": "Projektübersicht",
          "pages.buildingLayout": "Gebäudeplan",
          "pages.description": "Beschreibung",
          "pages.exteriorPhotos": "Außenaufnahmen",
          "pages.interiorPhotos": "Innenaufnahmen",
          "pages.floorPlan": "Grundriss",
          "pages.energyCertificate": "Auszug aus dem Energieausweis",
          "pages.termsConditions": "Allgemeine Geschäftsbedingungen",

          // ImagesStep translations in German
          "imagesStep.companyLogo": "Firmenlogo",
          "imagesStep.companyLogoDesc":
            "Laden Sie Ihr Firmenlogo hoch, das auf allen Seiten erscheinen wird",
          "imagesStep.agentPhoto": "Foto des Maklers",
          "imagesStep.agentPhotoDesc":
            "Laden Sie ein professionelles Foto des Maklers hoch",
          "imagesStep.projectOverview": "Projektübersichtsbild",
          "imagesStep.projectOverviewDesc":
            "Laden Sie das Hauptprojektbild hoch",
          "imagesStep.buildingLayout": "Gebäudeplan",
          "imagesStep.buildingLayoutDesc": "Laden Sie den Gebäudeplan hoch",
          "imagesStep.exteriorPhotos": "Außenaufnahmen",
          "imagesStep.exteriorPhotosDesc":
            "Laden Sie Außenaufnahmen der Immobilie hoch (max. 2)",
          "imagesStep.exteriorPhoto1": "Außenaufnahme 1",
          "imagesStep.exteriorPhoto2": "Außenaufnahme 2",
          "imagesStep.interiorPhotos": "Innenaufnahmen",
          "imagesStep.interiorPhotosDesc":
            "Laden Sie Innenaufnahmen der Immobilie hoch (max. 2)",
          "imagesStep.interiorPhoto1": "Innenaufnahme 1",
          "imagesStep.interiorPhoto2": "Innenaufnahme 2",
          "imagesStep.floorPlan": "Grundriss",
          "imagesStep.floorPlanDesc": "Laden Sie das Grundrissbild hoch",
          "imagesStep.energyCertificate": "Energieausweis",
          "imagesStep.energyCertificateDesc":
            "Laden Sie die Bilder des Energieausweises hoch (max. 2)",
          "imagesStep.energyPage1": "Energieausweis Seite 1",
          "imagesStep.energyPage2": "Energieausweis Seite 2",
          "imagesStep.uploadInfo":
            "Laden Sie Bilder für Ihre ausgewählten Seiten hoch. Das System wird sie automatisch in Ihrer Broschüre organisieren.",

          // ImageUploader translations in German
          "imageUploader.addImage": "Bild hinzufügen",
          "imageUploader.uploading": "Wird hochgeladen...",
          "imageUploader.dropHere":
            "Datei hier ablegen oder klicken zum Durchsuchen",
          "imageUploader.uploadImages": "Immobilienbilder hochladen",
          "imageUploader.dragAndDrop":
            "Ziehen Sie Ihre Bilder hierher oder klicken Sie, um Ihre Dateien zu durchsuchen",
          "imageUploader.supportedFormats":
            "Unterstützte Formate: JPG, PNG, WEBP • Maximale Größe: 5MB",
          "imageUploader.edit": "Bearbeiten",
          "imageUploader.remove": "Entfernen",
          "imageUploader.enhanceImage": "Bild verbessern",
          "imageUploader.enhanceTip":
            "Beleuchtung im Bild erhöhen. Klicken Sie bei Bedarf auf Zurücksetzen",
          "imageUploader.enhancing": "Bild wird verbessert...",
          "imageUploader.saving": "Bild wird gespeichert...",
          "imageUploader.saveChanges": "Änderungen speichern",
          "imageUploader.reset": "Zurücksetzen",
          "imageUploader.adjustments": "Anpassungen",
          "imageUploader.brightness": "Helligkeit",
          "imageUploader.contrast": "Kontrast",
          "imageUploader.blurAreas": "Unschärfebereiche",
          "imageUploader.drawingMode": "Zeichenmodus",
          "imageUploader.selectMode": "Auswahlmodus",
          "imageUploader.blurStrength": "Unschärfestärke",
          "imageUploader.blurInstructions1":
            "Klicken und ziehen Sie, um Unschärfebereiche zu zeichnen",
          "imageUploader.blurInstructions2":
            "Doppelklicken Sie auf einen Bereich, um ihn zu entfernen",
          "imageUploader.clearBlur": "Alle Unschärfebereiche löschen",
          "imageUploader.editBeforeUpload": "Vor dem Hochladen bearbeiten",

          // AmenitiesStep translations in German
          "amenities.title": "Immobilienausstattung & Merkmale",
          "amenities.enterInfo":
            "Geben Sie Informationen zu den Ausstattungsmerkmalen der Immobilie ein",
          "amenities.shortDescription": "Kurzbeschreibung",
          "amenities.enterShortDescription":
            "Geben Sie eine kurze Beschreibung der Immobilie mit den wichtigsten Ausstattungsmerkmalen ein",
          "amenities.additionalFeatures": "Zusätzliche Ausstattungsdetails",
          "amenities.enterAdditionalFeatures":
            "Geben Sie zusätzliche Informationen zu Ausstattungsmerkmalen der Immobilie ein",

          // ContactInfoStep translations in German
          "contactInfo.title": "Kontaktinformationen",
          "contactInfo.enterInfo":
            "Geben Sie Kontaktinformationen für die Immobilie ein",
          "contactInfo.phoneNumber": "Telefonnummer",
          "contactInfo.enterPhoneNumber": "Telefonnummer eingeben",
          "contactInfo.emailAddress": "E-Mail-Adresse",
          "contactInfo.enterEmailAddress": "E-Mail-Adresse eingeben",
          "contactInfo.websiteName": "Webseite",
          "contactInfo.enterWebsiteName": "Webseite eingeben",
          "contactInfo.brokerInfo": "Maklerinformationen",
          "contactInfo.brokerFirmName": "Name der Maklerfirma",
          "contactInfo.enterBrokerFirmName": "Namen der Maklerfirma eingeben",
          "contactInfo.brokerFirmAddress": "Adresse der Maklerfirma",
          "contactInfo.enterBrokerFirmAddress":
            "Adresse der Maklerfirma eingeben",

          // ReviewStep translations in German
          "review.title": "Informationen überprüfen",
          "review.description":
            "Bitte überprüfen Sie alle Informationen vor dem Absenden.",
          "review.basicInfo": "Grundlegende Informationen",
          "review.descriptions": "Beschreibungen",
          "review.contactInfo": "Kontaktinformationen",
          "review.images": "Bilder",
          "review.notProvided": "Nicht angegeben",
          "review.title": "Titel",
          "review.address": "Adresse",
          "review.price": "Preis",
          "review.dateAvailable": "Verfügbarkeitsdatum",
          "review.shortDescription": "Kurzbeschreibung",
          "review.sitePlanDescription": "Lageplan-Beschreibung",
          "review.detailedDescription": "Detaillierte Beschreibung",
          "review.phoneNumber": "Telefonnummer",
          "review.emailAddress": "E-Mail-Adresse",
          "review.websiteName": "Webseite",
          "review.brokerFirmName": "Name der Maklerfirma",
          "review.brokerFirmAddress": "Adresse der Maklerfirma",

          // Project page translations
          "project.dataNotAvailable": "Projektdaten nicht verfügbar",
          "project.untitledProject": "Unbenanntes Projekt",
          "project.noAddress": "Keine Adresse",
          "project.propertyInfo": "Immobilieninformationen",
          "project.descriptions": "Beschreibungen",
          "project.images": "Bilder",
          "project.propertyTitle": "Immobilientitel",
          "project.propertyAddress": "Immobilienadresse",
          "project.price": "Preis",
          "project.dateAvailable": "Verfügbarkeitsdatum",
          "project.phoneNumber": "Telefonnummer",
          "project.emailAddress": "E-Mail-Adresse",
          "project.website": "Webseite",
          "project.brokerFirmName": "Name der Maklerfirma",
          "project.brokerFirmAddress": "Adresse der Maklerfirma",
          "project.shortDescription": "Kurzbeschreibung",
          "project.briefDescriptionPlaceholder":
            "Kurze Beschreibung der Immobilie",
          "project.layoutDescription": "Lagebeschreibung",
          "project.detailedLayoutPlaceholder":
            "Detaillierte Lagebeschreibung der Immobilie",
          "project.detailedDescription": "Detaillierte Beschreibung",
          "project.comprehensiveDescriptionPlaceholder":
            "Umfassende Immobilienbeschreibung",
          "project.uploadImagesInfo":
            "Laden Sie Bilder für Ihr Projekt hoch und verwalten Sie sie. Diese Bilder werden in Ihrer Broschüre verwendet.",
          "project.propertyImages": "Immobilienbilder",
          "project.previous": "Zurück",
          "project.saving": "Wird gespeichert...",
          "project.saveChanges": "Änderungen speichern",
          "project.next": "Weiter",
          "project.error": "Fehler",

          // DocumentViewer translations
          "documentViewer.addImagesBeforeProcessing":
            "Bitte fügen Sie mindestens ein Bild hinzu, bevor Sie fortfahren",
          "documentViewer.failedToProcessPresentation":
            "Fehler bei der Verarbeitung der Präsentation",
          "documentViewer.noProcessedDocument":
            "Kein verarbeitetes Dokument zum Herunterladen",
          "documentViewer.failedToDownloadPDF":
            "Fehler beim Herunterladen der Präsentation als PDF",
          "documentViewer.failedToUploadImage":
            "Fehler beim Hochladen des Bildes",
          "documentViewer.imageReplacedSuccessfully":
            "Bild erfolgreich ersetzt",
          "documentViewer.failedToReplaceImage":
            "Fehler beim Ersetzen des Bildes",
          "documentViewer.edit": "Bearbeiten",
          "documentViewer.preview": "Vorschau",
          "documentViewer.generating": "Wird generiert...",
          "documentViewer.generateBrochure": "Broschüre erstellen",
          "documentViewer.downloadPDF": "PDF herunterladen",
          "documentViewer.editInFullscreen": "Im Vollbildmodus bearbeiten",
          "documentViewer.processingPresentation":
            "Präsentation wird verarbeitet...",
          "documentViewer.presentationEditor": "Präsentationseditor",
          "documentViewer.presentationPreview": "Präsentationsvorschau",
          "documentViewer.noBrochurePreview":
            "Keine Broschürenvorschau verfügbar.",
          "documentViewer.clickGenerateBrochure":
            'Klicken Sie auf "Broschüre erstellen", um eine Präsentation mit Ihren Daten zu erstellen.',
          "documentViewer.exitFullScreen": "Vollbildmodus beenden",
          "documentViewer.openInNewTab": "In neuem Tab öffnen",
          "documentViewer.openGoogleSlides": "Google Präsentationen öffnen",
        },
      },
    },
  });

  return i18n;
};

// Helper function to force reload all translations
export const forceReloadTranslations = async (lang) => {
  if (i18n.isInitialized) {
    try {
      await i18n.reloadResources();
      return true;
    } catch (error) {
      return true;
    }
  } else {
    return true;
  }
};

// Initialize immediately to make i18n available
initI18n();

// Export initialized instance for components to use
export default i18n;

// Export the initialization function for providers to await if needed
export { initI18n };
