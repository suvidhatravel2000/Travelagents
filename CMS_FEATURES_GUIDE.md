# 🎨 Advanced CMS Features - User Guide

## Overview
The CMS Admin Panel now includes all advanced features for complete control over your website's content and appearance.

---

## 🎯 New Features Implemented

### 1. **Destination Tabs Editor** (Drag & Drop)
**Location:** Admin Panel → Destination Tabs

**Features:**
- ✅ **Drag & Drop Reordering** - Change tab order by dragging
- ✅ **Add/Remove Destinations** - Unlimited destination tabs
- ✅ **Icon Support** - Use emojis or Unicode icons (🏔️, 🏖️, 🏙️)
- ✅ **Trending Toggle** - Mark destinations as trending (🔥 icon)
- ✅ **Visibility Control** - Show/hide destinations without deleting
- ✅ **Real-time Preview** - Changes reflect immediately on homepage

**How to Use:**
1. Go to CMS Panel → **Destination Tabs**
2. Drag tabs up/down to reorder
3. Click **Add Destination** to create new tab
4. Edit name and icon inline
5. Toggle 🔥 for trending
6. Toggle eye icon to show/hide
7. Click **Save Order** to persist changes

**Example Data:**
```
Name: Ladakh | Icon: 🏔️ | Trending: Yes | Visible: Yes
Name: Bali | Icon: 🏖️ | Trending: No | Visible: Yes
```

---

### 2. **Hero Banners Editor** (Enhanced)
**Location:** Admin Panel → Banners

**Features:**
- ✅ **Desktop + Mobile Images** - Separate images for different devices
- ✅ **Drag & Drop Reordering** - Change banner display order
- ✅ **Advanced Styling Controls:**
  - Title font size (2xl to 6xl)
  - Title color (White, Black, Yellow, Orange, Blue)
  - Subtitle font size (sm to xl)
  - Subtitle color (White, Gray, Yellow)
  - Text alignment (Left, Center, Right)
  - Custom button text
- ✅ **Visibility Toggle** - Show/hide banners
- ✅ **Add/Remove Banners** - Unlimited hero banners

**How to Use:**
1. Go to CMS Panel → **Banners**
2. Click **Add Banner** to create new
3. Enter title and subtitle
4. Add **Desktop Image URL** (required)
5. Add **Mobile Image URL** (optional - desktop image used if empty)
6. Click **"▶ Show Advanced Styling"** to reveal styling options
7. Customize font size, color, alignment
8. Drag to reorder banners
9. Click **Save All** to persist

**Styling Options:**
- **Title Font Size:** Small (2xl) → 2XL (6xl)
- **Title Color:** White, Black, Yellow, Orange, Blue
- **Subtitle Font Size:** Small → XL
- **Subtitle Color:** White, Light Gray, Dark Gray, Yellow
- **Text Alignment:** Left, Center, Right
- **Button Text:** Custom CTA (e.g., "BOOK NOW", "Learn More")

**Mobile vs Desktop Images:**
- **Desktop:** Shown on screens ≥ 768px
- **Mobile:** Shown on screens < 768px
- If mobile image is not provided, desktop image is used

---

### 3. **Trending Packages Editor** (Drag & Drop)
**Location:** Admin Panel → Trending Packages

**Features:**
- ✅ **Manual Sorting** - Drag & drop to control trending order
- ✅ **Add/Remove Packages** - Control which packages are trending
- ✅ **Visual Interface** - See package images, titles, prices
- ✅ **Two-Panel Layout:**
  - Left: Trending packages (sortable)
  - Right: Available packages (add to trending)
- ✅ **Persistent Order** - Saved order reflects on homepage

**How to Use:**
1. Go to CMS Panel → **Trending Packages**
2. **Left Panel:** Trending packages (currently featured)
   - Drag up/down to change display order
   - Click **"Remove"** to remove from trending
3. **Right Panel:** Available packages
   - Click **"Add to Trending"** to feature a package
4. Click **Save Order** to persist changes

**Visual Layout:**
```
┌─────────────────────────────────┬─────────────────────────────────┐
│ Trending Packages (6)           │ Available Packages (12)         │
│ ├─ Package 1 [Remove]           │ ├─ Package 7 [Add to Trending] │
│ ├─ Package 2 [Remove]           │ ├─ Package 8 [Add to Trending] │
│ └─ Package 3 [Remove]           │ └─ Package 9 [Add to Trending] │
└─────────────────────────────────┴─────────────────────────────────┘
```

---

## 📊 Backend Data Structure

### Destination Model
```python
{
  "id": "ladakh",
  "name": "Ladakh",
  "icon": "🏔️",
  "trending": true,
  "visible": true,
  "order": 0
}
```

### Banner Model
```python
{
  "id": "banner-1",
  "title": "THAILAND Summer Special",
  "subtitle": "LIMITED SEATS LEFT",
  "imageDesktop": "https://example.com/desktop.jpg",
  "imageMobile": "https://example.com/mobile.jpg",
  "visible": true,
  "order": 0,
  "titleFontSize": "text-5xl",
  "titleColor": "text-yellow-400",
  "subtitleFontSize": "text-lg",
  "subtitleColor": "text-white",
  "textAlign": "text-left",
  "buttonText": "BOOK NOW"
}
```

### Package Model (Trending)
```python
{
  "id": "pkg-1",
  "title": "Bali Beach Paradise",
  "price": 38999,
  "isTrending": true,
  "trendingOrder": 0
}
```

---

## 🎨 Tailwind CSS Class Reference

### Font Sizes
| Class | Size |
|-------|------|
| `text-sm` | 14px |
| `text-base` | 16px |
| `text-lg` | 18px |
| `text-xl` | 20px |
| `text-2xl` | 24px |
| `text-3xl` | 30px |
| `text-4xl` | 36px |
| `text-5xl` | 48px |
| `text-6xl` | 60px |

### Text Colors
| Class | Color |
|-------|-------|
| `text-white` | #FFFFFF |
| `text-black` | #000000 |
| `text-gray-200` | Light Gray |
| `text-gray-800` | Dark Gray |
| `text-yellow-400` | Yellow |
| `text-orange-500` | Orange |
| `text-blue-600` | Blue |

### Text Alignment
| Class | Alignment |
|-------|-----------|
| `text-left` | Left |
| `text-center` | Center |
| `text-right` | Right |

---

## 🔄 Workflow Examples

### Example 1: Add a New Destination Tab

1. Navigate to **Admin Panel → Destination Tabs**
2. Click **"Add Destination"**
3. Edit the new entry:
   - Name: `Maldives`
   - Icon: `🏝️`
   - Trending: `No`
   - Visible: `Yes`
4. Drag to desired position
5. Click **"Save Order"**
6. Visit homepage to see new tab

### Example 2: Create a Styled Hero Banner

1. Navigate to **Admin Panel → Banners**
2. Click **"Add Banner"**
3. Fill in details:
   - Title: `SUMMER SALE 2026`
   - Subtitle: `Up to 50% Off`
   - Desktop Image: `https://images.unsplash.com/photo-xyz`
   - Mobile Image: `https://images.unsplash.com/photo-abc`
4. Click **"▶ Show Advanced Styling"**
5. Customize:
   - Title Font Size: `text-6xl`
   - Title Color: `text-yellow-400`
   - Text Alignment: `text-center`
   - Button Text: `EXPLORE NOW`
6. Click **"Save All"**

### Example 3: Manually Sort Trending Packages

1. Navigate to **Admin Panel → Trending Packages**
2. In the **left panel** (Trending Packages):
   - Drag "Bali Paradise" to position 1
   - Drag "Thailand Adventure" to position 2
   - Drag "Ladakh Trek" to position 3
3. In the **right panel** (Available Packages):
   - Click **"Add to Trending"** on "Singapore City Tour"
4. Click **"Save Order"**
5. Homepage now shows packages in new order

---

## 🐛 Troubleshooting

### Issue: Destination tabs not showing on homepage

**Solution:**
- Check if destination is marked as **Visible** (eye icon)
- Ensure **Save Order** was clicked after changes
- Refresh homepage cache (Ctrl+F5)

### Issue: Banner desktop/mobile images not switching

**Solution:**
- Check image URLs are valid and accessible
- Ensure both desktop and mobile URLs are provided
- Test on actual mobile device or DevTools responsive mode

### Issue: Trending packages order not updating

**Solution:**
- Ensure **Save Order** button was clicked
- Check that packages have `isTrending: true` in database
- Clear browser cache and reload

### Issue: Drag & drop not working

**Solution:**
- Try clicking and holding for 1 second before dragging
- Ensure JavaScript is enabled
- Try in a different browser (Chrome/Firefox recommended)

---

## 📝 Best Practices

### Destination Tabs
- ✅ Use clear, recognizable icons
- ✅ Keep names short (1-2 words)
- ✅ Limit to 8-12 visible tabs for best UX
- ✅ Mark only 2-3 destinations as trending

### Hero Banners
- ✅ Use high-quality images (min 1920x1080 for desktop)
- ✅ Mobile images should be portrait-oriented (1080x1920)
- ✅ Keep titles short and impactful
- ✅ Limit to 3-5 active banners
- ✅ Test on both desktop and mobile before publishing

### Trending Packages
- ✅ Feature 6-12 packages in trending section
- ✅ Update trending list seasonally
- ✅ Place best-selling packages at top
- ✅ Balance destinations (don't feature only one location)

---

## 🚀 Quick Reference

| Task | Steps |
|------|-------|
| **Reorder Destinations** | Drag & drop → Save Order |
| **Add Desktop/Mobile Banner Images** | Banners → Add Banner → Fill both image fields → Save |
| **Change Banner Text Style** | Banners → Show Advanced Styling → Select options → Save |
| **Feature a Package** | Trending Packages → Add to Trending → Save Order |
| **Change Trending Order** | Trending Packages → Drag in left panel → Save Order |

---

## 📦 Files Created/Modified

### Frontend Components
- `/app/frontend/src/components/admin/DestinationsEditor.jsx` (NEW)
- `/app/frontend/src/components/admin/TrendingPackagesEditor.jsx` (NEW)
- `/app/frontend/src/components/admin/BannersEditor.jsx` (ENHANCED)
- `/app/frontend/src/pages/AdminDashboardCMS.jsx` (UPDATED)

### Backend Models
- `/app/backend/models.py` (UPDATED - added new fields)

### Dependencies
- `@dnd-kit/core` - Drag & drop functionality
- `@dnd-kit/sortable` - Sortable lists
- `@dnd-kit/utilities` - Helper utilities

---

## 🎓 Video Tutorials (Coming Soon)

1. **Setting Up Destination Tabs** (2 mins)
2. **Creating Responsive Hero Banners** (5 mins)
3. **Managing Trending Packages** (3 mins)
4. **Complete CMS Walkthrough** (15 mins)

---

**Need Help?** Check the troubleshooting section or contact support!

**Happy Content Managing! 🎉**
