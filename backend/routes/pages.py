from fastapi import APIRouter, HTTPException, Depends
from typing import Optional
from models_pages import HolidayPageConfig, HolidayPageConfigCreate
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime

router = APIRouter(prefix="/api/pages", tags=["holiday-pages"])

# Dependency to get database
async def get_db():
    from server import db
    return db

@router.get("/{page_type}", response_model=HolidayPageConfig)
async def get_page_config(
    page_type: str,  # "india" or "international"
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get configuration for India or International holiday page"""
    if page_type not in ["india", "international"]:
        raise HTTPException(status_code=400, detail="Invalid page type. Must be 'india' or 'international'")
    
    config = await db.holiday_pages.find_one({"pageType": page_type}, {"_id": 0})
    
    if not config:
        # Return default config if not found
        default_config = {
            "id": str(uuid.uuid4()),
            "pageType": page_type,
            "banner": {
                "desktopImage": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1920",
                "mobileImage": "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=768",
                "title": f"Explore {'India' if page_type == 'india' else 'The World'}",
                "subtitle": f"Discover amazing {'Indian' if page_type == 'india' else 'international'} destinations",
                "buttonText": "Explore Now",
                "buttonLink": "#packages",
                "textAlign": "center",
                "textColor": "#FFFFFF",
                "overlayOpacity": 0.5
            },
            "tabs": [],
            "search": {
                "enabled": True,
                "placeholder": "Search destinations or packages...",
                "searchDestinations": True,
                "searchPackages": True
            },
            "trending": {
                "enabled": True,
                "title": "Trending Packages",
                "subtitle": "Most popular destinations",
                "packageIds": [],
                "displayCount": 6,
                "layout": "grid"
            },
            "visible": True,
            "createdAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow()
        }
        return default_config
    
    return config

@router.put("/{page_type}", response_model=HolidayPageConfig)
async def update_page_config(
    page_type: str,
    config_update: HolidayPageConfigCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update holiday page configuration"""
    if page_type not in ["india", "international"]:
        raise HTTPException(status_code=400, detail="Invalid page type")
    
    import uuid
    existing = await db.holiday_pages.find_one({"pageType": page_type}, {"_id": 0})
    
    if existing:
        # Update existing
        update_data = config_update.dict()
        update_data["updatedAt"] = datetime.utcnow()
        update_data["pageType"] = page_type
        
        await db.holiday_pages.update_one(
            {"pageType": page_type},
            {"$set": update_data}
        )
        
        updated = await db.holiday_pages.find_one({"pageType": page_type}, {"_id": 0})
        return updated
    else:
        # Create new
        new_config = HolidayPageConfig(
            **config_update.dict(),
            pageType=page_type
        )
        
        await db.holiday_pages.insert_one(new_config.dict())
        return new_config

@router.get("/", response_model=list)
async def get_all_page_configs(
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all holiday page configurations"""
    configs = await db.holiday_pages.find({}, {"_id": 0}).to_list(100)
    return configs
