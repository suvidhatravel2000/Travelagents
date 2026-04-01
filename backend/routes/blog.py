from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from models_blog import BlogPost, BlogPostCreate, generate_slug
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import datetime

router = APIRouter(prefix="/api/blog", tags=["blog"])


async def get_db():
    from server import db
    return db


@router.get("/", response_model=List[BlogPost])
async def get_blog_posts(
    status: Optional[str] = None,
    category: Optional[str] = None,
    featured: Optional[bool] = None,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    query = {}
    if status:
        query["status"] = status
    if category:
        query["category"] = category
    if featured is not None:
        query["featured"] = featured

    posts = await db.blog_posts.find(query, {"_id": 0}).sort("createdAt", -1).to_list(500)
    return posts


@router.get("/categories")
async def get_blog_categories(db: AsyncIOMotorDatabase = Depends(get_db)):
    categories = await db.blog_posts.distinct("category")
    return [c for c in categories if c]


@router.get("/{post_id}", response_model=BlogPost)
async def get_blog_post(post_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    post = await db.blog_posts.find_one(
        {"$or": [{"id": post_id}, {"slug": post_id}]},
        {"_id": 0}
    )
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post


@router.post("/", response_model=BlogPost)
async def create_blog_post(post: BlogPostCreate, db: AsyncIOMotorDatabase = Depends(get_db)):
    post_obj = BlogPost(**post.dict())

    if not post_obj.slug:
        post_obj.slug = generate_slug(post_obj.title)

    existing = await db.blog_posts.find_one({"slug": post_obj.slug}, {"_id": 0})
    if existing:
        post_obj.slug = f"{post_obj.slug}-{post_obj.id[:6]}"

    if post_obj.status == "published" and not post_obj.publishedAt:
        post_obj.publishedAt = datetime.utcnow()

    await db.blog_posts.insert_one(post_obj.dict())
    created = await db.blog_posts.find_one({"id": post_obj.id}, {"_id": 0})
    return created


@router.put("/{post_id}", response_model=BlogPost)
async def update_blog_post(
    post_id: str,
    post_update: BlogPostCreate,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    existing = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Blog post not found")

    update_data = post_update.dict()
    update_data["updatedAt"] = datetime.utcnow()

    if not update_data.get("slug"):
        update_data["slug"] = generate_slug(update_data["title"])

    if update_data.get("status") == "published" and not existing.get("publishedAt"):
        update_data["publishedAt"] = datetime.utcnow()

    await db.blog_posts.update_one({"id": post_id}, {"$set": update_data})
    updated = await db.blog_posts.find_one({"id": post_id}, {"_id": 0})
    return updated


@router.delete("/{post_id}")
async def delete_blog_post(post_id: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"message": "Blog post deleted successfully"}
