from fastapi import APIRouter, HTTPException, Depends
from models_cms import TopBar, TopBarBase
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter(prefix="/api/cms/topbar", tags=["cms-topbar"])

async def get_db():
    from server import db
    return db

@router.get("/", response_model=TopBar)
async def get_topbar(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get top bar settings"""
    topbar = await db.topbar.find_one()
    if not topbar:
        # Return default if not exists
        default = TopBar(
            text="Contact No: +91 8585997177 | +91-9911061103  |  Email: info@suvidhatravel.com",
            backgroundColor="#ea580c",
            textColor="#ffffff",
            visible=True
        )
        await db.topbar.insert_one(default.dict())
        return default
    return topbar

@router.put("/", response_model=TopBar)
async def update_topbar(
    topbar_update: TopBarBase,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update top bar settings"""
    from datetime import datetime
    
    existing = await db.topbar.find_one()
    if not existing:
        topbar_obj = TopBar(**topbar_update.dict())
        await db.topbar.insert_one(topbar_obj.dict())
        return topbar_obj
    
    update_data = topbar_update.dict()
    update_data["updatedAt"] = datetime.utcnow()
    
    await db.topbar.update_one(
        {"id": existing["id"]},
        {"$set": update_data}
    )
    
    updated = await db.topbar.find_one({"id": existing["id"]})
    return updated
