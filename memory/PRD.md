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

## What's Been Implemented

### Frontend Pages
- Homepage with hero banners, destination tabs, trending packages
- India Holidays page (dynamic, CMS-controlled, SEO meta tags)
- International Holidays page (dynamic, CMS-controlled, SEO meta tags)
- Package Details page (SEO meta tags, properly aligned Download button and tables)
- Blog listing page (API-driven, featured posts, category filter, search)
- Blog detail page (`/blog/:slug`, markdown rendering, SEO meta tags)
- Admin Login & Dashboard

### CMS Admin Panel
- Hero Banners Editor (drag & drop, images, pricing, features, Media Gallery, styling)
- Packages Manager (bulk import, pricing/hotels/itineraries, Media Gallery, SEO tab)
- Destinations Editor, Trending Packages, Footer, Section Visibility
- India & International Holiday Page Editors (banner, tabs, dropdown, SEO)
- Media Gallery (upload, display, select, delete)
- Blog Manager (full CRUD, rich text, categories, tags, featured, SEO)

### UI Fixes Applied
- Removed "Made with Emergent" badge from all pages
- Download Details button properly aligned inside main content area
- Pricing and Hotel tables properly aligned with reduced padding (no cut-off)

## Completed Tasks (Latest First)
- [Feb 2026] UI fixes: Badge removal, Download button alignment, table padding
- [Feb 2026] Full Blog CMS with rich text editor, categories, tags, SEO
- [Feb 2026] Made Banner fields editable: Description, Price, Duration, Features
- [Feb 2026] SEO fields + live score widget for Packages, Holidays, Blog
- [Feb 2026] Integrated Media Gallery "Select" into all editors
- [Feb 2026] Fixed Media Gallery image loading, built simplified gallery
- [Feb 2026] Dynamic admin control for Header Dropdowns

## Backlog
- **P1**: Refactor `EnhancedPackageModal.jsx` (>1300 lines) into smaller sub-components
- **P2**: Media Gallery lazy loading / pagination

## Admin Credentials
- Username: `admin`
- Password: `admin123`
