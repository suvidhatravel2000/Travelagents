// Mock data for Suvidha Travel

export const destinations = [
  {
    id: 'explore',
    name: 'Explore',
    icon: '📍',
    trending: false
  },
  {
    id: 'ladakh',
    name: 'Ladakh',
    icon: '🏔️',
    trending: true
  },
  {
    id: 'thailand',
    name: 'Thailand',
    icon: '🛕',
    trending: true
  },
  {
    id: 'chardham',
    name: 'Chardham',
    icon: '🕉️',
    trending: true
  },
  {
    id: 'bali',
    name: 'Bali',
    icon: '🏖️',
    trending: true
  },
  {
    id: 'north-east',
    name: 'North East',
    icon: '🌄',
    trending: true
  },
  {
    id: 'singapore',
    name: 'Singapore',
    icon: '🏙️',
    trending: true
  },
  {
    id: 'himachal',
    name: 'Himachal',
    icon: '⛰️',
    trending: true
  },
  {
    id: 'maldives',
    name: 'Maldives',
    icon: '🏝️',
    trending: true
  },
  {
    id: 'sri-lanka',
    name: 'Sri Lanka',
    icon: '🌴',
    trending: false
  },
  {
    id: 'malaysia',
    name: 'Malaysia',
    icon: '🏢',
    trending: false
  }
];

export const packages = [
  {
    id: '1',
    title: 'Fun Filled Thailand - Sun, Sand & City Vibes',
    destination: 'thailand',
    category: 'Thailand',
    image: 'https://images.unsplash.com/photo-1528181304800-259b08848526?w=800',
    rating: 4.5,
    duration: '4N/5D',
    days: '2D Pattaya • 3D Bangkok',
    price: 17999,
    originalPrice: 22999,
    savings: 5000,
    flightsIncluded: false,
    groupTour: false
  },
  {
    id: '2',
    title: 'Horizons Of Thailand - Phi Phi, Krabi & Phuket Tour',
    destination: 'thailand',
    category: 'Thailand',
    image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=800',
    rating: 4.8,
    duration: '4N/5D',
    days: '2D Krabi • 3D Phuket',
    price: 29999,
    originalPrice: 37999,
    savings: 8000,
    flightsIncluded: false,
    groupTour: false
  },
  {
    id: '3',
    title: 'Coasts Of Thailand - Including A Visit To Tiger Kingdom',
    destination: 'thailand',
    category: 'Thailand',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800',
    rating: 4.5,
    duration: '6N/7D',
    days: '2D Krabi • 1D Phi Phi Islands • 4D Phuket',
    price: 48999,
    originalPrice: 59999,
    savings: 11000,
    flightsIncluded: false,
    groupTour: false
  },
  {
    id: '4',
    title: 'Magical Ladakh - With Flights Included',
    destination: 'ladakh',
    category: 'Ladakh',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    rating: 4.8,
    duration: '5N/6D',
    days: '5N Leh',
    price: 20999,
    originalPrice: 25999,
    savings: 5000,
    flightsIncluded: true,
    groupTour: false
  },
  {
    id: '5',
    title: 'Fly To Four Dhams - Complete Chardham Yatra',
    destination: 'chardham',
    category: 'Chardham',
    image: 'https://images.unsplash.com/photo-1585340223615-8d9a5c8a4e72?w=800',
    rating: 4.6,
    duration: '9N/10D',
    days: '1D Dehradun • 1D Yamunotri • 1D Gangotri • 3D Kedarnath',
    price: 38999,
    originalPrice: 43999,
    savings: 5000,
    flightsIncluded: false,
    groupTour: false
  },
  {
    id: '6',
    title: 'FLIGHTS Included - Bali Paradise',
    destination: 'bali',
    category: 'Bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    rating: 4.7,
    duration: '5N/6D',
    days: '5N Bali',
    price: 45999,
    originalPrice: 55999,
    savings: 10000,
    flightsIncluded: true,
    groupTour: false
  },
  {
    id: '7',
    title: 'Peaks of Himachal - Group Tour Package',
    destination: 'himachal',
    category: 'Himachal',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800',
    rating: 4.4,
    duration: '6N/7D',
    days: '2D Manali • 2D Dharamshala • 2D Dalhousie',
    price: 18999,
    originalPrice: 24999,
    savings: 6000,
    flightsIncluded: false,
    groupTour: true
  },
  {
    id: '8',
    title: 'Maldives Dream - Luxury Resort Stay',
    destination: 'maldives',
    category: 'Maldives',
    image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800',
    rating: 4.9,
    duration: '4N/5D',
    days: '4N Male',
    price: 65999,
    originalPrice: 79999,
    savings: 14000,
    flightsIncluded: true,
    groupTour: false
  },
  {
    id: '9',
    title: 'Thiksey Monastery & Pangong Lake - Ladakh Special',
    destination: 'ladakh',
    category: 'Ladakh',
    image: 'https://images.unsplash.com/photo-1571137894149-6c0e43b0b5ae?w=800',
    rating: 4.7,
    duration: '6N/7D',
    days: '2D Leh • 1D Nubra Valley • 1D Pangong Tso',
    price: 24999,
    originalPrice: 31999,
    savings: 7000,
    flightsIncluded: false,
    groupTour: true
  },
  {
    id: '10',
    title: 'Singapore City Explorer',
    destination: 'singapore',
    category: 'Singapore',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800',
    rating: 4.6,
    duration: '4N/5D',
    days: '4N Singapore',
    price: 32999,
    originalPrice: 41999,
    savings: 9000,
    flightsIncluded: true,
    groupTour: false
  }
];

export const heroBanners = [
  {
    id: '1',
    destination: 'thailand',
    title: 'THAILAND Summer Special',
    subtitle: 'FIXED DEPARTURE - 5TH MAY 2026',
    description: 'LIMITED SEATS LEFT',
    features: ['Flights Included'],
    price: 38999,
    originalPrice: 48999,
    duration: '4 NIGHTS | 5 DAYS',
    image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=1200',
    ctaText: 'BOOK NOW'
  },
  {
    id: '2',
    destination: 'ladakh',
    title: 'LADAKH',
    subtitle: 'Roads that take you beyond the clouds',
    description: 'Limited Seats Left',
    price: null,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
    ctaText: 'Book Now'
  }
];

export const companyInfo = {
  name: 'Suvidha Travel',
  phones: ['+91 8585997177', '+91-9911061103'],
  emails: ['info@suvidhatravel.com', 'anshul@suvidhatravel.com', 'suvidhatravel2000@gmail.com'],
  address: '1440, Galaxy Diamond Plaza, Sec - 4 Near Gaur City Mall Greater Noida (West) Uttar Pradesh Pin Code 201009',
  website: 'https://suvidhatravel.com'
};
