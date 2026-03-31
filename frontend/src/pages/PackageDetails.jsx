import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Calendar, 
  MapPin, 
  Users, 
  Plane, 
  Phone, 
  Mail, 
  Clock, 
  Check 
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { packagesAPI, settingsAPI } from '../api/client';

const PackageDetails = () => {
  const { packageId } = useParams();
  const navigate = useNavigate();
  
  const [pkg, setPkg] = useState(null);
  const [companyInfo, setCompanyInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [packageData, settings] = await Promise.all([
          packagesAPI.getById(packageId),
          settingsAPI.get()
        ]);
        setPkg(packageData);
        setCompanyInfo(settings);
        setError(null);
      } catch (err) {
        console.error('Error fetching package:', err);
        setError('Package not found');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [packageId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading package details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Package Not Found</h1>
          <button 
            onClick={() => navigate('/')}
            className="text-orange-500 hover:text-orange-600"
          >
            ← Back to Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Use itinerary from package or default
  const itinerary = pkg.itinerary && pkg.itinerary.length > 0 ? pkg.itinerary : [
    { day: 1, title: 'Arrival & Check-in', description: 'Arrive at destination, hotel check-in, and evening leisure time.' },
    { day: 2, title: 'City Tour', description: 'Full day guided city tour covering major attractions and landmarks.' },
    { day: 3, title: 'Adventure Activities', description: 'Experience thrilling adventure activities and local cuisine.' },
    { day: 4, title: 'Cultural Experience', description: 'Immerse in local culture, visit markets, and traditional shows.' },
    { day: 5, title: 'Departure', description: 'Check-out and departure with wonderful memories.' }
  ];

  const inclusions = pkg.inclusions && pkg.inclusions.length > 0 ? pkg.inclusions : [
    'Accommodation in selected hotels',
    'Daily breakfast',
    'Airport transfers',
    'Sightseeing as per itinerary',
    'All taxes and service charges'
  ];

  const exclusions = pkg.exclusions && pkg.exclusions.length > 0 ? pkg.exclusions : [
    'Airfare (unless specified)',
    'Personal expenses',
    'Travel insurance',
    'Any meals not mentioned',
    'Tips and gratuities'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-orange-500 hover:text-orange-600 mb-6 font-medium"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden mb-6">
              <img
                src={pkg.image}
                alt={pkg.title}
                className="w-full h-96 object-cover"
              />
              {pkg.rating && (
                <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-2 rounded-lg flex items-center space-x-1 text-sm font-medium">
                  <Star className="h-5 w-5 fill-white" />
                  <span className="text-lg">{pkg.rating}</span>
                </div>
              )}
              
              {/* Tags */}
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                {pkg.flightsIncluded && (
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium">
                    <Plane className="h-4 w-4" />
                    <span>Flights Included</span>
                  </div>
                )}
                {pkg.groupTour && (
                  <div className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 text-sm font-medium">
                    <Users className="h-4 w-4" />
                    <span>Group Tour</span>
                  </div>
                )}
              </div>
            </div>

            {/* Package Title and Info */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium mb-3">
                    {pkg.category}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{pkg.title}</h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-5 w-5" />
                      <span>{pkg.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5" />
                      <span>{pkg.days}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Package Overview</h2>
                <p className="text-gray-700 leading-relaxed">
                  {pkg.overview || `Experience the best of ${pkg.category} with this carefully curated package. 
                  Enjoy comfortable accommodations, guided tours, and unforgettable experiences 
                  that will create memories to last a lifetime. This package is designed to give 
                  you the perfect blend of adventure, relaxation, and cultural immersion.`}
                </p>
              </div>
            </div>

            {/* Itinerary */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Clock className="h-6 w-6 mr-2 text-orange-500" />
                Day-wise Itinerary
              </h2>
              <div className="space-y-4">
                {itinerary.map((item) => (
                  <div key={item.day} className="border-l-4 border-orange-500 pl-4 py-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Day {item.day}
                      </span>
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    </div>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Inclusions */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center text-green-600">
                  <Check className="h-5 w-5 mr-2" />
                  Inclusions
                </h2>
                <ul className="space-y-2">
                  {inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-gray-700">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center text-red-600">
                  <span className="mr-2">✕</span>
                  Exclusions
                </h2>
                <ul className="space-y-2">
                  {exclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-gray-700">
                      <span className="text-red-600 flex-shrink-0 mt-0.5">✕</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-lg sticky top-24">
              <div className="mb-6">
                <p className="text-gray-600 text-sm mb-2">Starting from</p>
                <div className="flex items-baseline space-x-3 mb-2">
                  <span className="text-4xl font-bold text-orange-500">
                    ₹{pkg.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{pkg.originalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">per person</span>
                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                    SAVE ₹{pkg.savings.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-900">{pkg.duration}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b">
                  <span className="text-gray-600">Category</span>
                  <span className="font-semibold text-gray-900">{pkg.category}</span>
                </div>
                {pkg.rating && (
                  <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-gray-600">Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold text-gray-900">{pkg.rating}</span>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => window.location.href = `tel:${companyInfo.phones[0]}`}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-semibold text-lg transition-colors mb-3 flex items-center justify-center space-x-2"
              >
                <Phone className="h-5 w-5" />
                <span>Call Now to Book</span>
              </button>

              <a
                href={`mailto:${companyInfo.emails[0]}`}
                className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-50 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Mail className="h-5 w-5" />
                <span>Email Inquiry</span>
              </a>

              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-600 mb-3 font-medium">Contact Us:</p>
                <div className="space-y-2">
                  {companyInfo.phones.map((phone, idx) => (
                    <a
                      key={idx}
                      href={`tel:${phone}`}
                      className="flex items-center space-x-2 text-sm text-gray-700 hover:text-orange-500"
                    >
                      <Phone className="h-4 w-4" />
                      <span>{phone}</span>
                    </a>
                  ))}
                  <a
                    href={`mailto:${companyInfo.emails[0]}`}
                    className="flex items-center space-x-2 text-sm text-gray-700 hover:text-orange-500"
                  >
                    <Mail className="h-4 w-4" />
                    <span>{companyInfo.emails[0]}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PackageDetails;
