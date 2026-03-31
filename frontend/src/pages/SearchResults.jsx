import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import DestinationNav from '../components/DestinationNav';
import PackageCard from '../components/PackageCard';
import Footer from '../components/Footer';
import { packagesAPI } from '../api/client';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const allPackages = await packagesAPI.getAll();
        
        // Filter packages based on search query
        const filtered = allPackages.filter(pkg => 
          pkg.title.toLowerCase().includes(query.toLowerCase()) ||
          pkg.category.toLowerCase().includes(query.toLowerCase()) ||
          pkg.destination.toLowerCase().includes(query.toLowerCase()) ||
          pkg.days.toLowerCase().includes(query.toLowerCase())
        );
        
        setPackages(filtered);
      } catch (err) {
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DestinationNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search Results for "{query}"
          </h1>
          <p className="text-gray-600">
            {loading ? 'Searching...' : `Found ${packages.length} package${packages.length !== 1 ? 's' : ''}`}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map(pkg => (
              <PackageCard key={pkg.id} package={pkg} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-4">
              No packages found matching your search.
            </p>
            <p className="text-gray-500">
              Try searching with different keywords or browse our destinations.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default SearchResults;
