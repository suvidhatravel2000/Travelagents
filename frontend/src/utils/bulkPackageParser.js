// Bulk parser for complete package page from suvidhatravel.com
import { parsePricingTable, parseHotelDetails, parseItinerary, parseListItems } from './packageParser';

/**
 * Master parser that extracts ALL package data from a complete page content
 */
export const parseBulkPackageData = (fullText) => {
  if (!fullText || !fullText.trim()) {
    return null;
  }

  const result = {
    title: '',
    duration: '',
    overview: '',
    validityDates: '',
    vehicleInfo: '',
    additionalInfo: '',
    pricingTable: [],
    hotelDetails: [],
    itinerary: [],
    inclusions: [],
    exclusions: [],
    termsConditions: []
  };

  // Extract Title (first line or contains "Package")
  const lines = fullText.split('\n');
  for (const line of lines) {
    if (line.includes('Package') && line.length > 5 && line.length < 100) {
      result.title = line.trim();
      break;
    }
  }

  // Extract Duration
  const durationMatch = fullText.match(/(\d+N\/\d+D)/i);
  if (durationMatch) {
    result.duration = durationMatch[1].trim();
  }

  // Extract Overview
  const overviewMatch = fullText.match(/Overview[\s\S]{0,50}?([A-Z][^\n]+(?:\n[^\n]+){0,3})/i);
  if (overviewMatch) {
    result.overview = overviewMatch[1].trim();
  }

  // Extract Validity Dates
  const validityMatch = fullText.match(/Valid[^a-z\n]{0,10}(.+?20\d{2}[^\n]*)/i);
  if (validityMatch) {
    result.validityDates = validityMatch[1].trim();
  }

  // Extract Vehicle Info
  const vehicleMatch = fullText.match(/Vehicle[^:]*:([^\n]+)/i) ||
                      fullText.match(/(For \d+-\d+ Pax[^\n]+)/i);
  if (vehicleMatch) {
    result.vehicleInfo = vehicleMatch[1].trim();
  }

  // Extract Pricing Table - find section between "Hotel to be Use" or "Category" and "Hotel Details"
  const pricingMatch = fullText.match(/(?:Hotel to be Use|Category[^\n]*Per Person)([\s\S]+?)(?=\n\s*(?:Vehicle|Hotel Details|PACKAGE))/i);
  if (pricingMatch) {
    result.pricingTable = parsePricingTable(pricingMatch[1]);
  }

  // Extract Hotel Details
  const hotelMatch = fullText.match(/Hotel Details([\s\S]+?)(?=\n\s*(?:PACKAGE|Day \d+|Itinerary))/i);
  if (hotelMatch) {
    result.hotelDetails = parseHotelDetails(hotelMatch[1]);
  }

  // Extract Itinerary
  const itineraryMatch = fullText.match(/(Day \d+:[\s\S]+?)(?=\n\s*(?:Package Cost|Terms|$))/i);
  if (itineraryMatch) {
    result.itinerary = parseItinerary(itineraryMatch[1]);
  }

  // Extract Inclusions
  const inclusionsMatch = fullText.match(/PACKAGE COST INCLUDES([\s\S]+?)(?=\n\s*(?:Day \d+|Package Cost does not|$))/i);
  if (inclusionsMatch) {
    result.inclusions = parseListItems(inclusionsMatch[1]);
  }

  // Extract Exclusions
  const exclusionsMatch = fullText.match(/(?:Package Cost does not Include|PACKAGE.*NOT INCLUDE)([\s\S]+?)(?=\n\s*(?:Terms|Important|$))/i);
  if (exclusionsMatch) {
    result.exclusions = parseListItems(exclusionsMatch[1]);
  }

  // Extract Terms & Conditions (look for bullet points or list items after exclusions)
  const termsMatch = fullText.match(/(?:Terms|Important Notes|Please Note)([\s\S]+?)$/i);
  if (termsMatch) {
    result.termsConditions = parseListItems(termsMatch[1]);
  }

  return result;
};

/**
 * Preview formatter - generates a summary of what was extracted
 */
export const generatePreview = (parsedData) => {
  if (!parsedData) return '';

  const sections = [];

  if (parsedData.title) {
    sections.push(`📦 **Title:** ${parsedData.title}`);
  }

  if (parsedData.duration) {
    sections.push(`⏱️ **Duration:** ${parsedData.duration}`);
  }

  if (parsedData.pricingTable && parsedData.pricingTable.length > 0) {
    sections.push(`💰 **Pricing:** ${parsedData.pricingTable.length} categories found`);
  }

  if (parsedData.hotelDetails && parsedData.hotelDetails.length > 0) {
    sections.push(`🏨 **Hotels:** ${parsedData.hotelDetails.length} hotels found`);
  }

  if (parsedData.itinerary && parsedData.itinerary.length > 0) {
    sections.push(`📅 **Itinerary:** ${parsedData.itinerary.length} days found`);
  }

  if (parsedData.inclusions && parsedData.inclusions.length > 0) {
    sections.push(`✅ **Inclusions:** ${parsedData.inclusions.length} items found`);
  }

  if (parsedData.exclusions && parsedData.exclusions.length > 0) {
    sections.push(`❌ **Exclusions:** ${parsedData.exclusions.length} items found`);
  }

  if (parsedData.termsConditions && parsedData.termsConditions.length > 0) {
    sections.push(`📋 **Terms:** ${parsedData.termsConditions.length} items found`);
  }

  return sections.join('\n');
};
