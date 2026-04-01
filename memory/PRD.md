# Suvidha Travel - Product Requirements Document

## Original Problem Statement
Build a pixel-perfect clone of `https://www.viacation.com/` with an Admin Dashboard to manage all content from the backend. The brand name should be "Suvidha Travel".

## Core Requirements
1. Pixel-perfect frontend UI matching the original site
2. Comprehensive CMS Admin Panel (Drag & Drop sorting, granular styling)
3. Complex package creation with dynamic pricing tables, dynamic multi-column hotel tables, day-wise itineraries
4. Centralized Media Gallery to manage, upload, and reuse images
5. Dynamic "India Holidays" and "International Holidays" pages with full CMS control
6. SEO fields with real-time scoring for Packages, Holiday Pages, and Blog
7. Full Blog CMS with Create, Edit, Delete, Rich Text, Categories, Tags, SEO

## Tech Stack
- **Frontend**: React, Tailwind CSS, react-helmet-async
- **Backend**: FastAPI, Motor (AsyncIO MongoDB)
- **Database**: MongoDB
- **Architecture**: Kubernetes Ingress routing (all backend endpoints use `/api` prefix)

## Code Architecture
```
/app/frontend/src/components/admin/
├── EnhancedPackageModal.jsx (271 lines - orchestrator)
├── package-tabs/
│   ├── BulkImportTab.jsx (89 lines)
│   ├── BasicInfoTab.jsx (204 lines)
│   ├── PricingTab.jsx (91 lines)
│   ├── HotelsTab.jsx (90 lines)
│   ├── ItineraryTab.jsx (67 lines)
│   └── ListEditorTab.jsx (70 lines - reused for Includes/Excludes/Terms)
├── BlogManager.jsx
├── BannersEditor.jsx
├── SeoScoreWidget.jsx
├── MediaGallery.jsx
├── IndiaHolidayEditor.jsx
└── InternationalHolidayEditor.jsx
```

## Completed Tasks (Latest First)
- [Feb 2026] Refactored EnhancedPackageModal.jsx: 1324 → 271 lines + 6 sub-components (882 total, -33%)
- [Feb 2026] Removed Download Details, standardized font sizes
- [Feb 2026] UI fixes: Badge removal, table padding
- [Feb 2026] Full Blog CMS with rich text editor, categories, tags, SEO
- [Feb 2026] Made Banner fields editable: Description, Price, Duration, Features
- [Feb 2026] SEO fields + live score widget for Packages, Holidays, Blog
- [Feb 2026] Integrated Media Gallery "Select" into all editors

## Backlog
- **P2**: Media Gallery lazy loading / pagination

## Admin Credentials
- Username: `admin`
- Password: `admin123`
