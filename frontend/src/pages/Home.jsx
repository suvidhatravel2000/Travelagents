import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import DestinationNav from '../components/DestinationNav';
import SearchBar from '../components/SearchBar';
import HeroBanner from '../components/HeroBanner';
import PackageCard from '../components/PackageCard';
import Footer from '../components/Footer';
import { packagesAPI, bannersAPI } from '../api/client';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const [packages, setPackages] = useState([]);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const packagesPerPage = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [packagesData, bannersData] = await Promise.all([
          packagesAPI.getAll(),
          bannersAPI.getAll()
        ]);
        setPackages(packagesData);
        setBanners(bannersData);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <DestinationNav />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <DestinationNav />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const thailandPackages = packages.filter(pkg => pkg.destination === 'thailand');
  const ladakhPackages = packages.filter(pkg => pkg.destination === 'ladakh');
  
  // Pagination for trending destinations
  const indexOfLastPackage = currentPage * packagesPerPage;
  const indexOfFirstPackage = indexOfLastPackage - packagesPerPage;
  const currentTrendingPackages = packages.slice(indexOfFirstPackage, indexOfLastPackage);
  const totalPages = Math.ceil(packages.length / packagesPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DestinationNav />
      <SearchBar />

      {/* Hero Banner */}
      {banners.length > 0 && banners[0] && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <HeroBanner banner={banners[0]} />
        </div>
      )}

      {/* Trending Destinations Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Trending Destinations</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentTrendingPackages.map(pkg => (
            <PackageCard key={pkg.id} package={pkg} />
          ))}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Thailand Section */}
      {thailandPackages.length > 0 && (
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
      )}

      {/* Ladakh Banner */}
      {banners.length > 1 && banners[1] && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
          <HeroBanner banner={banners[1]} />
        </div>
      )}

      {/* Ladakh Section */}
      {ladakhPackages.length > 0 && (
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
      )}

      <Footer />
    </div>
  );
};

export default Home;
