# Dynamic Pricing Table - User Guide

## ✅ **FIXED: Unlimited Columns & Rows Support**

The Pricing Table now supports **unlimited columns and rows**, just like the Hotels table!

---

## 🎯 **What Changed:**

### Before (Limited):
- ❌ Fixed 5 columns only: Category, 2 Pax, 4 Pax, 6 Pax, Extra Bed
- ❌ Could not add more columns
- ❌ Paste limited to 5 columns

### After (Dynamic):
- ✅ **Unlimited columns** - Add as many as you need
- ✅ **Custom column names** - "2 Pax", "4 Pax", "8 Pax", "Extra Bed", "Child", etc.
- ✅ **Paste any table size** - 10 columns, 20 rows, anything!
- ✅ **Add/Remove columns** individually per row

---

## 📖 **How to Use:**

### Method 1: Smart Paste (Recommended)

1. **Click "Pricing" tab** in package editor
2. **Click "📋 Smart Paste" button**
3. **Paste your pricing table** from suvidhatravel.com or Excel
4. **Click "Parse & Apply"**
5. ✅ **All columns and rows** will be parsed automatically!

**Example paste:**
```
Standard         Rs 15,000   Rs 12,000   Rs 10,000   Rs 2,500
Deluxe          Rs 20,000   Rs 17,000   Rs 15,000   Rs 3,000
Premium         Rs 25,000   Rs 22,000   Rs 20,000   Rs 3,500
```

This will create 3 rows with 4 columns each (automatically detected).

---

### Method 2: Manual Entry

1. **Click "Add Row"** button
2. **Enter Category** name (e.g., "Standard")
3. **Click "Add Pricing Column"** button
4. **Enter column name** when prompted (e.g., "2 Pax")
5. **Enter the price/value** in the field
6. **Repeat** to add more columns

**To remove a column:**
- Click the **×** button next to any column

---

## 🔧 **Technical Changes:**

### Data Structure (Before):
```javascript
{
  category: "Standard",
  price2Pax: 15000,
  price4Pax: 12000,
  price6Pax: 10000,
  extraBed: 2500
}
```

### Data Structure (After):
```javascript
{
  category: "Standard",
  columns: {
    "2 Pax": "Rs 15,000",
    "4 Pax": "Rs 12,000",
    "6 Pax": "Rs 10,000",
    "8 Pax": "Rs 8,500",    // NEW: Can add unlimited
    "Extra Bed": "Rs 2,500",
    "Child": "Rs 1,500"     // NEW: Custom columns
  }
}
```

---

## ✨ **Features:**

| Feature | Status |
|---------|--------|
| Unlimited Rows | ✅ Yes |
| Unlimited Columns | ✅ Yes |
| Custom Column Names | ✅ Yes |
| Smart Paste Detection | ✅ Yes |
| Add/Remove Columns | ✅ Yes |
| Legacy Support | ✅ Yes (old 5-column format still works) |

---

## 💡 **Pro Tips:**

1. **Use Smart Paste** for fastest data entry
2. **Column names can be anything** - "Twin Sharing", "Per Person", "Group Rate", etc.
3. **Each row can have different columns** if needed
4. **Old packages with fixed columns** will still work (backward compatible)

---

## 🐛 **Troubleshooting:**

**Q: Pasted data shows only 5 columns?**
A: Make sure you're using the updated code. The Smart Paste parser should now detect all columns.

**Q: Can I mix old and new formats?**
A: Yes! Old packages with fixed columns (price2Pax, etc.) will still display correctly.

**Q: How do I rename a column?**
A: Remove the old column and add a new one with the desired name.

---

## 📝 **Example Use Cases:**

### Standard Pricing Table:
```
Category    | 2 Pax      | 4 Pax      | 6 Pax      | Extra Bed
Standard    | Rs 15,000  | Rs 12,000  | Rs 10,000  | Rs 2,500
Deluxe      | Rs 20,000  | Rs 17,000  | Rs 15,000  | Rs 3,000
```

### Extended Pricing Table (10+ columns):
```
Category | 2Pax | 4Pax | 6Pax | 8Pax | 10Pax | Child | Infant | Single | Twin | Group
Standard | 15000| 12000| 10000| 9000 | 8000  | 5000  | 2000   | 18000  | 8500 | 7500
Deluxe   | 20000| 17000| 15000| 14000| 13000 | 6500  | 2500   | 23000  | 10000| 9500
```

✅ **Both work perfectly now!**

---

**Updated:** April 1, 2026
**Status:** ✅ FIXED & TESTED
