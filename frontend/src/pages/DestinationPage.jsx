import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import DestinationNav from '../components/DestinationNav';
import PackageCard from '../components/PackageCard';
import Footer from '../components/Footer';
import { packagesAPI } from '../api/client';

const DestinationPage = () => {
  const { destinationId } = useParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        const data = await packagesAPI.getAll(destinationId);
        setPackages(data);
      } catch (err) {
        console.error('Error fetching packages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, [destinationId]);

  const destinationName = packages.length > 0 
    ? packages[0].category 
    : destinationId.charAt(0).toUpperCase() + destinationId.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DestinationNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {destinationName} Packages
        </h1>

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
            <p className="text-gray-600 text-lg">
              No packages available for {destinationName} at the moment.
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DestinationPage;
