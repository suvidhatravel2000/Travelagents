# Suvidha Travel - Product Requirements Document

## Original Problem Statement
Build a pixel-perfect clone of `https://www.viacation.com/` with an Admin Dashboard to manage all content from the backend. The brand name should be "Suvidha Travel".

## Core Requirements
1. Pixel-perfect frontend UI matching the original site
2. Comprehensive CMS Admin Panel (Drag & Drop sorting, granular styling)
3. Complex package creation with dynamic pricing tables, dynamic multi-column hotel tables, day-wise itineraries
4. Centralized Media Gallery to manage, upload, and reuse images
5. Dynamic "India Holidays" and "International Holidays" pages with full CMS control
6. SEO fields with real-time scoring for Packages and Holiday Pages

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
- Package Details page (SEO meta tags)
- Admin Login & Dashboard

### CMS Admin Panel
- **Top Bar Editor** — Edit announcement bar text/links
- **Hero Banners Editor** — Drag & drop reorder, desktop/mobile images, advanced styling, Media Gallery integration
- **Packages Manager** — Bulk import, smart paste, dynamic pricing/hotels/itineraries, Media Gallery integration, **SEO tab with live score**
- **Destinations Editor** — Manage destination tabs
- **Trending Packages Editor** — Select featured packages
- **Footer Editor** — Edit footer content
- **Section Visibility Control** — Toggle homepage sections
- **India Holiday Page Editor** — Banner config with Media Gallery, tabs, header dropdown, search, trending, **SEO section with live score**
- **International Holiday Page Editor** — Same as India, with **SEO section with live score**
- **Media Gallery** — Upload, display, select, delete images

### SEO Features (NEW)
- **SEO Score Widget** (`SeoScoreWidget.jsx`) — Reusable component across all admin editors
  - Real-time SEO score (0-100%) with animated ring indicator
  - Color-coded: Red (<40%), Orange (40-70%), Green (>70%)
  - Focus Keyword, SEO Title (with 0/60 char counter), Meta Description (with 0/160 char counter)
  - Live Google Search Preview
  - Actionable suggestions with checkmarks/warnings
- **Score Calculation**: +20 title 50-60 chars, +20 desc 140-160 chars, +20 keyword in title, +20 keyword in desc, +20 keyword in content
- **Public Pages**: Dynamic `<title>`, `<meta name="description">`, `<meta name="keywords">` via react-helmet-async

## Completed Tasks (Latest First)
- [Feb 2026] SEO fields + live score widget added to Packages, India Holidays, International Holidays (admin + public meta tags)
- [Feb 2026] Integrated Media Gallery "Select" into Packages & all Banner editors
- [Feb 2026] Fixed Media Gallery image loading (gray boxes → working via `/api/uploads/`)
- [Feb 2026] Built new simplified Media Gallery system
- [Feb 2026] Dynamic admin control for Header Dropdowns

## Backlog
- **P1**: Refactor `EnhancedPackageModal.jsx` (>1300 lines) into smaller sub-components
- **P2**: Media Gallery lazy loading / pagination

## Architecture Notes
- All backend routes prefixed with `/api` (K8s ingress requirement)
- Static images stored at `/api/uploads/` path (CRITICAL: do not revert)
- SEO fields stored in MongoDB: `seo_title`, `seo_description`, `focus_keyword` on packages and holiday_pages collections
- react-helmet-async wraps entire app via `<HelmetProvider>` in App.js

## Admin Credentials
- Username: `admin`
- Password: `admin123`
