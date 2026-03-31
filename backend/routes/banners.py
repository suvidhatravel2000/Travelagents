from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models import Banner, BannerCreate
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter(prefix="/api/banners", tags=["banners"])

async def get_db():
    from server import db
    return db

@router.get("/", response_model=List[Banner])
async def get_banners(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get all active banners"""
    banners = await db.banners.find({"active": True}).sort("order", 1).to_list(1000)
    return banners

@router.post("/", response_model=Banner)
async def create_banner(
    banner: BannerCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create a new banner"""
    banner_obj = Banner(**banner.dict())
    await db.banners.insert_one(banner_obj.dict())
    return banner_obj

@router.put("/{banner_id}", response_model=Banner)
async def update_banner(
    banner_id: str,
    banner_update: BannerCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update a banner"""
    from datetime import datetime
    
    existing = await db.banners.find_one({"id": banner_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Banner not found")
    
    update_data = banner_update.dict()
    update_data["updatedAt"] = datetime.utcnow()
    
    await db.banners.update_one(
        {"id": banner_id},
        {"$set": update_data}
    )
    
    updated = await db.banners.find_one({"id": banner_id})
    return updated

@router.delete("/{banner_id}")
async def delete_banner(
    banner_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete a banner"""
    result = await db.banners.delete_one({"id": banner_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Banner not found")
    return {"message": "Banner deleted successfully"}
