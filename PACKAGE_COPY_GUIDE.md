# How to Copy Packages from suvidhatravel.com

## Package Data Structure

When creating/editing a package in the admin panel, use this format:

### Basic Info
- **Title**: Copy the package title (e.g., "Manali Volvo Package – 4 Nights")
- **Destination**: Select appropriate destination (e.g., himachal, manali)
- **Category**: Display name (e.g., "Himachal", "Manali")
- **Duration**: e.g., "4N/5D"
- **Days**: Brief description (e.g., "4 Nights in Manali")
- **Price**: Base price for display (use lowest price from table)
- **Original Price**: Higher price for discount display

### Overview Section
Copy the overview text including:
- Rate validity dates
- Special notes
- Any important information

### Pricing Table (JSON Format)
```json
{
  "pricingTable": [
    {"category": "Standard", "price2Pax": 7452, "price4Pax": 7047, "price6Pax": 6282, "extraBed": 5700},
    {"category": "Deluxe", "price2Pax": 8748, "price4Pax": 8343, "price6Pax": 7578, "extraBed": 6500},
    {"category": "Deluxe Plus", "price2Pax": 9612, "price4Pax": 9207, "price6Pax": 8442, "extraBed": 7800}
  ]
}
```

### Hotel Details (JSON Format)
```json
{
  "hotelDetails": [
    {"category": "Standard", "hotelName": "Hotel President", "roomType": "Deluxe"},
    {"category": "Deluxe", "hotelName": "Hotel Park Paradise", "roomType": "Luxury Room with Balcony"}
  ]
}
```

### Additional Info
- **vehicleInfo**: "For 2-3 Pax: Alto || For 4-6 Pax: Ertiga"
- **validityDates**: "Valid till 01st July 2025 – 30th March 2026"
- **additionalInfo**: Any special notes (honeymoon packages, etc.)

### Itinerary (Day-wise)
```json
{
  "itinerary": [
    {
      "day": 1,
      "title": "Delhi – Manali",
      "description": "Full description of day 1 activities..."
    },
    {
      "day": 2,
      "title": "Manali Arrival (Local Sightseeing)",
      "description": "Full description of day 2 activities..."
    }
  ]
}
```

### Inclusions (Array of strings)
```json
{
  "inclusions": [
    "2 tickets for Delhi – Manali –Delhi Transfer by Volvo",
    "04 Nights & 05 Days Stay In Respective Room",
    "Welcome Drink (Non Alcoholic) On Arrival",
    "Morning Tea",
    "04 Breakfast and 04 Dinner"
  ]
}
```

### Exclusions (Array of strings)
```json
{
  "exclusions": [
    "Any Kind of Personal Expenses or Optional Tours / Extra Meals Ordered",
    "Lunch",
    "Manikaran taxi cost is not includes",
    "Any adventure activity Paragliding /Snow Skating /Horse riding/ River crossing Rafting etc"
  ]
}
```

### Terms & Conditions (Optional)
```json
{
  "termsConditions": [
    "Room Heater Charges Extra",
    "In Vehicle, A/c will not work on Hills",
    "Rohtang Pass is Closed on Tuesday"
  ]
}
```

## Step-by-Step Process

1. **Go to Admin Panel**: Login at `/admin/cms`
2. **Navigate to Packages**: Click "Packages" in sidebar
3. **Add New Package**: Click "Add Package" button
4. **Fill Basic Info**: Title, destination, category, duration, prices
5. **Add Overview**: Copy from original site
6. **Paste Structured Data**: Use browser console or text editor to format JSON
7. **Add Itinerary**: Copy each day's description
8. **Add Lists**: Copy inclusions, exclusions, terms
9. **Save**: Review and save

## Pro Tips

- Use multi-line text for long descriptions
- Preserve formatting with line breaks
- Double-check prices and dates
- Test package display after saving
- Keep original page open for reference

## What's Now Supported

✅ Pricing tables with multiple categories
✅ Hotel details by category
✅ Vehicle information
✅ Validity dates
✅ Detailed day-wise itinerary
✅ Long inclusions/exclusions lists
✅ Terms & conditions
✅ Additional notes and honeymoon packages
✅ Proper formatting and spacing

The package details page will now display everything exactly like suvidhatravel.com!
