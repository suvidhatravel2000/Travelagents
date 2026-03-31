from fastapi import APIRouter, HTTPException, Depends
from typing import List
from models import Destination, DestinationCreate
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter(prefix="/api/destinations", tags=["destinations"])

async def get_db():
    from server import db
    return db

@router.get("/", response_model=List[Destination])
async def get_destinations(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get all destinations"""
    destinations = await db.destinations.find({}, {"_id": 0}).to_list(1000)
    # Sort by order
    destinations.sort(key=lambda x: x.get('order', 0))
    return destinations

@router.get("/{destination_id}", response_model=Destination)
async def get_destination(
    destination_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get a single destination"""
    destination = await db.destinations.find_one({"id": destination_id}, {"_id": 0})
    if not destination:
        raise HTTPException(status_code=404, detail="Destination not found")
    return destination

@router.post("/", response_model=Destination)
async def create_destination(
    destination: DestinationCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create a new destination"""
    destination_obj = Destination(**destination.dict())
    await db.destinations.insert_one(destination_obj.dict())
    return destination_obj

@router.put("/{destination_id}", response_model=Destination)
async def update_destination(
    destination_id: str,
    destination_update: DestinationCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update a destination"""
    from datetime import datetime
    
    existing = await db.destinations.find_one({"id": destination_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Destination not found")
    
    update_data = destination_update.dict()
    update_data["updatedAt"] = datetime.utcnow()
    
    await db.destinations.update_one(
        {"id": destination_id},
        {"$set": update_data}
    )
    
    updated = await db.destinations.find_one({"id": destination_id}, {"_id": 0})
    return updated

@router.delete("/{destination_id}")
async def delete_destination(
    destination_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete a destination"""
    result = await db.destinations.delete_one({"id": destination_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Destination not found")
    return {"message": "Destination deleted successfully"}
