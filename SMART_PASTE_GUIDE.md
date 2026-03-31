# 📋 Smart Paste Feature - User Guide

## Overview
The **Smart Paste** feature allows you to quickly add packages by copying content directly from suvidhatravel.com and pasting it into the Admin Dashboard. No more clicking "Add Row" 20 times! 🚀

---

## How to Use

### 1. **Open Admin Dashboard**
- Navigate to: `/admin/dashboard`
- Login with credentials: `admin` / `admin123`
- Click **"Add Package"** button

### 2. **Navigate to Any Tab**
The Smart Paste feature is available in:
- ✅ **Pricing** - For pricing tables
- ✅ **Hotels** - For hotel details
- ✅ **Itinerary** - For day-wise itinerary
- ✅ **Includes** - For package inclusions
- ✅ **Excludes** - For package exclusions
- ✅ **Terms** - For terms & conditions

### 3. **Activate Smart Paste Mode**
- Click the **"📋 Smart Paste"** button (blue button in the top-right)
- A large textarea will appear

### 4. **Paste Your Content**
- Copy content from suvidhatravel.com
- Paste it into the textarea
- The parser supports multiple formats:
  - Plain text from browser (Ctrl+C / Cmd+C)
  - HTML source code
  - JSON format
  - Bullet points, numbered lists, etc.

### 5. **Parse & Import**
- Click **"Parse & Import"** button
- The system will automatically:
  - Detect the format
  - Extract structured data
  - Populate the form fields
- A success message will appear: "✅ Successfully parsed X items!"

### 6. **Review & Save**
- Review the parsed data in manual entry mode
- Make any adjustments if needed
- Click **"Save Package"**

---

## Supported Formats

### 📊 **Pricing Table**
Supports:
- Pipe-separated: `Standard | 7452 | 7047 | 6282 | 5700`
- Tab-separated: `Standard    7452    7047    6282    5700`
- Space-separated: `Standard 7452 7047 6282 5700`

**Example:**
```
Standard | 7452 | 7047 | 6282 | 5700
Deluxe | 8748 | 8343 | 7578 | 6500
Deluxe Plus | 9612 | 9207 | 8442 | 7800
Super Deluxe | 11340 | 10935 | 10170 | 8200
Superior | 12420 | 12015 | 11250 | 9400
Premium | 15660 | 15255 | 14490 | 11000
```

---

### 🏨 **Hotel Details**
Supports:
- Pipe-separated: `Standard | Hotel President ( Deluxe )`
- Colon-separated: `Deluxe: Hotel Park Paradise ( Luxury Room )`

**Example:**
```
Standard | Hotel President ( Deluxe )
Deluxe | Hotel Park Paradise ( Luxury Room with Balcony )
Deluxe Plus | Surya Inn & Suites ( Deluxe Balcony )
Super Deluxe | Royal Park Resort ( Luxury Room with Balcony )
Superior | White Stone Suite Inn ( Super Deluxe Balcony )
Premium | Whitestone Resort ( Glacier Room with Balcony )
```

---

### 📅 **Day-wise Itinerary**
Supports:
- `Day 01: Title` format
- `Day 1 - Title` format
- `**Day 02 : Title**` (with Markdown bold)

The parser automatically extracts:
- Day number
- Day title
- Full description (everything until the next day marker)

**Example:**
```
Day 01: Delhi – Manali
Evening board the Volvo from Delhi ISBT (Kashmiri Gate) and proceed towards Manali. Overnight Journey.

Day 02: Manali Arrival (Local Sightseeing)
Early morning Arrival in Manali (Around 08 Am). Check in to the Hotel. After Relax in hotel start Manali local Sightseeing where you will cover Hadimba Devi temple, Vashist bath, Tibetan Monestry and Van Vihar.

Day 03: Kullu/Naggar (One Full Day Kullu/Naggar Sightseeing)
After having delicious breakfast Checkout from hotel and proceed for Kullu/Naggar sightseeing where you will visit Kullu Shawl Factory, Vaishno Devi Temple, Bijli Mahadev Temple.
```

---

### ✅ **Inclusions / Exclusions / Terms**
Supports:
- Bullet points: `- Item text`
- Numbered lists: `1. Item text`
- Plain lines (one per line)

**Example:**
```
- 2 tickets for Delhi – Manali –Delhi Transfer by Volvo
- 04 Nights & 05 Days Stay In Respective Room
- Welcome Drink (Non Alcoholic) On Arrival
- Morning Tea
- 04 Breakfast and 04 Dinner
- Complimentary Use of Hotel Recreational Facility
- One Full day sightseeing of Kullu / Naggar on Private basis
```

---

## Tips for Best Results

### ✅ **Do's**
- ✅ Copy directly from the source website (suvidhatravel.com)
- ✅ Include all rows/items in a single paste
- ✅ Preserve line breaks between items
- ✅ Keep the original formatting (pipes, bullets, etc.)
- ✅ Review parsed data before saving

### ❌ **Don'ts**
- ❌ Don't manually reformat before pasting
- ❌ Don't remove separators (|, -, :)
- ❌ Don't paste partial data (paste complete sections)
- ❌ Don't forget to click "Parse & Import" after pasting

---

## Troubleshooting

### **Problem: Parser shows "Could not parse the content"**
**Solution:**
- Check if you pasted the correct format
- Ensure line breaks are preserved
- Try copying from the original source again
- Check the example formats above

### **Problem: Some items are missing**
**Solution:**
- Ensure all items are separated by line breaks
- Check for special characters that might break parsing
- Review the textarea content before parsing

### **Problem: Prices are wrong**
**Solution:**
- Ensure all 4 price columns are present (2 Pax, 4 Pax, 6 Pax, Extra Bed)
- Check for extra spaces or characters in numbers
- Manually edit the parsed data if needed

---

## Fallback: Manual Entry

If Smart Paste doesn't work for your content:
1. Click **"Manual Entry"** button to go back
2. Use the traditional **"Add Row" / "Add Hotel" / "Add Day"** buttons
3. Fill in the fields manually

The manual entry option is **always available as a backup**! 💪

---

## Quick Reference

| Section | Smart Paste Support | Manual Entry Support |
|---------|---------------------|---------------------|
| Basic Info | ❌ (Manual only) | ✅ |
| Pricing Table | ✅ | ✅ |
| Hotel Details | ✅ | ✅ |
| Itinerary | ✅ | ✅ |
| Inclusions | ✅ | ✅ |
| Exclusions | ✅ | ✅ |
| Terms & Conditions | ✅ | ✅ |

---

## Video Tutorial (Coming Soon)
We'll add a video tutorial showing the complete workflow from suvidhatravel.com to your database! 🎥

---

## Need Help?
If you encounter any issues with the Smart Paste feature, please:
1. Check this guide first
2. Try manual entry as a fallback
3. Contact support with a screenshot of the content you're trying to paste

---

**Happy Package Creating! 🚀✨**
