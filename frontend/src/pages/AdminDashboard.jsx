import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  MapPin,
  Settings,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Search
} from 'lucide-react';
import { packagesAPI, destinationsAPI, settingsAPI, authAPI } from '../api/client';
import { useToast } from '../hooks/use-toast';
import EnhancedPackageModal from '../components/admin/EnhancedPackageModal';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('packages');
  const [packages, setPackages] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [settings, setSettings] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin');
    } else {
      fetchData();
    }
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [packagesData, destinationsData, settingsData] = await Promise.all([
        packagesAPI.getAll(),
        destinationsAPI.getAll(),
        settingsAPI.get()
      ]);
      setPackages(packagesData);
      setDestinations(destinationsData);
      setSettings(settingsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminUser');
    navigate('/admin');
  };

  const handleDeletePackage = async (id) => {
    if (window.confirm('Are you sure you want to delete this package?')) {
      try {
        await packagesAPI.delete(id);
        setPackages(packages.filter(pkg => pkg.id !== id));
        toast({
          title: "Success",
          description: "Package deleted successfully"
        });
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to delete package",
          variant: "destructive"
        });
      }
    }
  };

  const handleSavePackage = async (packageData) => {
    try {
      if (editingPackage) {
        const updated = await packagesAPI.update(editingPackage.id, packageData);
        setPackages(packages.map(pkg => pkg.id === editingPackage.id ? updated : pkg));
        toast({
          title: "Success",
          description: "Package updated successfully"
        });
      } else {
        const newPackage = await packagesAPI.create(packageData);
        setPackages([...packages, newPackage]);
        toast({
          title: "Success",
          description: "Package created successfully"
        });
      }
      setShowAddModal(false);
      setEditingPackage(null);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to save package",
        variant: "destructive"
      });
    }
  };

  const handleUpdateSettings = async (updatedSettings) => {
    try {
      const updated = await settingsAPI.update(updatedSettings);
      setSettings(updated);
      toast({
        title: "Success",
        description: "Settings updated successfully"
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive"
      });
    }
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPackages = filteredPackages.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPackages.length / itemsPerPage);

  const stats = [
    { label: 'Total Packages', value: packages.length, icon: Package, color: 'bg-blue-500' },
    { label: 'Destinations', value: destinations.length, icon: MapPin, color: 'bg-green-500' },
    { label: 'Active Tours', value: packages.filter(p => p.groupTour).length, icon: LayoutDashboard, color: 'bg-orange-500' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-6 z-50">
        <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
        
        <nav className="space-y-2">
          <button
            onClick={() => setActiveTab('packages')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'packages' ? 'bg-orange-500' : 'hover:bg-gray-800'
            }`}
          >
            <Package className="h-5 w-5" />
            <span>Packages</span>
          </button>
          
          <button
            onClick={() => setActiveTab('destinations')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'destinations' ? 'bg-orange-500' : 'hover:bg-gray-800'
            }`}
          >
            <MapPin className="h-5 w-5" />
            <span>Destinations</span>
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'settings' ? 'bg-orange-500' : 'hover:bg-gray-800'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="absolute bottom-6 left-6 right-6 flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your travel packages and destinations</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} rounded-lg p-3`}>
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Packages Management */}
        {activeTab === 'packages' && (
          <PackagesTab
            packages={currentPackages}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onDelete={handleDeletePackage}
            onEdit={(pkg) => {
              setEditingPackage(pkg);
              setShowAddModal(true);
            }}
            onAdd={() => {
              setEditingPackage(null);
              setShowAddModal(true);
            }}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}

        {/* Destinations Tab */}
        {activeTab === 'destinations' && (
          <DestinationsTab destinations={destinations} />
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && settings && (
          <SettingsTab settings={settings} onUpdate={handleUpdateSettings} />
        )}
      </div>

      {/* Add/Edit Package Modal */}
      {showAddModal && (
        <EnhancedPackageModal
          package={editingPackage}
          destinations={destinations}
          onSave={handleSavePackage}
          onClose={() => {
            setShowAddModal(false);
            setEditingPackage(null);
          }}
        />
      )}
    </div>
  );
};

// Packages Tab Component
const PackagesTab = ({ packages, searchQuery, setSearchQuery, onDelete, onEdit, onAdd, currentPage, totalPages, onPageChange }) => (
  <div className="bg-white rounded-lg shadow">
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Manage Packages</h2>
        <button
          onClick={onAdd}
          className="flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Package</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search packages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
    </div>

    {/* Packages Table */}
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Package
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Destination
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Duration
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Rating
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {packages.map((pkg) => (
            <tr key={pkg.id} className="hover:bg-gray-50">
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <img src={pkg.image} alt={pkg.title} className="h-12 w-12 rounded object-cover" />
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 line-clamp-1">{pkg.title}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                  {pkg.category}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {pkg.duration}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                ₹{pkg.price.toLocaleString('en-IN')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ⭐ {pkg.rating || 'N/A'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  onClick={() => onEdit(pkg)}
                  className="text-blue-600 hover:text-blue-900 mr-4"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(pkg.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Pagination */}
    {totalPages > 1 && (
      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>
    )}
  </div>
);

// Destinations Tab Component
const DestinationsTab = ({ destinations }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-6">Manage Destinations</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {destinations.map((dest) => (
        <div key={dest.id} className="border border-gray-200 rounded-lg p-4 hover:border-orange-500 transition-colors">
          <div className="text-3xl mb-2">{dest.icon}</div>
          <div className="font-medium text-gray-900">{dest.name}</div>
          {dest.trending && (
            <span className="text-xs text-orange-500 font-medium">🔥 Trending</span>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Settings Tab Component
const SettingsTab = ({ settings, onUpdate }) => {
  const [formData, setFormData] = useState(settings);

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contact Numbers (comma-separated)</label>
          <input
            type="text"
            value={formData.phones.join(', ')}
            onChange={(e) => setFormData({...formData, phones: e.target.value.split(',').map(p => p.trim())})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email Addresses (comma-separated)</label>
          <input
            type="text"
            value={formData.emails.join(', ')}
            onChange={(e) => setFormData({...formData, emails: e.target.value.split(',').map(e => e.trim())})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <textarea
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default AdminDashboard;
