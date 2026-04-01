from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

# Media/Image Models
class MediaBase(BaseModel):
    filename: str
    originalName: str
    folder: str = "uncategorized"  # Banners, Packages, Destinations, Hotels, etc.
    url: str
    thumbnailUrl: Optional[str] = None
    mediumUrl: Optional[str] = None
    fileSize: int
    mimeType: str
    width: Optional[int] = None
    height: Optional[int] = None
    linkedTo: Optional[List[dict]] = []  # [{"type": "package", "id": "pkg-123"}]
    tags: Optional[List[str]] = []

class MediaCreate(MediaBase):
    pass

class Media(MediaBase):
    id: str
    uploadedAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
    uploadedBy: str = "admin"

    class Config:
        from_attributes = True

# Folder Model
class FolderBase(BaseModel):
    name: str
    description: Optional[str] = ""
    icon: Optional[str] = "📁"

class FolderCreate(FolderBase):
    pass

class Folder(FolderBase):
    id: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    imageCount: int = 0

    class Config:
        from_attributes = True
