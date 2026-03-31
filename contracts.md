# Suvidha Travel - Backend API Contracts

## Overview
This document outlines the API contracts and integration plan for Suvidha Travel platform.

## Database Models

### 1. Package Model
```python
{
    "_id": ObjectId,
    "title": String,
    "destination": String,  # destination ID reference
    "category": String,     # Display name (Thailand, Ladakh, etc.)
    "image": String,        # Image URL
    "rating": Float,
    "duration": String,     # "4N/5D"
    "days": String,         # "2D Pattaya • 3D Bangkok"
    "price": Integer,
    "originalPrice": Integer,
    "savings": Integer,
    "flightsIncluded": Boolean,
    "groupTour": Boolean,
    "itinerary": [
        {
            "day": Integer,
            "title": String,
            "description": String
        }
    ],
    "inclusions": [String],
    "exclusions": [String],
    "overview": String,
    "createdAt": DateTime,
    "updatedAt": DateTime
}
```

### 2. Destination Model
```python
{
    "_id": ObjectId,
    "id": String,          # URL-friendly ID (ladakh, thailand, etc.)
    "name": String,        # Display name
    "icon": String,        # Emoji icon
    "trending": Boolean,
    "createdAt": DateTime,
    "updatedAt": DateTime
}
```

### 3. Banner Model
```python
{
    "_id": ObjectId,
    "destination": String,
    "title": String,
    "subtitle": String,
    "description": String,
    "features": [String],
    "price": Integer,
    "originalPrice": Integer,
    "duration": String,
    "image": String,
    "ctaText": String,
    "active": Boolean,
    "order": Integer,
    "createdAt": DateTime,
    "updatedAt": DateTime
}
```

### 4. Settings Model
```python
{
    "_id": ObjectId,
    "name": String,
    "phones": [String],
    "emails": [String],
    "address": String,
    "website": String,
    "createdAt": DateTime,
    "updatedAt": DateTime
}
```

### 5. Admin Model
```python
{
    "_id": ObjectId,
    "username": String,
    "password": String,  # Hashed
    "email": String,
    "createdAt": DateTime,
    "lastLogin": DateTime
}
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/verify` - Verify session

### Packages
- `GET /api/packages` - Get all packages (with optional filters)
- `GET /api/packages/:id` - Get single package
- `POST /api/packages` - Create package (Admin only)
- `PUT /api/packages/:id` - Update package (Admin only)
- `DELETE /api/packages/:id` - Delete package (Admin only)

### Destinations
- `GET /api/destinations` - Get all destinations
- `GET /api/destinations/:id` - Get packages by destination
- `POST /api/destinations` - Create destination (Admin only)
- `PUT /api/destinations/:id` - Update destination (Admin only)
- `DELETE /api/destinations/:id` - Delete destination (Admin only)

### Banners
- `GET /api/banners` - Get all active banners
- `POST /api/banners` - Create banner (Admin only)
- `PUT /api/banners/:id` - Update banner (Admin only)
- `DELETE /api/banners/:id` - Delete banner (Admin only)

### Settings
- `GET /api/settings` - Get company settings
- `PUT /api/settings` - Update settings (Admin only)

## Mock Data Migration Plan

### Files to Update
1. `/app/frontend/src/mockData.js` - Will be removed after migration
2. Frontend components will be updated to fetch from API endpoints

### Migration Steps
1. ✅ Create backend models and API endpoints
2. ✅ Seed database with mock data
3. ✅ Update frontend to use API calls
4. ✅ Implement admin authentication
5. ✅ Make admin dashboard CRUD functional

## Frontend Integration Points

### Home Page (`/app/frontend/src/pages/Home.jsx`)
- Replace `import { packages, heroBanners }` with API calls
- Fetch packages: `GET /api/packages`
- Fetch banners: `GET /api/banners`

### Package Details (`/app/frontend/src/pages/PackageDetails.jsx`)
- Replace local data with API call
- Fetch package: `GET /api/packages/:id`

### Destination Page (`/app/frontend/src/pages/DestinationPage.jsx`)
- Replace filtered packages with API call
- Fetch by destination: `GET /api/packages?destination=:id`

### Admin Dashboard (`/app/frontend/src/pages/AdminDashboard.jsx`)
- Implement actual CRUD operations
- Add: `POST /api/packages`
- Edit: `PUT /api/packages/:id`
- Delete: `DELETE /api/packages/:id`

### Header & Footer Components
- Fetch settings: `GET /api/settings`
- Display dynamic contact info

## Security Considerations
- Admin routes protected with session/JWT
- Password hashing with bcrypt
- Input validation on all endpoints
- CORS properly configured

## Error Handling
- Consistent error response format
- Frontend error states for failed API calls
- Loading states during API requests
