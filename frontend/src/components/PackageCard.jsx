import React from 'react';
import { Phone, Star, Plane, Users } from 'lucide-react';
import { companyInfo } from '../mockData';

const PackageCard = ({ package: pkg }) => {
  const handleGetInTouch = () => {
    window.location.href = `tel:${companyInfo.phones[0]}`;
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 group">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <img
          src={pkg.image}
          alt={pkg.title}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Rating Badge */}
        {pkg.rating && (
          <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1 rounded-md flex items-center space-x-1 text-sm font-medium">
            <Star className="h-4 w-4 fill-white" />
            <span>{pkg.rating}</span>
          </div>
        )}

        {/* Tags */}
        <div className="absolute top-3 left-3 flex flex-col space-y-2">
          {pkg.flightsIncluded && (
            <div className="bg-blue-600 text-white px-3 py-1 rounded-md flex items-center space-x-1 text-xs font-medium">
              <Plane className="h-3 w-3" />
              <span>Flights Included</span>
            </div>
          )}
          {pkg.groupTour && (
            <div className="bg-purple-600 text-white px-3 py-1 rounded-md flex items-center space-x-1 text-xs font-medium">
              <Users className="h-3 w-3" />
              <span>Group Tour</span>
            </div>
          )}
        </div>

        {/* Duration Badge */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-orange-500 text-white px-3 py-1 rounded-md text-sm font-medium">
            {pkg.duration}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 h-14">
          {pkg.title}
        </h3>

        <p className="text-sm text-gray-600 mb-3">
          {pkg.days}
        </p>

        {/* Pricing */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div>
              <span className="text-2xl font-bold text-orange-500">₹{pkg.price.toLocaleString('en-IN')}</span>
              <span className="text-sm text-gray-500 line-through ml-2">₹{pkg.originalPrice.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <div className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-semibold">
            SAVE ₹{pkg.savings.toLocaleString('en-IN')}
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-3">/ Adult</p>

        {/* CTA Button */}
        <button
          onClick={handleGetInTouch}
          className="w-full flex items-center justify-center space-x-2 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white py-2 rounded-md transition-colors duration-300 font-medium"
        >
          <Phone className="h-4 w-4" />
          <span>Get In Touch</span>
        </button>
      </div>
    </div>
  );
};

export default PackageCard;
