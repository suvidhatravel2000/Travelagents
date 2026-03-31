import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu, X, ChevronDown } from 'lucide-react';
import { settingsAPI } from '../api/client';

const Header = () => {
  const [companyInfo, setCompanyInfo] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [indiaHolidaysOpen, setIndiaHolidaysOpen] = useState(false);
  const [internationalHolidaysOpen, setInternationalHolidaysOpen] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await settingsAPI.get();
        setCompanyInfo(data);
      } catch (err) {
        console.error('Error fetching settings:', err);
      }
    };

    fetchSettings();
  }, []);

  if (!companyInfo) {
    return null; // Or a loading skeleton
  }

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-2 px-4 text-sm font-medium">
        Contact No: {companyInfo.phones.join(' | ')} &nbsp;&nbsp;|&nbsp;&nbsp; Email: {companyInfo.emails[0]}
      </div>

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
                onMouseEnter={() => setIndiaHolidaysOpen(true)}
                onMouseLeave={() => setIndiaHolidaysOpen(false)}
              >
                <button className="flex items-center text-gray-700 hover:text-orange-500 transition-colors">
                  India Holidays
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {indiaHolidaysOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 border border-gray-100">
                    <Link to="/destination/ladakh" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500">
                      Ladakh
                    </Link>
                    <Link to="/destination/himachal" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500">
                      Himachal
                    </Link>
                    <Link to="/destination/chardham" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500">
                      Chardham
                    </Link>
                    <Link to="/destination/north-east" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500">
                      North East
                    </Link>
                  </div>
                )}
              </div>

              {/* International Holidays Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setInternationalHolidaysOpen(true)}
                onMouseLeave={() => setInternationalHolidaysOpen(false)}
              >
                <button className="flex items-center text-gray-700 hover:text-orange-500 transition-colors">
                  International Holidays
                  <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                {internationalHolidaysOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 border border-gray-100">
                    <Link to="/destination/thailand" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500">
                      Thailand
                    </Link>
                    <Link to="/destination/bali" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500">
                      Bali
                    </Link>
                    <Link to="/destination/singapore" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500">
                      Singapore
                    </Link>
                    <Link to="/destination/maldives" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500">
                      Maldives
                    </Link>
                    <Link to="/destination/malaysia" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500">
                      Malaysia
                    </Link>
                    <Link to="/destination/sri-lanka" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500">
                      Sri Lanka
                    </Link>
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
