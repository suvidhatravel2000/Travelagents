import React from 'react';
import Header from '../components/Header';
import DestinationNav from '../components/DestinationNav';
import SearchBar from '../components/SearchBar';
import HeroBanner from '../components/HeroBanner';
import PackageCard from '../components/PackageCard';
import Footer from '../components/Footer';
import { packages, heroBanners } from '../mockData';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const thailandPackages = packages.filter(pkg => pkg.destination === 'thailand');
  const ladakhPackages = packages.filter(pkg => pkg.destination === 'ladakh');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DestinationNav />
      <SearchBar />

      {/* Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <HeroBanner banner={heroBanners[0]} />
      </div>

      {/* Trending Destinations Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Trending Destinations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.slice(0, 3).map(pkg => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>
      </div>

      {/* Thailand Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Thailand</h2>
          <Link
            to="/destination/thailand"
            className="flex items-center text-orange-500 hover:text-orange-600 font-medium transition-colors group"
          >
            View All
            <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {thailandPackages.slice(0, 3).map(pkg => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>
      </div>

      {/* Ladakh Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <HeroBanner banner={heroBanners[1]} />
      </div>

      {/* Ladakh Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Ladakh</h2>
          <Link
            to="/destination/ladakh"
            className="flex items-center text-orange-500 hover:text-orange-600 font-medium transition-colors group"
          >
            View All
            <ChevronRight className="h-5 w-5 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ladakhPackages.map(pkg => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
