import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { settingsAPI } from '../api/client';
import { cmsAPI } from '../api/cms';
import { holidayPagesAPI } from '../api/client';

const Header = () => {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [topBar, setTopBar] = useState(null);
  const [indiaConfig, setIndiaConfig] = useState(null);
  const [internationalConfig, setInternationalConfig] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [indiaHolidaysOpen, setIndiaHolidaysOpen] = useState(false);
  const [internationalHolidaysOpen, setInternationalHolidaysOpen] = useState(false);
  const [indiaTimeout, setIndiaTimeout] = useState(null);
  const [intlTimeout, setIntlTimeout] = useState(null);

  const handleIndiaEnter = () => {
    if (indiaTimeout) clearTimeout(indiaTimeout);
    setIndiaHolidaysOpen(true);
  };

  const handleIndiaLeave = () => {
    const timeout = setTimeout(() => setIndiaHolidaysOpen(false), 200);
    setIndiaTimeout(timeout);
  };

  const handleIntlEnter = () => {
    if (intlTimeout) clearTimeout(intlTimeout);
    setInternationalHolidaysOpen(true);
  };

  const handleIntlLeave = () => {
    const timeout = setTimeout(() => setInternationalHolidaysOpen(false), 200);
    setIntlTimeout(timeout);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [data, topBarData, indiaData, intlData] = await Promise.all([
          settingsAPI.get(),
          cmsAPI.getTopBar(),
          holidayPagesAPI.get('india'),
          holidayPagesAPI.get('international')
        ]);
        setCompanyInfo(data);
        setTopBar(topBarData);
        setIndiaConfig(indiaData);
        setInternationalConfig(intlData);
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };

    fetchSettings();
  }, []);

  if (!companyInfo) {
    return null;
  }

  // Get dropdown items for India Holidays
  const getIndiaDropdownItems = () => {
    if (!indiaConfig || !indiaConfig.tabs) return [];
    
    // If headerDropdown is configured and not empty, use it
    if (indiaConfig.headerDropdown && indiaConfig.headerDropdown.length > 0) {
      return indiaConfig.tabs
        .filter(tab => indiaConfig.headerDropdown.includes(tab.name) && tab.visible)
        .map(tab => ({ name: tab.name, icon: tab.icon }));
    }
    
    // Otherwise, show all visible tabs
    return indiaConfig.tabs
      .filter(tab => tab.visible)
      .map(tab => ({ name: tab.name, icon: tab.icon }));
  };

  // Get dropdown items for International Holidays
  const getInternationalDropdownItems = () => {
    if (!internationalConfig || !internationalConfig.tabs) return [];
    
    // If headerDropdown is configured and not empty, use it
    if (internationalConfig.headerDropdown && internationalConfig.headerDropdown.length > 0) {
      return internationalConfig.tabs
        .filter(tab => internationalConfig.headerDropdown.includes(tab.name) && tab.visible)
        .map(tab => ({ name: tab.name, icon: tab.icon }));
    }
    
    // Otherwise, show all visible tabs
    return internationalConfig.tabs
      .filter(tab => tab.visible)
      .map(tab => ({ name: tab.name, icon: tab.icon }));
  };

  const indiaDropdownItems = getIndiaDropdownItems();
  const internationalDropdownItems = getInternationalDropdownItems();

  // Helper function to convert destination name to URL slug
  const toSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <>
      {/* Top Announcement Bar */}
      {topBar && topBar.visible && (
        <div 
          className="text-center py-2 px-4 text-sm font-medium"
          style={{
            backgroundColor: topBar.backgroundColor,
            color: topBar.textColor,
            fontSize: topBar.fontSize
          }}
        >
          {topBar.text}
        </div>
      )}

      {/* Main Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                {companyInfo.name.toLowerCase()}
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {/* India Holidays Dropdown */}
              <div 
                className="relative"
                onMouseEnter={handleIndiaEnter}
                onMouseLeave={handleIndiaLeave}
              >
                <button className="flex items-center text-gray-700 hover:text-orange-500 transition-colors">
                  <Link to="/india-holidays" className="flex items-center">
                    India Holidays
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Link>
                </button>
                {indiaHolidaysOpen && indiaDropdownItems.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 border border-gray-100">
                    {indiaDropdownItems.map((item, index) => (
                      <Link 
                        key={index}
                        to={`/destination/${toSlug(item.name)}`} 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                      >
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* International Holidays Dropdown */}
              <div 
                className="relative"
                onMouseEnter={handleIntlEnter}
                onMouseLeave={handleIntlLeave}
              >
                <button className="flex items-center text-gray-700 hover:text-orange-500 transition-colors">
                  <Link to="/international-holidays" className="flex items-center">
                    International Holidays
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Link>
                </button>
                {internationalHolidaysOpen && internationalDropdownItems.length > 0 && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 border border-gray-100">
                    {internationalDropdownItems.map((item, index) => (
                      <Link 
                        key={index}
                        to={`/destination/${toSlug(item.name)}`} 
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                      >
                        {item.icon && <span className="mr-2">{item.icon}</span>}
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link to="/blog" className="text-gray-700 hover:text-orange-500 transition-colors">
                Blog
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-full hover:border-orange-500 transition-colors">
                <Search className="h-4 w-4 text-gray-600" />
                <span className="text-sm text-gray-700">Search</span>
              </button>
              <Link 
                to="/admin" 
                className="text-gray-700 hover:text-orange-500 transition-colors font-medium"
              >
                Login
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <Link to="/" className="block text-gray-700 hover:text-orange-500">
                India Holidays
              </Link>
              <Link to="/" className="block text-gray-700 hover:text-orange-500">
                International Holidays
              </Link>
              <Link to="/blog" className="block text-gray-700 hover:text-orange-500">
                Blog
              </Link>
              <Link to="/admin" className="block text-gray-700 hover:text-orange-500 font-medium">
                Login
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
