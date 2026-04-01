from fastapi import FastAPI, APIRouter
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path

# Import routes
from routes import packages, destinations, banners, settings, auth, media
from routes import cms_topbar, cms_footer, cms_homepage

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Health check routes
@api_router.get("/")
async def root():
    return {"message": "Suvidha Travel API"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy"}

# Include all routers
app.include_router(packages.router)
app.include_router(destinations.router)
app.include_router(banners.router)
app.include_router(settings.router)
app.include_router(auth.router)
app.include_router(cms_topbar.router)
app.include_router(cms_footer.router)
app.include_router(cms_homepage.router)
app.include_router(media.router)
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)


# Serve uploaded files with CORS support
from fastapi.responses import FileResponse
from fastapi import HTTPException

@app.get("/uploads/{file_path:path}")
async def serve_uploads(file_path: str):
    """Serve uploaded files with proper CORS headers"""
    file_location = f"/app/uploads/{file_path}"
    if not os.path.exists(file_location):
        raise HTTPException(status_code=404, detail="File not found")
    
    # Determine content type
    content_type = "application/octet-stream"
    if file_path.endswith(('.jpg', '.jpeg')):
        content_type = "image/jpeg"
    elif file_path.endswith('.png'):
        content_type = "image/png"
    elif file_path.endswith('.webp'):
        content_type = "image/webp"
    
    return FileResponse(
        file_location,
        media_type=content_type,
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, OPTIONS",
            "Access-Control-Allow-Headers": "*",
            "Cache-Control": "public, max-age=31536000"
        }
    )

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
