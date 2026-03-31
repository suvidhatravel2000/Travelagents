# Enhanced models for CMS features

from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
import uuid

# Top Bar Model
class TopBarButton(BaseModel):
    text: str
    link: str
    type: str = "link"  # link, phone, whatsapp
    icon: Optional[str] = None

class TopBarBase(BaseModel):
    text: str
    backgroundColor: str = "#ea580c"
    textColor: str = "#ffffff"
    fontSize: str = "14px"
    buttons: List[TopBarButton] = []
    visible: bool = True

class TopBar(TopBarBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Enhanced Banner Model
class BannerStyle(BaseModel):
    titleFontSize: str = "48px"
    titleColor: str = "#fbbf24"
    subtitleFontSize: str = "18px"
    subtitleColor: str = "#ffffff"
    textAlign: str = "left"
    overlayColor: str = "#000000"
    overlayOpacity: float = 0.4

class EnhancedBanner(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    destination: str
    title: str
    subtitle: Optional[str] = ""
    description: Optional[str] = ""
    imageDesktop: str
    imageMobile: Optional[str] = None
    buttonText: str = "Book Now"
    buttonLink: Optional[str] = None
    style: BannerStyle = Field(default_factory=BannerStyle)
    active: bool = True
    order: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Enhanced Destination Model
class DestinationIcon(BaseModel):
    type: str = "emoji"  # emoji or image
    value: str  # emoji char or image URL
    size: str = "48px"
    position: str = "top"  # top or left

class EnhancedDestination(BaseModel):
    id: str
    name: str
    icon: DestinationIcon
    trending: bool = False
    visible: bool = True
    order: int = 0
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Footer Model
class FooterColumn(BaseModel):
    title: str
    type: str  # about, links, contact
    content: dict  # flexible content based on type

class SocialLink(BaseModel):
    platform: str  # facebook, instagram, twitter, etc.
    url: str
    icon: str

class FooterBase(BaseModel):
    columns: List[FooterColumn]
    socialLinks: List[SocialLink] = []
    copyrightText: str = ""
    backgroundColor: str = "#1f2937"
    textColor: str = "#9ca3af"

class Footer(FooterBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Section Visibility Model
class SectionVisibility(BaseModel):
    topBar: bool = True
    destinationTabs: bool = True
    searchBar: bool = True
    heroBanner: bool = True
    trendingSection: bool = True
    secondaryBanner: bool = True
    destinationSections: bool = True
    footer: bool = True

class HomePageSettings(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    visibility: SectionVisibility = Field(default_factory=SectionVisibility)
    trendingCount: int = 6
    featuredPackages: List[str] = []  # package IDs
    createdAt: datetime = Field(default_factory=datetime.utcnow)
    updatedAt: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True
