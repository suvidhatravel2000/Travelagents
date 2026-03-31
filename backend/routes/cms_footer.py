from fastapi import APIRouter, HTTPException, Depends
from models_cms import Footer, FooterBase
from motor.motor_asyncio import AsyncIOMotorDatabase

router = APIRouter(prefix="/api/cms/footer", tags=["cms-footer"])

async def get_db():
    from server import db
    return db

@router.get("/", response_model=Footer)
async def get_footer(db: AsyncIOMotorDatabase = Depends(get_db)):
    """Get footer settings"""
    footer = await db.footer.find_one()
    if not footer:
        # Return default footer
        default = Footer(
            columns=[
                {
                    "title": "About Us",
                    "type": "about",
                    "content": {
                        "text": "Your trusted travel partner for creating unforgettable experiences.",
                        "logo": ""
                    }
                },
                {
                    "title": "Quick Links",
                    "type": "links",
                    "content": {
                        "links": [
                            {"text": "Home", "url": "/"},
                            {"text": "Packages", "url": "/"},
                            {"text": "Blog", "url": "/blog"}
                        ]
                    }
                },
                {
                    "title": "Contact Us",
                    "type": "contact",
                    "content": {
                        "phones": ["+91 8585997177", "+91-9911061103"],
                        "emails": ["info@suvidhatravel.com"],
                        "address": "1440, Galaxy Diamond Plaza, Greater Noida"
                    }
                }
            ],
            socialLinks=[],
            copyrightText="© 2026 Suvidha Travel. All rights reserved."
        )
        await db.footer.insert_one(default.dict())
        return default
    return footer

@router.put("/", response_model=Footer)
async def update_footer(
    footer_update: FooterBase,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update footer settings"""
    from datetime import datetime
    
    existing = await db.footer.find_one()
    if not existing:
        footer_obj = Footer(**footer_update.dict())
        await db.footer.insert_one(footer_obj.dict())
        return footer_obj
    
    update_data = footer_update.dict()
    update_data["updatedAt"] = datetime.utcnow()
    
    await db.footer.update_one(
        {"id": existing["id"]},
        {"$set": update_data}
    )
    
    updated = await db.footer.find_one({"id": existing["id"]})
    return updated
