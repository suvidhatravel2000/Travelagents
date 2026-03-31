# Copy-Paste Guide for Manali Volvo Package

## Exact Data Format for Admin Panel

When adding the "Manali Volvo Package - 4 Nights", use this exact structure:

### Basic Information
```
Title: Manali Volvo Package – 4 Nights
Destination: himachal
Category: Himachal
Duration: 4N/5D
Days: 4 Nights in Manali
Price: 6282 (lowest price from table)
Original Price: 7452
Image: https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800
Rating: 4.7
Flights Included: No
Group Tour: No
```

### Overview
```
BELOW RATES ARE PER PERSON NET & NON COMMISSIONABLE

Rates Valid till 01st July 2025 – 30th March 2026 (Not Valid for 20th Dec – 05th Jan 2026 || Any Long Weekend)
```

### Validity Dates
```
Valid till 01st July 2025 – 30th March 2026 (Not Valid for 20th Dec – 05th Jan 2026 || Any Long Weekend)
```

### Vehicle Info
```
For 2-3 Pax: Alto || For 4-6 Pax: Ertiga
```

### Additional Info
```
Honeymoon Supplement cost: (Flower Bed Decoration + Cake + Milk once during the stay + One candle light dinner): INR 1500 For Standard, Deluxe| INR 2000 for Deluxe Plus, Super Deluxe | INR 3000 For Superior | INR 3500 For Premium
```

### Pricing Table
**Copy this as JSON:**
```json
[
  {
    "category": "Standard",
    "price2Pax": 7452,
    "price4Pax": 7047,
    "price6Pax": 6282,
    "extraBed": 5700
  },
  {
    "category": "Deluxe",
    "price2Pax": 8748,
    "price4Pax": 8343,
    "price6Pax": 7578,
    "extraBed": 6500
  },
  {
    "category": "Deluxe Plus",
    "price2Pax": 9612,
    "price4Pax": 9207,
    "price6Pax": 8442,
    "extraBed": 7800
  },
  {
    "category": "Super Deluxe",
    "price2Pax": 11340,
    "price4Pax": 10935,
    "price6Pax": 10170,
    "extraBed": 8200
  },
  {
    "category": "Superior",
    "price2Pax": 12420,
    "price4Pax": 12015,
    "price6Pax": 11250,
    "extraBed": 9400
  },
  {
    "category": "Premium",
    "price2Pax": 15660,
    "price4Pax": 15255,
    "price6Pax": 14490,
    "extraBed": 11000
  }
]
```

### Hotel Details
**Copy this as JSON:**
```json
[
  {
    "category": "Standard",
    "hotelName": "Hotel President ( Deluxe )"
  },
  {
    "category": "Deluxe",
    "hotelName": "Hotel Park Paradise ( Luxury Room with Balcony ) // Hotel Lotus Inn Rohtang View( Deluxe Balcony ) // The Avenue ( Deluxe Balcony"
  },
  {
    "category": "Deluxe Plus",
    "hotelName": "Surya Inn & Suites ( Deluxe Balcony ) // Rio Soul Resort ( Deluxe Balcony // Pristine Inn ( Deluxe Balcony )"
  },
  {
    "category": "Super Deluxe",
    "hotelName": "Royal Park Resort ( Luxury Room with Balcony ) or Similar"
  },
  {
    "category": "Superior",
    "hotelName": "White Stone Suite Inn( Super Deluxe Balcony ) // Mrp Eco eden Resort ( Super Deluxe Balcony )"
  },
  {
    "category": "Premium",
    "hotelName": "Whitestone Resort ( Glacier Room with Balcony )"
  }
]
```

### Itinerary
**Copy this as JSON:**
```json
[
  {
    "day": 1,
    "title": "Delhi – Manali",
    "description": "Evening board the Volvo from Delhi ISBT (Kashmiri Gate) and proceed towards Manali. Overnight Journey."
  },
  {
    "day": 2,
    "title": "Manali Arrival (Local Sightseeing)",
    "description": "Early morning Arrival in Manali (Around 08 Am ) Check in to the Hotel. After Relax in hotel start Manali local Sightseeing where you will cover Hadimba Devi temple, Vashist bath, Tibetan Monestry and Van Vihar. Evening Free to explore manali Mall Road and nearby places. Overnight stay at Manali."
  },
  {
    "day": 3,
    "title": "Kullu/Naggar (One Full Day Kullu/Naggar Sightseeing)",
    "description": "After having delicious breakfast Checkout from hotel and proceed for Kullu/Naggar sightseeing where you will visit Kullu Shawl Factory, Vaishno Devi Temple, Bijli Mahadev Temple (Trekking Required) // Naggar Castle and Jana Waterfalls (Trek Required). Evening back to hotel and overnight stay."
  },
  {
    "day": 4,
    "title": "Manali – Kasol/Manikaran – Manali",
    "description": "After Morning Breakfast checkout from hotel and proceed for Kasol/Manikaran Excursion. Enjoy the scenic beauty of the Parvati valley. After Visit back to Manali. Evening free to explore Mall road shopping. Overnight Stay in Manali."
  },
  {
    "day": 5,
    "title": "Manali – Solang Valley – Delhi",
    "description": "Early Morning after breakfast checkout from hotel and proceed for Solang Valley where you can enjoy the adventure sports like zorbing, paragliding (At own cost). In the evening Board Manali-Delhi Volvo. Overnight Journey."
  },
  {
    "day": 6,
    "title": "Delhi Arrival",
    "description": "Morning arrival in Delhi with Sweet memories."
  }
]
```

### Package Includes
**Copy this as JSON:**
```json
[
  "2 tickets for Delhi – Manali –Delhi Transfer by Volvo",
  "04 Nights & 05 Days Stay In Respective Room",
  "Welcome Drink (Non Alcoholic) On Arrival",
  "Morning Tea",
  "04 Breakfast and 04 Dinner",
  "Complimentary Use of Hotel Recreational Facility",
  "One Full day sightseeing of Kullu / Naggar on Private basis ( Alto or Similar )",
  "One Full day sightseeing of Kasol manikaran on Private basis ( Alto or Similar )",
  "One Full day sightseeing of Solang Valley on Private basis ( Alto or Similar )",
  "One Half day local sightseeing of Manali on Private basis ( Alto or Similar )",
  "Pick up & Drop From Manali volvo bus stand on Private basis ( Alto or Similar )",
  "Driver Allowances, Toll/Parking, Fuel Charges And Permit Charges",
  "Other Package Inclusion as per the Hotel",
  "All hotel taxes Included"
]
```

### Package Does Not Include
**Copy this as JSON:**
```json
[
  "Any Kind of Personal Expenses or Optional Tours / Extra Meals Ordered",
  "Lunch",
  "Manikaran taxi cost is not includes",
  "Any adventure activity Paragliding /Snow Skating /Horse riding/ River crossing Rafting etc",
  "Anything not mentioned in the inclusions",
  "Any increase in taxes or fuel, leading to an increase in surface transport"
]
```

### Terms & Conditions
**Copy this as JSON:**
```json
[
  "Room Heater Charges Extra",
  "In Vehicle, A/c will not work on Hills",
  "Rohtang Pass is Closed on Tuesday"
]
```

## How to Add in Admin Panel

1. Login to `/admin/cms`
2. Go to "Packages" → "Add Package"
3. Fill basic fields (title, destination, etc.)
4. For JSON fields, you'll need to edit the package via API or database directly
5. Or use the old dashboard at `/admin/dashboard` which has form fields

## Quick Database Insert (via MongoDB)

If you want to insert directly:

```javascript
{
  "id": "manali-volvo-4n",
  "title": "Manali Volvo Package – 4 Nights",
  "destination": "himachal",
  "category": "Himachal",
  "image": "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800",
  "rating": 4.7,
  "duration": "4N/5D",
  "days": "4 Nights in Manali",
  "price": 6282,
  "originalPrice": 7452,
  "savings": 1170,
  "flightsIncluded": false,
  "groupTour": false,
  "overview": "BELOW RATES ARE PER PERSON NET & NON COMMISSIONABLE\n\nRates Valid till 01st July 2025 – 30th March 2026 (Not Valid for 20th Dec – 05th Jan 2026 || Any Long Weekend)",
  "validityDates": "Valid till 01st July 2025 – 30th March 2026 (Not Valid for 20th Dec – 05th Jan 2026 || Any Long Weekend)",
  "vehicleInfo": "For 2-3 Pax: Alto || For 4-6 Pax: Ertiga",
  "additionalInfo": "Honeymoon Supplement cost: (Flower Bed Decoration + Cake + Milk once during the stay + One candle light dinner): INR 1500 For Standard, Deluxe| INR 2000 for Deluxe Plus, Super Deluxe | INR 3000 For Superior | INR 3500 For Premium",
  "pricingTable": [/* paste from above */],
  "hotelDetails": [/* paste from above */],
  "itinerary": [/* paste from above */],
  "inclusions": [/* paste from above */],
  "exclusions": [/* paste from above */],
  "termsConditions": [/* paste from above */]
}
```

Now your package will display EXACTLY like suvidhatravel.com! 🎉
