# Suvidha Travel - Product Requirements Document

## Original Problem Statement
Build a pixel-perfect clone of `https://www.viacation.com/` with an Admin Dashboard to manage all content from the backend. The brand name should be "Suvidha Travel".

## Core Requirements
1. Pixel-perfect frontend UI matching the original site
2. Comprehensive CMS Admin Panel (Drag & Drop sorting, granular styling)
3. Complex package creation with dynamic pricing tables, dynamic multi-column hotel tables, day-wise itineraries
4. Centralized Media Gallery to manage, upload, and reuse images
5. Dynamic "India Holidays" and "International Holidays" pages with full CMS control

## Tech Stack
- **Frontend**: React, Tailwind CSS
- **Backend**: FastAPI, Motor (AsyncIO MongoDB)
- **Database**: MongoDB
- **Architecture**: Kubernetes Ingress routing (all backend endpoints use `/api` prefix)

## What's Been Implemented

### Frontend Pages
- Homepage with hero banners, destination tabs, trending packages
- India Holidays page (dynamic, CMS-controlled)
- International Holidays page (dynamic, CMS-controlled)
- Package Details page
- Admin Login & Dashboard

### CMS Admin Panel
- **Top Bar Editor** — Edit announcement bar text/links
- **Hero Banners Editor** — Drag & drop reorder, desktop/mobile images, advanced styling, **Media Gallery integration**
- **Packages Manager** — Bulk import, smart paste, dynamic pricing tables, hotel details, itineraries, inclusions/exclusions/terms, **Media Gallery integration**
- **Destinations Editor** — Manage destination tabs
- **Trending Packages Editor** — Select featured packages
- **Footer Editor** — Edit footer content
- **Section Visibility Control** — Toggle homepage sections
- **India Holiday Page Editor** — Banner config with **Media Gallery integration**, tabs, header dropdown, search, trending
- **International Holiday Page Editor** — Same as India, with **Media Gallery integration**
- **Media Gallery** — Upload, display, select, delete images. Serves via `/api/uploads/` for K8s compatibility

### Key Features
- Header dropdown menus dynamically controlled from admin
- Media Gallery "Select" functionality integrated into: Packages (Image URL), Hero Banners (Desktop & Mobile), India Holidays banners, International Holidays banners
- Static file serving via `/api/uploads/{file_path:path}` for Kubernetes ingress

## Completed Tasks (Latest First)
- [Feb 2026] Integrated Media Gallery "Select" into Packages & all Banner editors (P0 — STEP 4 complete)
- [Feb 2026] Fixed Media Gallery image loading (gray boxes → working images via `/api/uploads/`)
- [Feb 2026] Built new simplified Media Gallery (upload, display, select, delete)
- [Feb 2026] Removed old complex Media Gallery system entirely
- [Feb 2026] Dynamic admin control for Header Dropdowns

## Backlog
- **P1**: Refactor `EnhancedPackageModal.jsx` (>1200 lines) into smaller sub-components
- **P2**: Media Gallery lazy loading / pagination

## Architecture Notes
- All backend routes prefixed with `/api` (K8s ingress requirement)
- Static images stored at `/api/uploads/` path (CRITICAL: do not revert)
- Media Gallery URLs stored as `/api/uploads/filename.jpg` in DB, displayed with `${BACKEND_URL}${image.url}`

## Admin Credentials
- Username: `admin`
- Password: `admin123`
