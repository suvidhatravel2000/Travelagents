from fastapi import APIRouter, HTTPException, Response, Request
from models import AdminLogin, AdminUser
from motor.motor_asyncio import AsyncIOMotorDatabase
from passlib.context import CryptContext
from datetime import datetime

router = APIRouter(prefix="/api/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

async def get_db():
    from server import db
    return db

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

@router.post("/login")
async def login(credentials: AdminLogin, response: Response, request: Request):
    """Admin login"""
    from server import db
    
    admin = await db.admins.find_one({"username": credentials.username})
    
    if not admin or not verify_password(credentials.password, admin["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Update last login
    await db.admins.update_one(
        {"username": credentials.username},
        {"$set": {"lastLogin": datetime.utcnow()}}
    )
    
    # Set session cookie (simple implementation)
    response.set_cookie(
        key="admin_session",
        value=admin["username"],
        httponly=True,
        max_age=86400  # 24 hours
    )
    
    return {
        "message": "Login successful",
        "user": {
            "username": admin["username"],
            "email": admin["email"]
        }
    }

@router.post("/logout")
async def logout(response: Response):
    """Admin logout"""
    response.delete_cookie("admin_session")
    return {"message": "Logout successful"}

@router.get("/verify")
async def verify_session(request: Request):
    """Verify if user is logged in"""
    session = request.cookies.get("admin_session")
    if not session:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    from server import db
    admin = await db.admins.find_one({"username": session})
    
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid session")
    
    return {
        "authenticated": True,
        "user": {
            "username": admin["username"],
            "email": admin["email"]
        }
    }
