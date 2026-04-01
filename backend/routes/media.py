from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.responses import JSONResponse
from typing import List, Optional
from models_media import Media, MediaCreate, Folder, FolderCreate
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime
import os
import uuid
from PIL import Image
import io
import base64

router = APIRouter(prefix="/api/media", tags=["media"])

# Dependency to get database
async def get_db():
    from server import db
    return db

# Configuration
UPLOAD_DIR = "/app/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(f"{UPLOAD_DIR}/thumbnails", exist_ok=True)
os.makedirs(f"{UPLOAD_DIR}/medium", exist_ok=True)

def compress_and_resize(image_bytes: bytes, max_size: tuple = (1920, 1080), quality: int = 85):
    """Compress and resize image"""
    img = Image.open(io.BytesIO(image_bytes))
    
    # Convert RGBA to RGB if needed
    if img.mode == 'RGBA':
        img = img.convert('RGB')
    
    # Resize maintaining aspect ratio
    img.thumbnail(max_size, Image.Resampling.LANCZOS)
    
    # Save to bytes
    output = io.BytesIO()
    img.save(output, format='JPEG', quality=quality, optimize=True)
    return output.getvalue(), img.size

def generate_thumbnail(image_bytes: bytes, size: tuple = (300, 300)):
    """Generate thumbnail"""
    img = Image.open(io.BytesIO(image_bytes))
    if img.mode == 'RGBA':
        img = img.convert('RGB')
    img.thumbnail(size, Image.Resampling.LANCZOS)
    output = io.BytesIO()
    img.save(output, format='JPEG', quality=80, optimize=True)
    return output.getvalue()

@router.post("/upload", response_model=Media)
async def upload_media(
    file: UploadFile = File(...),
    folder: str = Form("uncategorized"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Upload a single image with auto-compression and thumbnail generation"""
    
    # Validate file type
    if not file.content_type.startswith('image/'):
        raise HTTPException(status_code=400, detail="Only image files are allowed")
    
    allowed_types = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
    if file.content_type not in allowed_types:
        raise HTTPException(status_code=400, detail="Unsupported image format. Use JPG, PNG, or WEBP")
    
    try:
        # Read file
        contents = await file.read()
        
        # Generate unique filename
        file_id = str(uuid.uuid4())
        ext = file.filename.split('.')[-1] if '.' in file.filename else 'jpg'
        filename = f"{file_id}.{ext}"
        
        # Compress and resize full image
        full_image, dimensions = compress_and_resize(contents, max_size=(1920, 1080), quality=85)
        full_path = os.path.join(UPLOAD_DIR, filename)
        with open(full_path, 'wb') as f:
            f.write(full_image)
        
        # Generate medium size
        medium_image, _ = compress_and_resize(contents, max_size=(800, 600), quality=80)
        medium_filename = f"medium_{filename}"
        medium_path = os.path.join(UPLOAD_DIR, "medium", medium_filename)
        with open(medium_path, 'wb') as f:
            f.write(medium_image)
        
        # Generate thumbnail
        thumbnail_image = generate_thumbnail(contents, size=(300, 300))
        thumb_filename = f"thumb_{filename}"
        thumb_path = os.path.join(UPLOAD_DIR, "thumbnails", thumb_filename)
        with open(thumb_path, 'wb') as f:
            f.write(thumbnail_image)
        
        # Create media document
        media_data = {
            "id": file_id,
            "filename": filename,
            "originalName": file.filename,
            "folder": folder,
            "url": f"/uploads/{filename}",
            "thumbnailUrl": f"/uploads/thumbnails/{thumb_filename}",
            "mediumUrl": f"/uploads/medium/{medium_filename}",
            "fileSize": len(full_image),
            "mimeType": file.content_type,
            "width": dimensions[0],
            "height": dimensions[1],
            "linkedTo": [],
            "tags": [],
            "uploadedAt": datetime.utcnow(),
            "updatedAt": datetime.utcnow(),
            "uploadedBy": "admin"
        }
        
        await db.media.insert_one(media_data)
        
        # Update folder image count
        await db.media_folders.update_one(
            {"id": folder},
            {"$inc": {"imageCount": 1}},
            upsert=True
        )
        
        return Media(**media_data)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.post("/upload-bulk", response_model=List[Media])
async def upload_bulk_media(
    files: List[UploadFile] = File(...),
    folder: str = Form("uncategorized"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Upload multiple images"""
    uploaded_media = []
    
    for file in files:
        try:
            media = await upload_media(file, folder, db)
            uploaded_media.append(media)
        except Exception as e:
            print(f"Failed to upload {file.filename}: {e}")
            continue
    
    return uploaded_media

@router.get("/", response_model=List[Media])
async def get_media(
    folder: Optional[str] = None,
    search: Optional[str] = None,
    sort: str = "latest",
    limit: int = 50,
    skip: int = 0,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get all media with optional filters"""
    query = {}
    
    if folder:
        query["folder"] = folder
    
    if search:
        query["$or"] = [
            {"originalName": {"$regex": search, "$options": "i"}},
            {"filename": {"$regex": search, "$options": "i"}},
            {"tags": {"$in": [search]}}
        ]
    
    sort_order = -1 if sort == "latest" else 1
    
    media_list = await db.media.find(query, {"_id": 0}) \
        .sort("uploadedAt", sort_order) \
        .skip(skip) \
        .limit(limit) \
        .to_list(limit)
    
    return media_list

@router.get("/{media_id}", response_model=Media)
async def get_media_by_id(
    media_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get single media by ID"""
    media = await db.media.find_one({"id": media_id}, {"_id": 0})
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    return media

@router.put("/{media_id}", response_model=Media)
async def update_media(
    media_id: str,
    originalName: Optional[str] = None,
    folder: Optional[str] = None,
    tags: Optional[List[str]] = None,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update media metadata"""
    media = await db.media.find_one({"id": media_id}, {"_id": 0})
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    update_data = {"updatedAt": datetime.utcnow()}
    
    if originalName:
        update_data["originalName"] = originalName
    if folder:
        # Update folder count
        old_folder = media.get("folder", "uncategorized")
        if old_folder != folder:
            await db.media_folders.update_one(
                {"id": old_folder},
                {"$inc": {"imageCount": -1}}
            )
            await db.media_folders.update_one(
                {"id": folder},
                {"$inc": {"imageCount": 1}},
                upsert=True
            )
        update_data["folder"] = folder
    if tags is not None:
        update_data["tags"] = tags
    
    await db.media.update_one(
        {"id": media_id},
        {"$set": update_data}
    )
    
    updated = await db.media.find_one({"id": media_id}, {"_id": 0})
    return updated

@router.delete("/{media_id}")
async def delete_media(
    media_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete media and its files"""
    media = await db.media.find_one({"id": media_id}, {"_id": 0})
    if not media:
        raise HTTPException(status_code=404, detail="Media not found")
    
    # Delete files
    try:
        if os.path.exists(f"{UPLOAD_DIR}/{media['filename']}"):
            os.remove(f"{UPLOAD_DIR}/{media['filename']}")
        if media.get('thumbnailUrl'):
            thumb_file = media['thumbnailUrl'].split('/')[-1]
            if os.path.exists(f"{UPLOAD_DIR}/thumbnails/{thumb_file}"):
                os.remove(f"{UPLOAD_DIR}/thumbnails/{thumb_file}")
        if media.get('mediumUrl'):
            medium_file = media['mediumUrl'].split('/')[-1]
            if os.path.exists(f"{UPLOAD_DIR}/medium/{medium_file}"):
                os.remove(f"{UPLOAD_DIR}/medium/{medium_file}")
    except Exception as e:
        print(f"Error deleting files: {e}")
    
    # Update folder count
    await db.media_folders.update_one(
        {"id": media.get("folder", "uncategorized")},
        {"$inc": {"imageCount": -1}}
    )
    
    # Delete from database
    await db.media.delete_one({"id": media_id})
    
    return {"message": "Media deleted successfully"}

# Folder Management
@router.get("/folders/list", response_model=List[Folder])
async def get_folders(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get all folders"""
    folders = await db.media_folders.find({}, {"_id": 0}).to_list(100)
    return folders

@router.post("/folders", response_model=Folder)
async def create_folder(
    folder: FolderCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Create a new folder"""
    folder_id = folder.name.lower().replace(' ', '-')
    
    existing = await db.media_folders.find_one({"id": folder_id})
    if existing:
        raise HTTPException(status_code=400, detail="Folder already exists")
    
    folder_data = {
        "id": folder_id,
        **folder.dict(),
        "createdAt": datetime.utcnow(),
        "imageCount": 0
    }
    
    await db.media_folders.insert_one(folder_data)
    return Folder(**folder_data)

@router.delete("/folders/{folder_id}")
async def delete_folder(
    folder_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete a folder (moves images to uncategorized)"""
    # Move all images to uncategorized
    await db.media.update_many(
        {"folder": folder_id},
        {"$set": {"folder": "uncategorized"}}
    )
    
    # Delete folder
    await db.media_folders.delete_one({"id": folder_id})
    
    return {"message": "Folder deleted successfully"}
