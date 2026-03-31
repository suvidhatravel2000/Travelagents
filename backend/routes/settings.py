from fastapi import APIRouter, HTTPException, Depends
from models import Settings, SettingsCreate
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter(prefix="/api/settings", tags=["settings"])

async def get_db():
    from server import db
    return db

@router.get("/", response_model=Settings)
async def get_settings(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get company settings"""
    settings = await db.settings.find_one()
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    return settings

@router.put("/", response_model=Settings)
async def update_settings(
    settings_update: SettingsCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update company settings"""
    from datetime import datetime
    
    existing = await db.settings.find_one()
    if not existing:
        # Create if doesn't exist
        settings_obj = Settings(**settings_update.dict())
        await db.settings.insert_one(settings_obj.dict())
        return settings_obj
    
    update_data = settings_update.dict()
    update_data["updatedAt"] = datetime.utcnow()
    
    await db.settings.update_one(
        {"id": existing["id"]},
        {"$set": update_data}
    )
    
    updated = await db.settings.find_one({"id": existing["id"]})
    return updated
