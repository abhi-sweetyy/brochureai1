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

// Function to process property descriptions with AI ONLY - fully dynamic approach
export const processPropertyDescription = async (description: string): Promise<{
  placeholders: Partial<PropertyPlaceholders>
}> => {
  try {
    console.log("Processing text with AI:", description.substring(0, 100) + "...");
    
    // Use OpenRouter API with a prompt that specifically targets all 12 placeholders
    const apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error("API key not configured");
    }
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': window.location.origin,
        'X-Title': 'Real Estate Extractor'
      },
      body: JSON.stringify({
        model: 'qwen/qwen2.5-vl-72b-instruct:free', // Changed to a more reliable model
        messages: [
          {
            role: 'system',
            content: `Extract these 12 specific placeholders from the property text:

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

Output ONLY a JSON object with these 12 keys. If information is not found in the text, use empty strings.
Make sure all JSON strings are properly escaped with no unterminated quotes.`
          },
          {
            role: 'user',
            content: description
          }
        ],
        temperature: 0.1, // Lower temperature for more consistent outputs
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      console.error(`API request failed with status ${response.status}`);
      return { placeholders: {} };
    }

    const data = await response.json();
    
    if (!data?.choices?.[0]?.message?.content) {
      console.error("Invalid response structure:", JSON.stringify(data));
      return { placeholders: {} };
    }
    
    let parsedContent: any;
    try {
      const content = data.choices[0].message.content;
      console.log("Raw AI response:", content.substring(0, 200) + "...");
      
      // Handle possible JSON parsing issues
      if (typeof content !== 'string') {
        console.error("Content is not a string:", typeof content);
        return { placeholders: {} };
      }
      
      // Attempt to fix and sanitize the JSON before parsing
      let sanitizedContent = content.trim();
      try {
        parsedContent = JSON.parse(sanitizedContent);
        console.log("Successfully parsed AI response");
      } catch (initialParseError) {
        console.warn("Initial JSON parse failed, attempting to sanitize response:", initialParseError);
        
        // Fallback approach: extract valid JSON data manually
        const placeholders: Partial<PropertyPlaceholders> = {};
        
        // Regex to extract field values - more robust than full JSON parsing
        const fields = [
          "phone_number", "email_address", "website_name", "title", 
          "address", "shortdescription", "price", "date_available", 
          "name_brokerfirm", "descriptionlarge", "descriptionextralarge", 
          "address_brokerfirm"
        ];
        
        fields.forEach(field => {
          const regex = new RegExp(`"${field}"\\s*:\\s*"([^"]*)"`, 'i');
          const match = sanitizedContent.match(regex);
          if (match && match[1]) {
            placeholders[field as keyof PropertyPlaceholders] = match[1];
          }
        });
        
        console.log("Extracted fields using regex fallback");
        return { placeholders };
      }
    } catch (parseError) {
      console.error("Error in JSON handling:", parseError);
      return { placeholders: {} };
    }
    
    // Format and create dynamic placeholders object with only what was extracted
    const placeholders: Partial<PropertyPlaceholders> = {};
    
    // Dynamically assign all values that exist in the parsed content
    Object.keys(parsedContent).forEach(key => {
      if (key in parsedContent && parsedContent[key] !== null && parsedContent[key] !== undefined) {
        placeholders[key as keyof PropertyPlaceholders] = parsedContent[key];
      }
    });
    
    // Log what was extracted
    console.log("Extracted the following fields dynamically:", Object.keys(placeholders).join(", "));
    
    return { placeholders };
  } catch (error) {
    console.error('Error in processPropertyDescription:', error);
    
    // Return an empty object - no fallbacks to static data
    return { placeholders: {} };
  }
}; 