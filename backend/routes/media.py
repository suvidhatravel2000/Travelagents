from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.responses import JSONResponse
from typing import List
from models_media import MediaItem, MediaItemCreate
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
import os
import uuid
import shutil

router = APIRouter(prefix="/api/media", tags=["media"])

# Dependency to get database
async def get_db():
    from server import db
    return db

# Upload directory configuration
UPLOAD_DIR = "/app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_images(
    files: List[UploadFile] = File(...),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Upload single or multiple images"""
    uploaded_items = []
    
    for file in files:
        # Validate file type
        allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail=f"File type {file.content_type} not allowed. Use JPG, PNG, or WEBP")
        
        # Generate unique filename
        file_ext = file.filename.split('.')[-1]
        unique_filename = f"{int(datetime.utcnow().timestamp() * 1000)}_{uuid.uuid4().hex[:8]}.{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Create URL path (frontend will use REACT_APP_BACKEND_URL)
        file_url = f"/uploads/{unique_filename}"
        
        # Save to database
        media_item = {
            "id": str(uuid.uuid4()),
            "url": file_url,
            "filename": unique_filename,
            "createdAt": datetime.utcnow()
        }
        
        await db.media.insert_one(media_item)
        
        # Remove _id for response
        del media_item['_id']
        uploaded_items.append(media_item)
    
    return {"success": True, "items": uploaded_items}

@router.get("/list")
async def list_media(
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all media items"""
    items = await db.media.find({}, {"_id": 0}).sort("createdAt", -1).to_list(1000)
    return {"items": items}

@router.delete("/{media_id}")
async def delete_media(
    media_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete a media item"""
    # Find the media item
    media = await db.media.find_one({"id": media_id}, {"_id": 0})
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    # Delete file from disk
    filename = media.get('filename')
    if filename:
        file_path = os.path.join(UPLOAD_DIR, filename)
        if os.path.exists(file_path):
            os.remove(file_path)
    
    # Delete from database
    await db.media.delete_one({"id": media_id})
    
    return {"success": True, "message": "Media deleted"}
