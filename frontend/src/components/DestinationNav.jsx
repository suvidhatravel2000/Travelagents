import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Flame } from 'lucide-react';
import { destinationsAPI } from '../api/client';
import { useNavigate } from 'react-router-dom';

const DestinationNav = () => {
  const scrollContainerRef = useRef(null);
  const navigate = useNavigate();
  const [destinations, setDestinations] = useState([]);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const data = await destinationsAPI.getAll();
        setDestinations(data);
      } catch (err) {
        console.error('Error fetching destinations:', err);
      }
    };

    fetchDestinations();
  }, []);

  const scroll = (direction) => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleDestinationClick = (destination) => {
    if (destination.id === 'explore') {
      navigate('/');
    } else {
      navigate(`/destination/${destination.id}`);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Left Scroll Button */}
        <button
          onClick={() => scroll('left')}
          className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>

        {/* Destinations Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center space-x-6 overflow-x-auto scrollbar-hide py-4 md:px-12"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {destinations.map((destination) => (
            <button
              key={destination.id}
              onClick={() => handleDestinationClick(destination)}
              className="flex flex-col items-center min-w-fit group"
            >
              <div className="relative mb-2">
                <div className="w-12 h-12 flex items-center justify-center text-2xl">
                  {destination.icon}
                </div>
                {destination.trending && (
                  <Flame className="absolute -top-1 -right-1 h-5 w-5 text-orange-500" />
                )}
              </div>
              <span className="text-sm text-gray-700 group-hover:text-orange-500 transition-colors whitespace-nowrap">
                {destination.name}
              </span>
            </button>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={() => scroll('right')}
          className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:bg-gray-50"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default DestinationNav;
