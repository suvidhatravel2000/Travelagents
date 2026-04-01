import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  MapPin,
  Settings,
  LogOut,
  Layout,
  Image as ImageIcon,
  Type,
  Eye,
  EyeOff,
  Save,
  Plane,
  Globe
} from 'lucide-react';
import { packagesAPI, destinationsAPI, bannersAPI, settingsAPI, authAPI } from '../api/client';
import { cmsAPI } from '../api/cms';
import { useToast } from '../hooks/use-toast';

// Import sub-components
import PackagesManager from '../components/admin/PackagesManager';
import TopBarEditor from '../components/admin/TopBarEditor';
import BannersEditor from '../components/admin/BannersEditor';
import FooterEditor from '../components/admin/FooterEditor';
import SectionVisibilityControl from '../components/admin/SectionVisibilityControl';
import DestinationsEditor from '../components/admin/DestinationsEditor';
import TrendingPackagesEditor from '../components/admin/TrendingPackagesEditor';
import MediaGallery from '../components/admin/MediaGallery';
import IndiaHolidayEditor from '../components/admin/IndiaHolidayEditor';
import InternationalHolidayEditor from '../components/admin/InternationalHolidayEditor';

const AdminDashboardCMS = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [showMediaGallery, setShowMediaGallery] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    packages: 0,
    destinations: 0,
    banners: 0
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin');
    } else {
      fetchStats();
    }
  }, [navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const [packages, destinations, banners] = await Promise.all([
        packagesAPI.getAll(),
        destinationsAPI.getAll(),
        bannersAPI.getAll()
      ]);
      setStats({
        packages: packages.length,
        destinations: destinations.length,
        banners: banners.length
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
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

  const statCards = [
    { label: 'Total Packages', value: stats.packages, icon: Package, color: 'bg-blue-500' },
    { label: 'Destinations', value: stats.destinations, icon: MapPin, color: 'bg-green-500' },
    { label: 'Active Banners', value: stats.banners, icon: ImageIcon, color: 'bg-orange-500' },
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
      <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white flex flex-col z-50">
        <div className="p-6">
          <h2 className="text-2xl font-bold">CMS Panel</h2>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-6 space-y-1">
          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'overview' ? 'bg-orange-500' : 'hover:bg-gray-800'
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
            <span>Overview</span>
          </button>

          <div className="pt-4 pb-2">
            <p className="text-xs text-gray-400 uppercase font-semibold">Content Management</p>
          </div>
          
          <button
            onClick={() => setActiveTab('topbar')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'topbar' ? 'bg-orange-500' : 'hover:bg-gray-800'
            }`}
          >
            <Type className="h-5 w-5" />
            <span>Top Bar</span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'banners' ? 'bg-orange-500' : 'hover:bg-gray-800'
            }`}
          >
            <ImageIcon className="h-5 w-5" />
            <span>Banners</span>
          </button>
          
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
            <span>Destination Tabs</span>
          </button>

          <button
            onClick={() => setActiveTab('trending')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'trending' ? 'bg-orange-500' : 'hover:bg-gray-800'
            }`}
          >
            <Package className="h-5 w-5" />
            <span>Trending Packages</span>
          </button>

          <button
            onClick={() => setActiveTab('footer')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'footer' ? 'bg-orange-500' : 'hover:bg-gray-800'
            }`}
          >
            <Layout className="h-5 w-5" />
            <span>Footer</span>
          </button>

          <button
            onClick={() => setActiveTab('visibility')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'visibility' ? 'bg-orange-500' : 'hover:bg-gray-800'
            }`}
          >
            <Eye className="h-5 w-5" />
            <span>Section Visibility</span>
          </button>

          {/* India Holiday Page Button */}
          <button
            onClick={() => setActiveTab('india-holidays')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'india-holidays' ? 'bg-orange-500' : 'hover:bg-gray-800'
            }`}
          >
            <Plane className="h-5 w-5" />
            <span>🇮🇳 India Holidays</span>
          </button>

          {/* International Holiday Page Button */}
          <button
            onClick={() => setActiveTab('international-holidays')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'international-holidays' ? 'bg-orange-500' : 'hover:bg-gray-800'
            }`}
          >
            <Globe className="h-5 w-5" />
            <span>🌍 International Holidays</span>
          </button>

          {/* Media Gallery Button */}
          <button
            onClick={() => setShowMediaGallery(true)}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors hover:bg-gray-800 border border-gray-700 mt-2"
            style={{ zIndex: 10, position: 'relative', minHeight: '48px' }}
          >
            <ImageIcon className="h-5 w-5" />
            <span>📸 Media Gallery</span>
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

        {/* Logout Button - Fixed at bottom */}
        <div className="p-6 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors"
            style={{ zIndex: 5, position: 'relative' }}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {activeTab === 'overview' && 'Dashboard Overview'}
            {activeTab === 'topbar' && 'Top Bar Control'}
            {activeTab === 'banners' && 'Hero Banners'}
            {activeTab === 'packages' && 'Packages Management'}
            {activeTab === 'destinations' && 'Destination Tabs'}
            {activeTab === 'trending' && 'Trending Packages'}
            {activeTab === 'footer' && 'Footer Control'}
            {activeTab === 'visibility' && 'Section Visibility'}
            {activeTab === 'india-holidays' && 'India Holiday Page'}
            {activeTab === 'international-holidays' && 'International Holiday Page'}
            {activeTab === 'settings' && 'Company Settings'}
          </h1>
          <p className="text-gray-600 mt-1">Manage your website content and appearance</p>
        </div>

        {/* Stats - Overview Tab */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {statCards.map((stat, idx) => (
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

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('topbar')}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
                >
                  <Type className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Edit Top Bar</p>
                </button>
                <button
                  onClick={() => setActiveTab('banners')}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
                >
                  <ImageIcon className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Manage Banners</p>
                </button>
                <button
                  onClick={() => setActiveTab('packages')}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
                >
                  <Package className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Add Package</p>
                </button>
                <button
                  onClick={() => setActiveTab('visibility')}
                  className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
                >
                  <Eye className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <p className="text-sm font-medium">Toggle Sections</p>
                </button>
              </div>
            </div>
          </>
        )}

        {/* CMS Tabs */}
        {activeTab === 'topbar' && <TopBarEditor />}
        {activeTab === 'banners' && <BannersEditor />}
        {activeTab === 'packages' && <PackagesManager />}
        {activeTab === 'destinations' && <DestinationsEditor />}
        {activeTab === 'trending' && <TrendingPackagesEditor />}
        {activeTab === 'footer' && <FooterEditor />}
        {activeTab === 'visibility' && <SectionVisibilityControl />}
        {activeTab === 'india-holidays' && <IndiaHolidayEditor />}
        {activeTab === 'international-holidays' && <InternationalHolidayEditor />}

      {/* Media Gallery Modal */}
      {showMediaGallery && (
        <MediaGallery
          onSelectImage={(url) => {
            navigator.clipboard.writeText(url);
            alert('✅ Image URL copied to clipboard!');
            setShowMediaGallery(false);
          }}
          onClose={() => setShowMediaGallery(false)}
        />
      )}

        {activeTab === 'visibility' && <SectionVisibilityControl />}
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Company Settings</h2>
            <p className="text-gray-600">Manage company information and contact details</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardCMS;
