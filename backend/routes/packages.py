from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from models import Package, PackageCreate
from motor.motor_asyncio import AsyncIOMotorDatabase
import os

router = APIRouter(prefix="/api/packages", tags=["packages"])

# Dependency to get database
async def get_db():
    from server import db
    return db

@router.get("/", response_model=List[Package])
async def get_packages(
    destination: Optional[str] = None,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all packages with optional destination filter"""
    query = {}
    if destination:
        query["destination"] = destination
    
    packages = await db.packages.find(query).to_list(1000)
    return packages

@router.get("/{package_id}", response_model=Package)
async def get_package(
    package_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get a single package by ID"""
    package = await db.packages.find_one({"id": package_id})
    if not package:
        raise HTTPException(status_code=404, detail="Package not found")
    return package

@router.post("/", response_model=Package)
async def create_package(
    package: PackageCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create a new package"""
    package_obj = Package(**package.dict())
    await db.packages.insert_one(package_obj.dict())
    return package_obj

@router.put("/{package_id}", response_model=Package)
async def update_package(
    package_id: str,
    package_update: PackageCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update an existing package"""
    from datetime import datetime
    
    existing = await db.packages.find_one({"id": package_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Package not found")
    
    update_data = package_update.dict()
    update_data["updatedAt"] = datetime.utcnow()
    
    await db.packages.update_one(
        {"id": package_id},
        {"$set": update_data}
    )
    
    updated_package = await db.packages.find_one({"id": package_id})
    return updated_package

@router.delete("/{package_id}")
async def delete_package(
    package_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete a package"""
    result = await db.packages.delete_one({"id": package_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Package not found")
    return {"message": "Package deleted successfully"}
