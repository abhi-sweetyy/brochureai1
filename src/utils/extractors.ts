// Simple regex-based fallback extractors

export function extractTitle(text: string): string | null {
  // Look for lines that might be titles
  const lines = text.split('\n');
  for (const line of lines) {
    if (line.includes('Objekt:')) {
      const nextLine = lines[lines.indexOf(line) + 1];
      if (nextLine && nextLine.trim()) return nextLine.trim();
    }
  }
  
  // Look for patterns like "Doppelhaushälfte mit..." or other property types
  const titleMatch = text.match(/(?:Doppelhaushälfte|Einfamilienhaus|Wohnung|Apartment|Villa)[\s\w]+(?:mit|in|auf)/i);
  if (titleMatch) return titleMatch[0].trim();
  
  return null;
}

export function extractPrice(text: string): string | null {
  // Look for price patterns
  const priceMatch = text.match(/(?:Kaufpreis|Preis|Price|€|EUR|Euro):?\s*([\d.,]+(?:\s*[€TT\-EUR]*)?)/i);
  if (priceMatch && priceMatch[1]) return priceMatch[1].trim();
  
  // Alternative pattern
  const altPriceMatch = text.match(/([\d.,]+)\s*(?:€|EUR|Euro)/i);
  if (altPriceMatch && altPriceMatch[1]) return altPriceMatch[1].trim() + ' €';
  
  // Look for "475.000,-- Euro" pattern
  const specialPriceMatch = text.match(/([\d.,]+)(?:,--|\.--)?\s*(?:€|EUR|Euro)/i);
  if (specialPriceMatch && specialPriceMatch[1]) return specialPriceMatch[1].trim() + ' €';
  
  return null;
}

export function extractSpace(text: string): string | null {
  // Look for space/area patterns
  const spaceMatch = text.match(/(?:[\d.,]+)\s*m²\s*(?:Wohnfläche|Fläche|Grundstück)/i);
  if (spaceMatch) return spaceMatch[0].trim();
  
  // Alternative pattern
  const altSpaceMatch = text.match(/(Ca\.|ca\.|Circa|circa)?\s*([\d.,]+)\s*m²/i);
  if (altSpaceMatch && altSpaceMatch[2]) return altSpaceMatch[2].trim() + ' m²';
  
  return null;
}

export function extractYear(text: string): string | null {
  // Look for construction year patterns
  const yearMatch = text.match(/(?:Baujahr|Jahr|erbaut|built):?\s*(\d{4})/i);
  if (yearMatch && yearMatch[1]) return yearMatch[1];
  
  return null;
} 