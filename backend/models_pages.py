from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import uuid

class PageTab(BaseModel):
    """Destination tab for holiday pages"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str  # e.g., "Himachal", "Thailand"
    icon: str  # Icon/emoji or image URL
    destinationId: Optional[str] = None  # Link to destination if exists
    visible: bool = True
    order: int = 0

class PageBanner(BaseModel):
    """Banner configuration for holiday pages"""
    desktopImage: str
    mobileImage: Optional[str] = None
    title: str
    subtitle: Optional[str] = ""
    buttonText: str = "Explore Now"
    buttonLink: str = "#packages"
    textAlign: str = "center"  # left, center, right
    textColor: str = "#FFFFFF"
    overlayOpacity: float = 0.5  # 0 to 1

class PageSearchConfig(BaseModel):
    """Search bar configuration"""
    enabled: bool = True
    placeholder: str = "Search destinations or packages..."
    searchDestinations: bool = True
    searchPackages: bool = True

class PageTrendingConfig(BaseModel):
    """Trending packages section configuration"""
    enabled: bool = True
    title: str = "Trending Packages"
    subtitle: Optional[str] = "Most popular destinations"
    packageIds: List[str] = []  # Selected package IDs
    displayCount: int = 6  # How many to show
    layout: str = "grid"  # grid or carousel

class HolidayPageConfig(BaseModel):
    """Complete configuration for India/International holiday pages"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    pageType: str  # "india" or "international"
    
    # Sections
    banner: PageBanner
    tabs: List[PageTab] = []
    search: PageSearchConfig = PageSearchConfig()
    trending: PageTrendingConfig = PageTrendingConfig()
    
    # Header Dropdown Control
    headerDropdown: List[str] = []  # Tab names to show in Header dropdown
    
    # SEO fields
    seo_title: Optional[str] = ""
    seo_description: Optional[str] = ""
    focus_keyword: Optional[str] = ""
    
    # Meta
    visible: bool = True
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

class HolidayPageConfigCreate(BaseModel):
    """Create/Update holiday page config"""
    pageType: str
    banner: PageBanner
    tabs: List[PageTab] = []
    search: PageSearchConfig = PageSearchConfig()
    trending: PageTrendingConfig = PageTrendingConfig()
    headerDropdown: List[str] = []  # Tab names to show in Header dropdown
    seo_title: Optional[str] = ""
    seo_description: Optional[str] = ""
    focus_keyword: Optional[str] = ""
    visible: bool = True
