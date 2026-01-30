import React from 'react';
import { BookOpen, Mail, Phone, MapPin, Github, Twitter, Linkedin, Heart } from 'lucide-react';

const AdminFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 group">
              <div className="relative">
                <BookOpen className="h-10 w-10 text-white transition-transform group-hover:scale-110 group-hover:rotate-6" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h3 className="text-xl font-bold">IES Library</h3>
                <p className="text-xs text-gray-300">Admin Portal</p>
              </div>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              Professional library management system for IES University. Manage, organize, and track your entire book catalog with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-full"></div>
              Quick Links
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/admin/dashboard" className="text-sm text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Dashboard
                </a>
              </li>
              <li>
                <a href="/admin/books" className="text-sm text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Manage Books
                </a>
              </li>
              <li>
                <a href="/admin/reports" className="text-sm text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Reports
                </a>
              </li>
              <li>
                <a href="/admin/settings" className="text-sm text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Settings
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-full"></div>
              Support
            </h4>
            <ul className="space-y-2">
              <li>
                <a href="/help" className="text-sm text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/documentation" className="text-sm text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Documentation
                </a>
              </li>
              <li>
                <a href="/api-docs" className="text-sm text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">
                  API Documentation
                </a>
              </li>
              <li>
                <a href="/contact" className="text-sm text-gray-300 hover:text-white hover:translate-x-1 transition-all inline-block">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <div className="w-1 h-5 bg-gradient-to-b from-indigo-400 to-purple-400 rounded-full"></div>
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-300">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0 text-indigo-400" />
                <span>IES University Campus<br/>Knowledge Park, Bhopal</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors">
                <Mail className="h-4 w-4 flex-shrink-0 text-indigo-400" />
                <a href="mailto:library@ies.edu">library@ies.edu</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition-colors">
                <Phone className="h-4 w-4 flex-shrink-0 text-indigo-400" />
                <a href="tel:+919876543210">+91 98765 43210</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-600 to-transparent"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Copyright */}
          <div className="text-sm text-gray-400 text-center md:text-left">
            <p className="flex items-center justify-center md:justify-start gap-1">
              © {currentYear} IES University Library. Made with 
              <Heart className="h-4 w-4 text-red-400 fill-red-400 animate-pulse" /> 
              by Library Team
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
            >
              <Github className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
            >
              <Twitter className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
            >
              <Linkedin className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
            </a>
          </div>

          {/* Admin Badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-gray-300">Admin Mode</span>
          </div>
        </div>
      </div>

      {/* Gradient Border Top */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
    </footer>
  );
};

export default AdminFooter;