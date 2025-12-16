import React from 'react';
import { BookOpen, MapPin, Phone, Mail, Clock, ExternalLink, Heart, QrCode } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Library Hours', icon: Clock },
    { name: 'Issue & Return Policy', icon: BookOpen },
    { name: 'Digital Resources', icon: ExternalLink },
    { name: 'Faculty Publications', icon: BookOpen }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 text-white mt-20 overflow-hidden">
      
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-600 rounded-full filter blur-3xl opacity-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600 rounded-full filter blur-3xl opacity-10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* About Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <BookOpen className="h-10 w-10 text-indigo-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold">University Library</h3>
                <p className="text-xs text-gray-400">Digital Catalog System</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm">
              Access our comprehensive digital catalog with 50,000+ books across 100+ departments. 
              Scan the QR code outside the library for instant access.
            </p>
            <div className="flex items-center gap-3 px-4 py-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
              <QrCode className="h-6 w-6 text-indigo-400" />
              <div>
                <p className="text-xs text-gray-400">Quick Access</p>
                <p className="text-sm font-semibold">Scan QR at Library Entrance</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href="#" 
                    className="group flex items-center gap-3 text-gray-300 hover:text-white transition-colors"
                  >
                    <link.icon className="h-4 w-4 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                    <span className="text-sm group-hover:translate-x-1 transition-transform">
                      {link.name}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full"></div>
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-300">Library Building</p>
                  <p className="text-gray-400">Central Campus, University</p>
                </div>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="h-5 w-5 text-purple-400 flex-shrink-0" />
                <a href="tel:+1234567890" className="text-gray-300 hover:text-white transition-colors">
                  (123) 456-7890
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="h-5 w-5 text-purple-400 flex-shrink-0" />
                <a href="mailto:library@college.edu" className="text-gray-300 hover:text-white transition-colors">
                  library@college.edu
                </a>
              </li>
            </ul>
          </div>

          {/* Library Hours */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <div className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full"></div>
              Library Hours
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <span className="text-sm text-gray-300">Monday - Friday</span>
                <span className="text-sm font-semibold">8 AM - 10 PM</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <span className="text-sm text-gray-300">Saturday</span>
                <span className="text-sm font-semibold">9 AM - 6 PM</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10">
                <span className="text-sm text-gray-300">Sunday</span>
                <span className="text-sm font-semibold text-red-400">Closed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-gray-400 text-center md:text-left">
            © {currentYear} University Library. All rights reserved. • QR Access System v2.1
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
            <span>for students & faculty</span>
          </div>
        </div>

        {/* Version Badge */}
        <div className="mt-8 flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 backdrop-blur-sm border border-indigo-400/30 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-indigo-300">System Online • 50K+ Books Available</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;