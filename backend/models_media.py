from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class MediaItem(BaseModel):
    """Simple media item model"""
    id: str
    url: str
    filename: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        from_attributes = True

class MediaItemCreate(BaseModel):
    """Create media item"""
    url: str
    filename: str
