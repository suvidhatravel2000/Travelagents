from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid
import re


def generate_slug(title: str) -> str:
    slug = title.lower().strip()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s_]+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    return slug


class BlogPostBase(BaseModel):
    title: str
    slug: Optional[str] = ""
    excerpt: Optional[str] = ""
    content: Optional[str] = ""
    image: Optional[str] = ""
    author: Optional[str] = "Admin"
    category: Optional[str] = ""
    tags: Optional[List[str]] = []
    status: Optional[str] = "draft"
    featured: Optional[bool] = False
    seo_title: Optional[str] = ""
    seo_description: Optional[str] = ""
    focus_keyword: Optional[str] = ""


class BlogPostCreate(BlogPostBase):
    pass


class BlogPost(BlogPostBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)
    publishedAt: Optional[datetime] = None

    class Config:
        from_attributes = True
