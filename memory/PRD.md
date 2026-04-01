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
- Package Details page (SEO meta tags)
- **Blog listing page** (API-driven, featured posts, category filter, search)
- **Blog detail page** (`/blog/:slug`, markdown rendering, SEO meta tags)
- Admin Login & Dashboard

### CMS Admin Panel
- **Top Bar Editor** — Edit announcement bar text/links
- **Hero Banners Editor** — Drag & drop, images, pricing, features, Media Gallery, advanced styling
- **Packages Manager** — Bulk import, smart paste, dynamic pricing/hotels/itineraries, Media Gallery, SEO tab
- **Destinations Editor** — Manage destination tabs
- **Trending Packages Editor** — Select featured packages
- **Footer Editor** — Edit footer content
- **Section Visibility Control** — Toggle homepage sections
- **India Holiday Page Editor** — Banner with Media Gallery, tabs, header dropdown, SEO
- **International Holiday Page Editor** — Same as India
- **Media Gallery** — Upload, display, select, delete images
- **Blog Manager** — Full CRUD with:
  - Rich text editor with markdown toolbar (Bold, Italic, Headings, Lists, Quotes, Code, Links)
  - Media Gallery integration for featured images
  - Categories and Tags management
  - Featured post toggle
  - Publish/Draft status control
  - SEO fields with live score widget
  - Search, filter by status/category
  - Delete with confirmation modal
  - Stats bar (Total, Published, Drafts)

### SEO Features
- Reusable SEO Score Widget with live score ring, Google preview, suggestions
- Integrated in: Packages, India Holidays, International Holidays, Blog
- Public pages output dynamic meta tags via react-helmet-async

## Completed Tasks (Latest First)
- [Feb 2026] Full Blog CMS: backend model/routes, admin manager with rich editor, public blog listing + detail page
- [Feb 2026] Made Banner fields editable: Description, Price, Duration, Features/Tags
- [Feb 2026] SEO fields + live score widget for Packages, India/International Holidays
- [Feb 2026] Integrated Media Gallery "Select" into Packages & all Banner editors
- [Feb 2026] Fixed Media Gallery image loading, built new simplified gallery
- [Feb 2026] Dynamic admin control for Header Dropdowns

## Backlog
- **P1**: Refactor `EnhancedPackageModal.jsx` (>1300 lines) into smaller sub-components
- **P2**: Media Gallery lazy loading / pagination

## Key API Endpoints
- Blog: GET/POST `/api/blog/`, GET/PUT/DELETE `/api/blog/{id}`, GET `/api/blog/categories`
- Packages: GET/POST `/api/packages/`, GET/PUT/DELETE `/api/packages/{id}`
- Banners: GET/POST/PUT/DELETE `/api/banners/`
- Pages: GET/PUT `/api/pages/{pageType}`
- Media: POST `/api/media/upload`, GET `/api/media/`, DELETE `/api/media/{id}`

## Admin Credentials
- Username: `admin`
- Password: `admin123`
