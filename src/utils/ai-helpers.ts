// Create a new file for AI processing utilities - AI ONLY, no static matching

// Define the EXACT placeholders from your list - no more, no less
export interface PropertyPlaceholders {
  phone_number: string;
  email_address: string;
  website_name: string;
  title: string;
  address: string;
  shortdescription: string;
  price: string;
  date_available: string;
  name_brokerfirm: string;
  descriptionlarge: string;
  descriptionextralarge: string;
  address_brokerfirm: string;
}

// Property data interface that maps to your JSON structure
export interface PropertyData {
  projectname: string;
  address: string;
  category: string;
  price: string;
  space: string;
  yearofconstruction: string;
  condition: string;
  qualityofequipment: string;
  balcony: string;
  summary: string;
  layoutdescription: string;
  phone: string;
  email: string;
  website: string;
  amenities: string[];
  powerbackup: string;
  security: string;
  gym: string;
  playarea: string;
  maintainence: string;
}

// Function to process property descriptions with AI ONLY
export const processPropertyDescription = async (description: string): Promise<{
  placeholders: Partial<PropertyPlaceholders>
}> => {
  try {
    console.log("Processing text with AI:", description.substring(0, 100) + "...");
    
    // Use OpenRouter API with a prompt that specifically targets all 12 placeholders
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || ''}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Real Estate Extractor'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-pro-exp-02-05:free',
        messages: [
          {
            role: 'system',
            content: `You are a professional real estate data extractor. Your task is to extract EXACTLY these 12 placeholders from the property description text:

1. phone_number - Contact phone number for inquiries
2. email_address - Email address for contact
3. website_name - Website of the broker/agency
4. title - Professional property title (e.g., "Modern Villa with Lake View")
5. address - Complete property address
6. shortdescription - A SINGLE SENTENCE mentioning property type, whether it's for rent or sale, and location (e.g., "Luxurious apartment for sale in Berlin Mitte with balcony")
7. price - Property price with currency symbol
8. date_available - When the property is available
9. name_brokerfirm - Real estate agency name
10. descriptionlarge - A paragraph about the site plan and position of the property
11. descriptionextralarge - A detailed multi-paragraph description of the property
12. address_brokerfirm - Address of the broker firm

For the descriptions:
- shortdescription MUST be a single sentence mentioning property type, rent/sale status, and location
- descriptionlarge MUST focus on site plan & position of the building
- descriptionextralarge MUST be a detailed description with multiple paragraphs separated by line breaks

Output a JSON object with exactly these 12 fields. Use empty strings for information not found in the text, but generate reasonable content for descriptions.`
          },
          {
            role: 'user',
            content: description
          }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.choices?.[0]?.message?.content) {
      throw new Error("Invalid response format from AI service");
    }
    
    let parsedContent;
    try {
      parsedContent = JSON.parse(data.choices[0].message.content);
      console.log("Successfully parsed AI response for all 12 placeholders:", parsedContent);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      console.error("Raw content:", data.choices[0].message.content);
      throw new Error("Failed to parse AI response");
    }
    
    // Format and check that we have all 12 placeholders
    const placeholders: PropertyPlaceholders = {
      phone_number: parsedContent.phone_number || '',
      email_address: parsedContent.email_address || '',
      website_name: parsedContent.website_name || '',
      title: parsedContent.title || '',
      address: parsedContent.address || '',
      shortdescription: parsedContent.shortdescription || '',
      price: parsedContent.price || '',
      date_available: parsedContent.date_available || '',
      name_brokerfirm: parsedContent.name_brokerfirm || 'Ihre Immobilienmakler GmbH',
      descriptionlarge: parsedContent.descriptionlarge || '',
      descriptionextralarge: parsedContent.descriptionextralarge || '',
      address_brokerfirm: parsedContent.address_brokerfirm || 'Musterstraße 123, 12345 Berlin'
    };
    
    // Log each of the 12 placeholders for debugging
    Object.entries(placeholders).forEach(([key, value]) => {
      console.log(`Placeholder ${key}: "${value.substring(0, 50)}${value.length > 50 ? '...' : ''}"`);
    });
    
    return { placeholders };
  } catch (error) {
    console.error('Error in processPropertyDescription:', error);
    
    // If the first call fails, try a second attempt with a simpler prompt
    try {
      console.log("First API call failed, attempting with backup call for all 12 placeholders...");
      
      const backupResponse = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || ''}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Real Estate Backup'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-haiku:free',
          messages: [
            {
              role: 'system',
              content: `Extract these 12 specific placeholders from the property text:

1. phone_number
2. email_address
3. website_name
4. title (property title)
5. address (property address)
6. shortdescription (one sentence with property type, rent/sale status, location)
7. price
8. date_available
9. name_brokerfirm
10. descriptionlarge (site plan & position description)
11. descriptionextralarge (detailed multi-paragraph description)
12. address_brokerfirm

Output a JSON object with these 12 keys exactly.`
            },
            {
              role: 'user',
              content: description
            }
          ],
          temperature: 0.2,
          response_format: { type: "json_object" }
        }),
      });
      
      if (!backupResponse.ok) {
        throw new Error("Backup API call failed");
      }
      
      const backupData = await backupResponse.json();
      const backupContent = JSON.parse(backupData.choices[0].message.content);
      
      // Ensure we have all 12 placeholders
      const placeholders: PropertyPlaceholders = {
        phone_number: backupContent.phone_number || '',
        email_address: backupContent.email_address || '',
        website_name: backupContent.website_name || '',
        title: backupContent.title || '',
        address: backupContent.address || '',
        shortdescription: backupContent.shortdescription || '',
        price: backupContent.price || '',
        date_available: backupContent.date_available || '',
        name_brokerfirm: backupContent.name_brokerfirm || 'Ihre Immobilienmakler GmbH',
        descriptionlarge: backupContent.descriptionlarge || '',
        descriptionextralarge: backupContent.descriptionextralarge || '',
        address_brokerfirm: backupContent.address_brokerfirm || 'Musterstraße 123, 12345 Berlin'
      };
      
      return { placeholders };
    } catch (backupError) {
      console.error("Both API calls failed:", backupError);
      
      // Return default values for all 12 placeholders if both API calls fail
      return {
        placeholders: {
          phone_number: '',
          email_address: '',
          website_name: '',
          title: '',
          address: '',
          shortdescription: '',
          price: '',
          date_available: '',
          name_brokerfirm: 'Ihre Immobilienmakler GmbH',
          descriptionlarge: '',
          descriptionextralarge: '',
          address_brokerfirm: 'Musterstraße 123, 12345 Berlin'
        }
      };
    }
  }
}; 