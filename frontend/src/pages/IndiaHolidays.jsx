import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Star, Calendar, MapPin, ArrowRight, Filter } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { holidayPagesAPI, packagesAPI } from '../api/client';
import { Helmet } from 'react-helmet-async';

const IndiaHolidays = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState(null);
  const [allPackages, setAllPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [trendingPackages, setTrendingPackages] = useState([]);
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterPackages();
  }, [selectedTab, searchQuery, allPackages]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pageConfig, packages] = await Promise.all([
        holidayPagesAPI.get('india'),
        packagesAPI.getAll()
      ]);
      
      setConfig(pageConfig);
      
      // Filter packages by region
      const indiaPackages = packages.filter(pkg => 
        pkg.region === 'india' || pkg.region === 'both'
      );
      setAllPackages(indiaPackages);
      
      // Get trending packages
      if (pageConfig.trending.enabled && pageConfig.trending.packageIds.length > 0) {
        const trending = indiaPackages.filter(pkg => 
          pageConfig.trending.packageIds.includes(pkg.id)
        ).slice(0, pageConfig.trending.displayCount);
        setTrendingPackages(trending);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPackages = () => {
    let filtered = [...allPackages];

    // Filter by tab (destination)
    if (selectedTab !== 'all') {
      const selectedTabConfig = config?.tabs.find(t => t.id === selectedTab);
      if (selectedTabConfig) {
        filtered = filtered.filter(pkg => 
          pkg.destination?.toLowerCase().includes(selectedTabConfig.name.toLowerCase()) ||
          pkg.category?.toLowerCase().includes(selectedTabConfig.name.toLowerCase())
        );
      }
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(pkg =>
        pkg.title?.toLowerCase().includes(query) ||
        pkg.destination?.toLowerCase().includes(query) ||
        pkg.category?.toLowerCase().includes(query)
      );
    }

    setFilteredPackages(filtered);
  };

  const handlePackageClick = (packageId) => {
    navigate(`/package/${packageId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading India Holidays...</p>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Failed to load page configuration</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>{`${config.seo_title || 'India Holidays'} — Suvidha Travel`}</title>
        {config.seo_description && <meta name="description" content={config.seo_description} />}
        {config.focus_keyword && <meta name="keywords" content={config.focus_keyword} />}
      </Helmet>
      <Header />
      <div className="relative h-[500px] bg-gray-900">
        <img
          src={config.banner.desktopImage}
          alt={config.banner.title}
          className="hidden md:block w-full h-full object-cover"
        />
        <img
          src={config.banner.mobileImage || config.banner.desktopImage}
          alt={config.banner.title}
          className="md:hidden w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div 
          className="absolute inset-0 bg-black"
          style={{ opacity: config.banner.overlayOpacity }}
        ></div>

        {/* Content */}
        <div 
          className={`absolute inset-0 flex items-center justify-center text-${config.banner.textAlign}`}
        >
          <div className="max-w-4xl px-4">
            <h1 
              className="text-4xl md:text-6xl font-bold mb-4"
              style={{ color: config.banner.textColor }}
            >
              {config.banner.title}
            </h1>
            {config.banner.subtitle && (
              <p 
                className="text-xl md:text-2xl mb-8"
                style={{ color: config.banner.textColor }}
              >
                {config.banner.subtitle}
              </p>
            )}
            {config.banner.buttonText && (
              <a
                href={config.banner.buttonLink}
                className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                <span>{config.banner.buttonText}</span>
                <ArrowRight className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Destination Tabs */}
        {config.tabs && config.tabs.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-4 overflow-x-auto pb-4">
              <button
                onClick={() => setSelectedTab('all')}
                className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedTab === 'all'
                    ? 'bg-orange-500 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border'
                }`}
              >
                <span>All Destinations</span>
              </button>
              
              {config.tabs.filter(tab => tab.visible).map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedTab === tab.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border'
                  }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Bar */}
        {config.search.enabled && (
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={config.search.placeholder}
                className="w-full pl-12 pr-4 py-4 border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        )}

        {/* Trending Packages Section */}
        {config.trending.enabled && trendingPackages.length > 0 && (
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {config.trending.title}
              </h2>
              {config.trending.subtitle && (
                <p className="text-gray-600">{config.trending.subtitle}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingPackages.map(pkg => (
                <div
                  key={pkg.id}
                  onClick={() => handlePackageClick(pkg.id)}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-current" />
                      <span>Trending</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {pkg.title}
                    </h3>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{pkg.category}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{pkg.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-orange-500">
                          ₹{pkg.price?.toLocaleString()}
                        </span>
                        {pkg.originalPrice > pkg.price && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ₹{pkg.originalPrice?.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-orange-500 font-medium">
                        View Details
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Packages Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedTab === 'all' 
                ? 'All India Packages' 
                : `${config.tabs.find(t => t.id === selectedTab)?.name} Packages`
              }
            </h2>
            <div className="text-gray-600">
              {filteredPackages.length} packages found
            </div>
          </div>

          {filteredPackages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPackages.map(pkg => (
                <div
                  key={pkg.id}
                  onClick={() => handlePackageClick(pkg.id)}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer group"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={pkg.image}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {pkg.rating > 0 && (
                      <div className="absolute top-4 left-4 bg-white px-2 py-1 rounded flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold">{pkg.rating}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                      {pkg.title}
                    </h3>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{pkg.category}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{pkg.duration}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-orange-500">
                          ₹{pkg.price?.toLocaleString()}
                        </span>
                        {pkg.originalPrice > pkg.price && (
                          <span className="ml-2 text-sm text-gray-500 line-through">
                            ₹{pkg.originalPrice?.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-orange-500 font-medium group-hover:translate-x-1 transition-transform">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Filter className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No packages found</h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? `No packages match "${searchQuery}"`
                  : 'No packages available for the selected destination'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default IndiaHolidays;
