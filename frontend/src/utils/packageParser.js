// Smart parser utility for package data from suvidhatravel.com

/**
 * Parse pricing table from plain text or HTML
 * Handles formats like:
 * "Standard | 7452 | 7047 | 6282 | 5700"
 * "Standard 7452 7047 6282 5700"
 */
export const parsePricingTable = (text) => {
  if (!text || !text.trim()) return [];
  
  const lines = text.split('\n').filter(line => line.trim());
  const results = [];
  
  for (const line of lines) {
    // Skip header lines
    if (line.toLowerCase().includes('category') || 
        line.toLowerCase().includes('per person') ||
        line.toLowerCase().includes('pax') && line.toLowerCase().includes('extra bed')) {
      continue;
    }
    
    // Extract numbers and category name
    const parts = line.split(/[\|\t,]/).map(p => p.trim()).filter(Boolean);
    
    if (parts.length >= 4) {
      // First part is category, rest are prices
      const category = parts[0].replace(/[*\-•]/g, '').trim();
      const numbers = parts.slice(1).map(p => {
        const num = p.replace(/[^\d]/g, '');
        return parseInt(num) || 0;
      });
      
      if (numbers.length >= 4) {
        results.push({
          category,
          price2Pax: numbers[0],
          price4Pax: numbers[1],
          price6Pax: numbers[2],
          extraBed: numbers[3]
        });
      }
    } else {
      // Try space-separated format
      const tokens = line.split(/\s+/);
      const nums = tokens.filter(t => /^\d+$/.test(t)).map(n => parseInt(n));
      
      if (nums.length >= 4) {
        const category = tokens.filter(t => !/^\d+$/.test(t)).join(' ').trim();
        results.push({
          category: category || 'Unknown',
          price2Pax: nums[0],
          price4Pax: nums[1],
          price6Pax: nums[2],
          extraBed: nums[3]
        });
      }
    }
  }
  
  return results;
};

/**
 * Parse hotel details from text
 * Handles formats like:
 * "Standard | Hotel President ( Deluxe )"
 * "Deluxe: Hotel Park Paradise ( Luxury Room )"
 */
export const parseHotelDetails = (text) => {
  if (!text || !text.trim()) return [];
  
  const lines = text.split('\n').filter(line => line.trim());
  const results = [];
  
  for (const line of lines) {
    // Skip header lines
    if (line.toLowerCase().includes('category') || 
        line.toLowerCase().includes('hotel details') ||
        line.toLowerCase().includes('manali') && line.includes('---')) {
      continue;
    }
    
    // Extract category and hotel name
    const parts = line.split(/[\|\t:]/).map(p => p.trim()).filter(Boolean);
    
    if (parts.length >= 2) {
      const category = parts[0].replace(/[*\-•]/g, '').trim();
      const hotelName = parts.slice(1).join(' - ').trim();
      
      results.push({
        category,
        hotelName
      });
    }
  }
  
  return results;
};

/**
 * Parse day-wise itinerary
 * Handles formats like:
 * "Day 01: Title\nDescription..."
 * "Day 1 - Title\nDescription..."
 * "**Day 02 : Title**\nDescription..."
 */
export const parseItinerary = (text) => {
  if (!text || !text.trim()) return [];
  
  // Split by day markers
  const dayPattern = /(?:^|\n)(?:\*\*)?Day\s*(\d+)\s*[:\-–]\s*(.+?)(?:\*\*)?(?=\n|$)/gi;
  const matches = [...text.matchAll(dayPattern)];
  
  if (matches.length === 0) return [];
  
  const results = [];
  
  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const dayNum = parseInt(match[1]);
    const title = match[2].trim();
    
    // Extract description (text between this day and next day)
    const startIdx = match.index + match[0].length;
    const endIdx = i < matches.length - 1 ? matches[i + 1].index : text.length;
    const description = text.substring(startIdx, endIdx).trim();
    
    results.push({
      day: dayNum,
      title,
      description
    });
  }
  
  return results;
};

/**
 * Parse list items (inclusions, exclusions, terms)
 * Handles formats like:
 * "- Item 1\n- Item 2"
 * "• Item 1\n• Item 2"
 * "1. Item 1\n2. Item 2"
 * "Item 1\nItem 2"
 */
export const parseListItems = (text) => {
  if (!text || !text.trim()) return [];
  
  const lines = text.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  const results = [];
  
  for (const line of lines) {
    // Remove common list markers
    let cleaned = line
      .replace(/^[\-–—•*]\s*/, '')           // Remove bullets
      .replace(/^\d+[\.\)]\s*/, '')          // Remove numbers
      .replace(/^[\[\(]\d+[\]\)]\s*/, '')   // Remove bracketed numbers
      .trim();
    
    // Skip if it looks like a header
    if (cleaned.toLowerCase().includes('package cost') ||
        cleaned.toLowerCase().includes('includes') ||
        cleaned.toLowerCase().includes('excludes') ||
        cleaned.toLowerCase().includes('does not include') ||
        cleaned.toLowerCase().includes('terms') ||
        cleaned.length < 3) {
      continue;
    }
    
    results.push(cleaned);
  }
  
  return results;
};

/**
 * Smart parser that attempts to parse JSON first, then falls back to text parsing
 */
export const smartParse = (text, type) => {
  if (!text || !text.trim()) return [];
  
  // Try JSON first
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (e) {
    // Not JSON, continue to text parsing
  }
  
  // Fall back to text parsing
  switch (type) {
    case 'pricing':
      return parsePricingTable(text);
    case 'hotels':
      return parseHotelDetails(text);
    case 'itinerary':
      return parseItinerary(text);
    case 'list':
      return parseListItems(text);
    default:
      return [];
  }
};
