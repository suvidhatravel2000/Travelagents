import React from 'react';
import { Phone } from 'lucide-react';

const HeroBanner = ({ banner }) => {
  return (
    <div className="relative rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
      {/* Background Image */}
      <div className="relative h-96 md:h-[500px]">
        <img
          src={banner.image}
          alt={banner.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-8 w-full">
          <div className="max-w-2xl">
            {banner.subtitle && (
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-white/90 text-gray-800 px-4 py-1 rounded-full text-sm font-medium">
                  {banner.subtitle}
                </span>
              </div>
            )}

            <h2 className="text-5xl md:text-7xl font-bold text-yellow-400 mb-4 tracking-wider">
              {banner.title}
            </h2>

            {banner.description && (
              <div className="flex items-center space-x-2 mb-6">
                <span className="text-white text-lg font-medium">{banner.description}</span>
              </div>
            )}

            {banner.features && banner.features.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {banner.features.map((feature, idx) => (
                  <span key={idx} className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                    ✈️ {feature}
                  </span>
                ))}
              </div>
            )}

            {banner.price && (
              <div className="bg-white/95 rounded-lg p-6 inline-block mb-6">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-gray-600 text-sm mb-1">OFFER PRICE</p>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-4xl font-bold text-orange-500">₹{banner.price.toLocaleString('en-IN')}</span>
                      {banner.originalPrice && (
                        <span className="text-xl text-gray-500 line-through">₹{banner.originalPrice.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                    {banner.duration && (
                      <p className="text-gray-600 text-sm mt-1">{banner.duration}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
              {banner.ctaText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
