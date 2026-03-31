import React, { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { settingsAPI } from '../api/client';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [companyInfo, setCompanyInfo] = useState(null);

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
    return null;
  }
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-bold text-white mb-4">
              {companyInfo.name}
            </h3>
            <p className="text-gray-400 mb-4">
              Your trusted travel partner for creating unforgettable experiences across India and around the world.
            </p>
            <div className="flex flex-col space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-orange-500 flex-shrink-0 mt-1" />
                <span className="text-sm">{companyInfo.address}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-orange-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/destination/ladakh" className="hover:text-orange-500 transition-colors">
                  Ladakh
                </Link>
              </li>
              <li>
                <Link to="/destination/thailand" className="hover:text-orange-500 transition-colors">
                  Thailand
                </Link>
              </li>
              <li>
                <Link to="/destination/bali" className="hover:text-orange-500 transition-colors">
                  Bali
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-orange-500 transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Phone className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Phone</span>
                </div>
                {companyInfo.phones.map((phone, idx) => (
                  <a
                    key={idx}
                    href={`tel:${phone}`}
                    className="block text-sm hover:text-orange-500 transition-colors mb-1"
                  >
                    {phone}
                  </a>
                ))}
              </div>
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <Mail className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Email</span>
                </div>
                {companyInfo.emails.map((email, idx) => (
                  <a
                    key={idx}
                    href={`mailto:${email}`}
                    className="block text-sm hover:text-orange-500 transition-colors mb-1"
                  >
                    {email}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} {companyInfo.name}. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-sm hover:text-orange-500 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm hover:text-orange-500 transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
