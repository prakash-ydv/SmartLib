import React, { useState, useEffect } from 'react';
import { BookOpen, Menu, X, QrCode, Search, Bell } from 'lucide-react';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg' 
          : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Section */}
          <div className="flex items-center gap-4 group">
            <div className={`relative ${scrolled ? 'text-indigo-600' : 'text-white'}`}>
              <BookOpen className="h-10 w-10 transition-transform group-hover:scale-110 group-hover:rotate-6" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className={`text-2xl font-bold tracking-tight ${
                scrolled ? 'text-gray-900' : 'text-white'
              }`}>
                 IES University <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">Library</span>
              </h1>
              <p className={`text-xs ${scrolled ? 'text-gray-600' : 'text-white/80'}`}>
                Digital Catalog System • 50,000+ Books
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="/" className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              scrolled 
                ? 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50' 
                : 'text-white hover:bg-white/10'
            }`}>
              <Search className="h-4 w-4" />
              <span className="font-medium">Browse</span>
            </a>
            
            <div className={`flex items-center gap-3 px-5 py-2.5 rounded-full border-2 transition-all ${
              scrolled 
                ? 'border-indigo-200 bg-indigo-50' 
                : 'border-white/30 bg-white/10 backdrop-blur-sm'
            }`}>
              <QrCode className={`h-5 w-5 ${scrolled ? 'text-indigo-600' : 'text-white'}`} />
              <div className="text-left">
                <p className={`text-xs font-semibold ${scrolled ? 'text-indigo-600' : 'text-white'}`}>
                  Scan to Access
                </p>
                <p className={`text-[10px] ${scrolled ? 'text-gray-600' : 'text-white/80'}`}>
                  QR outside library
                </p>
              </div>
            </div>

            <button className="relative p-2 rounded-lg hover:bg-gray-100/10 transition-colors">
              <Bell className={`h-5 w-5 ${scrolled ? 'text-gray-700' : 'text-white'}`} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className={`h-6 w-6 ${scrolled ? 'text-gray-900' : 'text-white'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${scrolled ? 'text-gray-900' : 'text-white'}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2 animate-in slide-in-from-top">
            <a href="/" className="block px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
              <Search className="inline h-4 w-4 mr-2" />
              Browse Catalog
            </a>
            <div className="px-4 py-3 rounded-lg bg-white/10 text-white">
              <QrCode className="inline h-4 w-4 mr-2" />
              Scan QR Code Outside Library
            </div>
          </div>
        )}
      </div>

      {/* Animated Border Bottom */}
      <div className={`h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-opacity ${
        scrolled ? 'opacity-100' : 'opacity-0'
      }`}></div>
    </header>
  );
};

export default Header;