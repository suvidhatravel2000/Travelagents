import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import DestinationNav from '../components/DestinationNav';
import PackageCard from '../components/PackageCard';
import Footer from '../components/Footer';
import { packages } from '../mockData';

const DestinationPage = () => {
  const { destinationId } = useParams();
  
  const destinationPackages = packages.filter(pkg => pkg.destination === destinationId);
  const destinationName = destinationPackages.length > 0 
    ? destinationPackages[0].category 
    : destinationId.charAt(0).toUpperCase() + destinationId.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <DestinationNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {destinationName} Packages
        </h1>

        {destinationPackages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinationPackages.map(pkg => (
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
