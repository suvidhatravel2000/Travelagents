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
                  {pkg.validityDates && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Valid:</strong> {pkg.validityDates}
                    </p>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h2 className="text-xl font-semibold text-gray-900 mb-3">Package Overview</h2>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {pkg.overview || `Experience the best of ${pkg.category} with this carefully curated package. 
                  Enjoy comfortable accommodations, guided tours, and unforgettable experiences 
                  that will create memories to last a lifetime. This package is designed to give 
                  you the perfect blend of adventure, relaxation, and cultural immersion.`}
                </div>
                
                {pkg.additionalInfo && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900 whitespace-pre-line">{pkg.additionalInfo}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Pricing Table */}
            {pkg.pricingTable && pkg.pricingTable.length > 0 && (
              <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Hotel to be Use</h2>
                <p className="text-sm text-gray-700 mb-6">
                  BELOW RATES ARE PER PERSON NET & NON COMMISSIONABLE
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#d1d5db' }}>
                        <th className="border border-gray-400 px-6 py-4 text-left font-bold text-gray-900">
                          Category
                        </th>
                        <th className="border border-gray-400 px-6 py-4 text-left font-bold text-gray-900">
                          Per Person (Min 2 Pax)
                        </th>
                        <th className="border border-gray-400 px-6 py-4 text-left font-bold text-gray-900">
                          Per Person (Min 4 Pax)
                        </th>
                        <th className="border border-gray-400 px-6 py-4 text-left font-bold text-gray-900">
                          Per Person (Min 6 Pax)
                        </th>
                        <th className="border border-gray-400 px-6 py-4 text-left font-bold text-gray-900">
                          Extra bed
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pkg.pricingTable.map((row, idx) => (
                        <tr key={idx}>
                          <td className="border border-gray-400 px-6 py-4 font-semibold text-gray-900">
                            {row.category}
                          </td>
                          <td className="border border-gray-400 px-6 py-4 text-gray-900">
                            {row.price2Pax || '-'}
                          </td>
                          <td className="border border-gray-400 px-6 py-4 text-gray-900">
                            {row.price4Pax || '-'}
                          </td>
                          <td className="border border-gray-400 px-6 py-4 text-gray-900">
                            {row.price6Pax || '-'}
                          </td>
                          <td className="border border-gray-400 px-6 py-4 text-gray-900">
                            {row.extraBed || '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {pkg.additionalInfo && (
                  <div className="mt-4 text-gray-700 leading-relaxed">
                    {pkg.additionalInfo}
                  </div>
                )}
                
                {pkg.vehicleInfo && (
                  <p className="text-gray-700 mt-4">
                    <strong>Vehicle Use:</strong> {pkg.vehicleInfo}
                  </p>
                )}
              </div>
            )}

            {/* Hotel Details */}
            {pkg.hotelDetails && pkg.hotelDetails.length > 0 && (
              <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Hotel Details</h2>
                <div className="overflow-x-auto">
                  <table className="w-full" style={{ borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#d1d5db' }}>
                        <th className="border border-gray-400 px-6 py-4 text-left font-bold text-gray-900 w-1/4">
                          Category
                        </th>
                        <th className="border border-gray-400 px-6 py-4 text-left font-bold text-gray-900">
                          Manali
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {pkg.hotelDetails.map((hotel, idx) => (
                        <tr key={idx}>
                          <td className="border border-gray-400 px-6 py-4 font-semibold text-gray-900">
                            {hotel.category}
                          </td>
                          <td className="border border-gray-400 px-6 py-4 text-gray-900">
                            {hotel.hotelName}
                            {hotel.roomType && ` ( ${hotel.roomType} )`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Itinerary */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Day Wise Itinerary</h2>
              <div className="space-y-6">
                {itinerary.map((item) => (
                  <div key={item.day} className="py-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      Day {String(item.day).padStart(2, '0')}: {item.title}
                    </h3>
                    <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line pl-4">
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
              {pkg.overview && pkg.overview.includes('Tour ends') && (
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-xl font-semibold text-gray-900">
                    Tour ends of your {pkg.title}
                  </h3>
                </div>
              )}
            </div>

            {/* Inclusions & Exclusions */}
            <div className="grid md:grid-cols-1 gap-6 mb-6">
              {/* Inclusions */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">PACKAGE COST INCLUDES :</h2>
                <ul className="space-y-3">
                  {inclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-gray-900">
                      <span className="text-2xl leading-none mt-[-2px]">•</span>
                      <span className="text-lg leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Package Cost does not Includes</h2>
                <ul className="space-y-3">
                  {exclusions.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-gray-900">
                      <span className="text-2xl leading-none mt-[-2px]">•</span>
                      <span className="text-lg leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Terms & Conditions */}
            {pkg.termsConditions && pkg.termsConditions.length > 0 && (
              <div className="bg-white rounded-lg p-6 mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Terms & Conditions</h2>
                <ul className="space-y-3">
                  {pkg.termsConditions.map((term, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-gray-900">
                      <span className="text-2xl leading-none mt-[-2px]">•</span>
                      <span className="text-lg leading-relaxed">{term}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
