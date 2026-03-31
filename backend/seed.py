"""
Seed script to populate MongoDB with initial data from mockData
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from pathlib import Path
from passlib.context import CryptContext

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Mock data
destinations = [
    {"id": "explore", "name": "Explore", "icon": "📍", "trending": False},
    {"id": "ladakh", "name": "Ladakh", "icon": "🏔️", "trending": True},
    {"id": "thailand", "name": "Thailand", "icon": "🛕", "trending": True},
    {"id": "chardham", "name": "Chardham", "icon": "🕉️", "trending": True},
    {"id": "bali", "name": "Bali", "icon": "🏖️", "trending": True},
    {"id": "north-east", "name": "North East", "icon": "🌄", "trending": True},
    {"id": "singapore", "name": "Singapore", "icon": "🏙️", "trending": True},
    {"id": "himachal", "name": "Himachal", "icon": "⛰️", "trending": True},
    {"id": "maldives", "name": "Maldives", "icon": "🏝️", "trending": True},
    {"id": "sri-lanka", "name": "Sri Lanka", "icon": "🌴", "trending": False},
    {"id": "malaysia", "name": "Malaysia", "icon": "🏢", "trending": False}
]

packages = [
    {
        "id": "1",
        "title": "Fun Filled Thailand - Sun, Sand & City Vibes",
        "destination": "thailand",
        "category": "Thailand",
        "image": "https://images.unsplash.com/photo-1528181304800-259b08848526?w=800",
        "rating": 4.5,
        "duration": "4N/5D",
        "days": "2D Pattaya • 3D Bangkok",
        "price": 17999,
        "originalPrice": 22999,
        "savings": 5000,
        "flightsIncluded": False,
        "groupTour": False,
        "overview": "Experience the best of Thailand with this carefully curated package.",
        "itinerary": [
            {"day": 1, "title": "Arrival & Check-in", "description": "Arrive at destination, hotel check-in, and evening leisure time."},
            {"day": 2, "title": "City Tour", "description": "Full day guided city tour covering major attractions and landmarks."},
            {"day": 3, "title": "Adventure Activities", "description": "Experience thrilling adventure activities and local cuisine."},
            {"day": 4, "title": "Cultural Experience", "description": "Immerse in local culture, visit markets, and traditional shows."},
            {"day": 5, "title": "Departure", "description": "Check-out and departure with wonderful memories."}
        ],
        "inclusions": [
            "Accommodation in selected hotels",
            "Daily breakfast",
            "Airport transfers",
            "Sightseeing as per itinerary",
            "All taxes and service charges"
        ],
        "exclusions": [
            "Airfare (unless specified)",
            "Personal expenses",
            "Travel insurance",
            "Any meals not mentioned",
            "Tips and gratuities"
        ]
    },
    {
        "id": "2",
        "title": "Horizons Of Thailand - Phi Phi, Krabi & Phuket Tour",
        "destination": "thailand",
        "category": "Thailand",
        "image": "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800",
        "rating": 4.8,
        "duration": "4N/5D",
        "days": "2D Krabi • 3D Phuket",
        "price": 29999,
        "originalPrice": 37999,
        "savings": 8000,
        "flightsIncluded": False,
        "groupTour": False,
        "overview": "Explore the stunning beaches and islands of Thailand.",
        "itinerary": [
            {"day": 1, "title": "Arrival in Krabi", "description": "Hotel check-in and evening beach walk."},
            {"day": 2, "title": "Phi Phi Island Tour", "description": "Full day island hopping and snorkeling."},
            {"day": 3, "title": "Transfer to Phuket", "description": "Travel to Phuket and city tour."},
            {"day": 4, "title": "Phuket Exploration", "description": "Visit Patong Beach and local markets."},
            {"day": 5, "title": "Departure", "description": "Check-out and departure."}
        ],
        "inclusions": ["Accommodation", "Breakfast", "Transfers", "Island tours", "Taxes"],
        "exclusions": ["Flights", "Lunch & Dinner", "Personal expenses", "Insurance"]
    },
    {
        "id": "3",
        "title": "Coasts Of Thailand - Including A Visit To Tiger Kingdom",
        "destination": "thailand",
        "category": "Thailand",
        "image": "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800",
        "rating": 4.5,
        "duration": "6N/7D",
        "days": "2D Krabi • 1D Phi Phi Islands • 4D Phuket",
        "price": 48999,
        "originalPrice": 59999,
        "savings": 11000,
        "flightsIncluded": False,
        "groupTour": False,
        "overview": "Complete Thailand coastal experience with Tiger Kingdom visit.",
        "itinerary": [
            {"day": 1, "title": "Arrival", "description": "Arrive and hotel check-in."},
            {"day": 2, "title": "Krabi Beaches", "description": "Explore Krabi's beautiful beaches."},
            {"day": 3, "title": "Phi Phi Islands", "description": "Full day island tour."},
            {"day": 4, "title": "Phuket Transfer", "description": "Travel to Phuket."},
            {"day": 5, "title": "Tiger Kingdom", "description": "Visit Tiger Kingdom and safari."},
            {"day": 6, "title": "Phuket Sightseeing", "description": "City and beach tour."},
            {"day": 7, "title": "Departure", "description": "Check-out and departure."}
        ],
        "inclusions": ["Hotels", "Breakfast", "All transfers", "Tiger Kingdom entry", "Taxes"],
        "exclusions": ["Flights", "Other meals", "Shopping", "Tips"]
    },
    {
        "id": "4",
        "title": "Magical Ladakh - With Flights Included",
        "destination": "ladakh",
        "category": "Ladakh",
        "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        "rating": 4.8,
        "duration": "5N/6D",
        "days": "5N Leh",
        "price": 20999,
        "originalPrice": 25999,
        "savings": 5000,
        "flightsIncluded": True,
        "groupTour": False,
        "overview": "Explore the majestic landscapes of Ladakh.",
        "itinerary": [
            {"day": 1, "title": "Arrival in Leh", "description": "Acclimatization and rest."},
            {"day": 2, "title": "Leh Local Tour", "description": "Visit monasteries and palaces."},
            {"day": 3, "title": "Nubra Valley", "description": "Journey through Khardung La."},
            {"day": 4, "title": "Pangong Lake", "description": "Visit the stunning Pangong Tso."},
            {"day": 5, "title": "Leh Exploration", "description": "Local market and culture."},
            {"day": 6, "title": "Departure", "description": "Flight back home."}
        ],
        "inclusions": ["Flights", "Hotels", "All meals", "Transfers", "Permits", "Taxes"],
        "exclusions": ["Personal expenses", "Insurance", "Tips"]
    }
]

banners = [
    {
        "id": "1",
        "destination": "thailand",
        "title": "THAILAND Summer Special",
        "subtitle": "FIXED DEPARTURE - 5TH MAY 2026",
        "description": "LIMITED SEATS LEFT",
        "features": ["Flights Included"],
        "price": 38999,
        "originalPrice": 48999,
        "duration": "4 NIGHTS | 5 DAYS",
        "image": "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200",
        "ctaText": "BOOK NOW",
        "active": True,
        "order": 1
    },
    {
        "id": "2",
        "destination": "ladakh",
        "title": "LADAKH",
        "subtitle": "Roads that take you beyond the clouds",
        "description": "Limited Seats Left",
        "features": [],
        "price": None,
        "originalPrice": None,
        "duration": "",
        "image": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200",
        "ctaText": "Book Now",
        "active": True,
        "order": 2
    }
]

settings = {
    "id": "1",
    "name": "Suvidha Travel",
    "phones": ["+91 8585997177", "+91-9911061103"],
    "emails": ["info@suvidhatravel.com", "anshul@suvidhatravel.com", "suvidhatravel2000@gmail.com"],
    "address": "1440, Galaxy Diamond Plaza, Sec - 4 Near Gaur City Mall Greater Noida (West) Uttar Pradesh Pin Code 201009",
    "website": "https://suvidhatravel.com"
}

admin_user = {
    "id": "admin-1",
    "username": "admin",
    "password": pwd_context.hash("admin123"),
    "email": "admin@suvidhatravel.com"
}

async def seed_database():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("🌱 Starting database seeding...")
    
    # Clear existing data
    await db.packages.delete_many({})
    await db.destinations.delete_many({})
    await db.banners.delete_many({})
    await db.settings.delete_many({})
    await db.admins.delete_many({})
    print("✓ Cleared existing data")
    
    # Insert destinations
    await db.destinations.insert_many(destinations)
    print(f"✓ Inserted {len(destinations)} destinations")
    
    # Insert packages
    await db.packages.insert_many(packages)
    print(f"✓ Inserted {len(packages)} packages")
    
    # Insert banners
    await db.banners.insert_many(banners)
    print(f"✓ Inserted {len(banners)} banners")
    
    # Insert settings
    await db.settings.insert_one(settings)
    print("✓ Inserted company settings")
    
    # Insert admin user
    await db.admins.insert_one(admin_user)
    print("✓ Inserted admin user (username: admin, password: admin123)")
    
    print("\n✅ Database seeding completed successfully!")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_database())
