from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# Package Models
class ItineraryItem(BaseModel):
    day: int
    title: str
    description: str

class PricingCategory(BaseModel):
    category: str  # Standard, Deluxe, Premium, etc.
    
    # NEW: Dynamic columns format (unlimited columns)
    columns: Optional[dict] = None  # {"2 Pax": "15000", "4 Pax": "12000", ...}
    
    # OLD: Fixed columns format (backward compatibility)
    price2Pax: Optional[int] = None
    price4Pax: Optional[int] = None
    price6Pax: Optional[int] = None
    extraBed: Optional[int] = None
    
    class Config:
        extra = "allow"  # Allow additional fields not explicitly defined

class HotelDetail(BaseModel):
    category: str
    # Dynamic columns for multiple locations (Nainital, Jim Corbett, etc.)
    # Can be either simple hotelName or dict of location: hotel
    hotelName: Optional[str] = None  # For backward compatibility (single column)
    locations: Optional[dict] = None  # For multi-column: {"Nainital": "Hotel Name", "Jim Corbett": "..."}

class PackageBase(BaseModel):
    title: str
    destination: str
    category: str
    image: str
    rating: Optional[float] = None
    duration: str
    days: str
    price: int  # Base price for display
    originalPrice: int
    savings: int
    flightsIncluded: bool = False
    groupTour: bool = False
    
    # Enhanced fields
    overview: Optional[str] = ""
    itinerary: Optional[List[ItineraryItem]] = []
    inclusions: Optional[List[str]] = []
    exclusions: Optional[List[str]] = []
    
    # New fields for detailed packages
    pricingTable: Optional[List[PricingCategory]] = []
    hotelDetails: Optional[List[HotelDetail]] = []
    vehicleInfo: Optional[str] = ""
    validityDates: Optional[str] = ""
    additionalInfo: Optional[str] = ""
    termsConditions: Optional[List[str]] = []
    
    # Trending control
    isTrending: Optional[bool] = False
    trendingOrder: Optional[int] = None
    
    # Region assignment for holiday pages
    region: Optional[str] = "india"  # "india" or "international" or "both"
    
    # SEO fields
    seo_title: Optional[str] = ""
    seo_description: Optional[str] = ""
    focus_keyword: Optional[str] = ""

class PackageCreate(PackageBase):
    pass

class Package(PackageBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Destination Models
class DestinationBase(BaseModel):
    id: str
    name: str
    icon: str
    trending: bool = False
    visible: bool = True
    order: int = 0

class DestinationCreate(DestinationBase):
    pass

class Destination(DestinationBase):
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Banner Models
class BannerBase(BaseModel):
    destination: str
    title: str
    subtitle: Optional[str] = ""
    description: Optional[str] = ""
    features: Optional[List[str]] = []
    price: Optional[int] = None
    originalPrice: Optional[int] = None
    duration: Optional[str] = ""
    image: str
    imageDesktop: Optional[str] = None  # Desktop-specific image
    imageMobile: Optional[str] = None   # Mobile-specific image
    ctaText: str = "Book Now"
    buttonText: Optional[str] = "BOOK NOW"
    active: bool = True
    visible: bool = True
    order: int = 0
    # Styling controls
    titleFontSize: Optional[str] = "text-4xl"
    titleColor: Optional[str] = "text-white"
    subtitleFontSize: Optional[str] = "text-lg"
    subtitleColor: Optional[str] = "text-gray-200"
    textAlign: Optional[str] = "text-left"

class BannerCreate(BannerBase):
    pass

class Banner(BannerBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Settings Models
class SettingsBase(BaseModel):
    name: str
    phones: List[str]
    emails: List[str]
    address: str
    website: str

class SettingsCreate(SettingsBase):
    pass

class Settings(SettingsBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Admin Models
class AdminLogin(BaseModel):
    username: str
    password: str

class AdminUser(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    username: str
    email: str
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    lastLogin: Optional[datetime] = None

    class Config:
        from_attributes = True
