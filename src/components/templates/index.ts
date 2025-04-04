export interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  documentPath: string;  // Path to the editable document template
  pdfPath: string;      // Path to the PDF version
  placeholders: {
    projectTitle: { selector: string; defaultValue?: string; };
    website: { selector: string; defaultValue?: string; };
    email: { selector: string; defaultValue?: string; };
    address: { selector: string; defaultValue?: string; };
    summary: { selector: string; defaultValue?: string; };  // AI-generated
    images: Array<{
      selector: string;
      aspectRatio: number;
    }>;
  };
}

export const templates: Template[] = [
  {
    id: 'template1',
    name: 'Modern Interior',
    description: 'Contemporary design with wooden accents and clean layout',
    thumbnail: '/templates/template1-thumb.jpg',
    documentPath: '/templates/template1.docx',
    pdfPath: '/templates/template1.pdf',
    placeholders: {
      projectTitle: { 
        selector: '{{projecttitle}}',
        defaultValue: 'Your Project Title' 
      },
      website: { 
        selector: '{{website}}',
        defaultValue: 'www.yourwebsite.com' 
      },
      email: { 
        selector: '{{email}}',
        defaultValue: 'contact@email.com' 
      },
      address: { 
        selector: '{{address}}',
        defaultValue: 'Your Address Here' 
      },
      summary: { 
        selector: '{{summary of project}}',
        defaultValue: 'Project summary will be generated by AI' 
      },
      images: [
        { 
          selector: '{{image1}}', 
          aspectRatio: 16/9  // Main hero image
        },
        { 
          selector: '{{image2}}', 
          aspectRatio: 16/9  // Bottom image
        }
      ]
    }
  }
];
