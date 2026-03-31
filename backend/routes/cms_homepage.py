from fastapi import APIRouter, HTTPException, Depends
from models_cms import HomePageSettings, SectionVisibility
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter(prefix="/api/cms/homepage", tags=["cms-homepage"])

async def get_db():
    from server import db
    return db

@router.get("/", response_model=HomePageSettings)
async def get_homepage_settings(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get homepage settings"""
    settings = await db.homepage_settings.find_one()
    if not settings:
        default = HomePageSettings()
        await db.homepage_settings.insert_one(default.dict())
        return default
    return settings

@router.put("/", response_model=HomePageSettings)
async def update_homepage_settings(
    settings_update: HomePageSettings,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update homepage settings"""
    from datetime import datetime
    
    existing = await db.homepage_settings.find_one()
    if not existing:
        await db.homepage_settings.insert_one(settings_update.dict())
        return settings_update
    
    update_data = settings_update.dict()
    update_data["updatedAt"] = datetime.utcnow()
    
    await db.homepage_settings.update_one(
        {"id": existing["id"]},
        {"$set": update_data}
    )
    
    updated = await db.homepage_settings.find_one({"id": existing["id"]})
    return updated

@router.put("/visibility", response_model=HomePageSettings)
async def update_section_visibility(
    visibility: SectionVisibility,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update section visibility"""
    from datetime import datetime
    
    existing = await db.homepage_settings.find_one()
    if not existing:
        settings = HomePageSettings(visibility=visibility)
        await db.homepage_settings.insert_one(settings.dict())
        return settings
    
    await db.homepage_settings.update_one(
        {"id": existing["id"]},
        {"$set": {"visibility": visibility.dict(), "updatedAt": datetime.utcnow()}}
    )
    
    updated = await db.homepage_settings.find_one({"id": existing["id"]})
    return updated
