// ============================================
// 🦶 FOOTER COMPONENT - PRODUCTION READY
// Mobile-First | Clean | Accessible
// ============================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Heart, 
  QrCode,
  ExternalLink,
  Github,
  Twitter,
  Linkedin
} from 'lucide-react';

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  // Quick Links Data

 const quickLinks = [
  { name: 'Browse Catalog', path: '/' },
  { name: 'Library Hours', path: '#hours' },
  { name: 'Contact Us', path: '#contact' }
];

  // Social Links (Optional - Add if university has)
  const socialLinks = [
    { name: 'GitHub', icon: Github, url: '#', show: false },
    { name: 'Twitter', icon: Twitter, url: '#', show: false },
    { name: 'LinkedIn', icon: Linkedin, url: '#', show: false }
  ];

  // Library Hours
  const libraryHours = [
    { days: 'Monday - Friday', hours: '8 AM - 10 PM', isOpen: true },
    { days: 'Saturday', hours: '9 AM - 6 PM', isOpen: true },
    { days: 'Sunday', hours: 'Closed', isOpen: false }
  ];

  // Handle navigation
  const handleNavigation = (path) => {
    if (path.startsWith('#')) {
      // Scroll to section
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Navigate to page
      navigate(path);
    }
  };

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white mt-12 md:mt-20 overflow-hidden">
      
      {/* Decorative Elements - Hidden on mobile for performance */}
      <div className="hidden md:block absolute top-0 left-0 w-72 h-72 bg-indigo-600 rounded-full filter blur-3xl opacity-10" aria-hidden="true" />
      <div className="hidden md:block absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-10" aria-hidden="true" />

      <div className="relative container-custom py-8 md:py-12 lg:py-16">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-8 md:mb-12">
          
          {/* About Section */}
          <div className="space-y-4 md:space-y-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 group focus-ring rounded-lg"
              aria-label="SmartLib home"
            >
              <div className="relative">
                <BookOpen className="h-8 w-8 md:h-10 md:w-10 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold group-hover:text-indigo-300 transition-colors">
                  SmartLib
                </h3>
                <p className="text-xs text-gray-400">Digital Catalog</p>
              </div>
            </button>
            
            <p className="text-sm md:text-base text-gray-300 leading-relaxed">
              Access 50,000+ books across 100+ departments. Scan the QR code outside our library for instant access.
            </p>
            
            {/* QR Access Card */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-indigo-400/30 transition-colors">
              <QrCode className="h-6 w-6 text-indigo-400 flex-shrink-0" aria-hidden="true" />
              <div>
                <p className="text-xs text-gray-400">Quick Access</p>
                <p className="text-sm font-semibold">Scan QR at Entrance</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-base md:text-lg font-bold flex items-center gap-2">
              <div className="w-1 h-5 md:h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" aria-hidden="true" />
              Quick Links
            </h3>
            <ul className="space-y-2 md:space-y-3" role="list">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <button 
                    onClick={() => handleNavigation(link.path)}
                    className="group flex items-center gap-3 text-gray-300 hover:text-white transition-colors focus-ring rounded-lg w-full text-left min-h-[44px] md:min-h-0"
                  >
                    <ExternalLink className="h-4 w-4 text-indigo-400 group-hover:text-indigo-300 transition-colors flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm md:text-base group-hover:translate-x-1 transition-transform">
                      {link.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 md:space-y-6">
            <h3 className="text-base md:text-lg font-bold flex items-center gap-2">
              <div className="w-1 h-5 md:h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" aria-hidden="true" />
              Contact Us
            </h3>
            <ul className="space-y-3 md:space-y-4" role="list">
              <li className="flex items-start gap-3 text-sm md:text-base">
                <MapPin className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-gray-300 font-medium">Library Building</p>
                  <p className="text-gray-400 text-sm">Central Campus, University</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm md:text-base min-h-[44px] md:min-h-0">
                <Phone className="h-5 w-5 text-purple-400 flex-shrink-0" aria-hidden="true" />
                <a 
                  href="tel:+1234567890" 
                  className="text-gray-300 hover:text-white transition-colors focus-ring rounded"
                  aria-label="Call library at (123) 456-7890"
                >
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm md:text-base min-h-[44px] md:min-h-0">
                <Mail className="h-5 w-5 text-purple-400 flex-shrink-0" aria-hidden="true" />
                <a 
                  href="mailto:library@university.edu" 
                  className="text-gray-300 hover:text-white transition-colors focus-ring rounded break-all"
                  aria-label="Email library at library@university.edu"
                >
                  library@university.edu
                </a>
              </li>
            </ul>
          </div>

          {/* Library Hours */}
          <div className="space-y-4 md:space-y-6" id="hours">
            <h3 className="text-base md:text-lg font-bold flex items-center gap-2">
              <div className="w-1 h-5 md:h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" aria-hidden="true" />
              Library Hours
            </h3>
            <ul className="space-y-2 md:space-y-3" role="list">
              {libraryHours.map((schedule, index) => (
                <li 
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-white/20 transition-colors"
                >
                  <span className="text-sm text-gray-300 font-medium">
                    {schedule.days}
                  </span>
                  <span className={`text-sm font-semibold ${
                    schedule.isOpen ? 'text-white' : 'text-red-400'
                  }`}>
                    {schedule.hours}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6 md:mb-8" aria-hidden="true" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
          
          {/* Copyright */}
          <p className="text-xs md:text-sm text-gray-400 text-center md:text-left">
            © {currentYear} University Library. All rights reserved.
          </p>

          {/* Social Links - Optional */}
          {socialLinks.some(link => link.show) && (
            <div className="flex items-center gap-4">
              {socialLinks.filter(link => link.show).map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-white transition-colors focus-ring rounded-lg"
                    aria-label={`Visit our ${social.name}`}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          )}

          {/* Made with Love */}
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-400">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" aria-hidden="true" />
            <span>for students</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;