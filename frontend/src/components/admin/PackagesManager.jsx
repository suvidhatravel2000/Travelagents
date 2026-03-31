// Placeholder for packages manager - reusing existing functionality
import React from 'react';

const PackagesManager = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Packages Manager</h2>
      <p className="text-gray-600">Use the old admin dashboard for full package management.</p>
      <a href="/admin/dashboard" className="text-orange-500 hover:text-orange-600 underline">
        Go to Package Manager →
      </a>
    </div>
  );
};

export default PackagesManager;
