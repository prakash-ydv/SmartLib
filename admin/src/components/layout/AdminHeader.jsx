import React, { useState, useEffect } from 'react';
import { BookOpen, Menu, X, Bell, User, LogOut, Settings, Download, Plus } from 'lucide-react';

const AdminHeader = ({ onAddBook, onExportCSV, totalBooks = 0 }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

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
                Admin Dashboard • {totalBooks.toLocaleString()} Books
              </p>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            
            {/* Export CSV Button */}
            <button
              onClick={onExportCSV}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all font-medium ${
                scrolled 
                  ? 'text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 border-2 border-gray-200 hover:border-indigo-200' 
                  : 'text-white hover:bg-white/20 border-2 border-white/30'
              }`}
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>

            {/* Add Book Button */}
            <button
              onClick={onAddBook}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg transition-all font-medium shadow-lg ${
                scrolled 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700' 
                  : 'bg-white text-indigo-600 hover:bg-white/90'
              }`}
            >
              <Plus className="h-4 w-4" />
              <span>Add Book</span>
            </button>

            {/* Notifications */}
            <button className={`relative p-2.5 rounded-lg transition-all ${
              scrolled ? 'hover:bg-gray-100' : 'hover:bg-white/10'
            }`}>
              <Bell className={`h-5 w-5 ${scrolled ? 'text-gray-700' : 'text-white'}`} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* User Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                  scrolled 
                    ? 'hover:bg-gray-100 border-2 border-gray-200' 
                    : 'hover:bg-white/10 border-2 border-white/30'
                }`}
              >
                <div className={`p-1.5 rounded-full ${
                  scrolled ? 'bg-indigo-100' : 'bg-white/20'
                }`}>
                  <User className={`h-4 w-4 ${scrolled ? 'text-indigo-600' : 'text-white'}`} />
                </div>
                <div className="text-left hidden lg:block">
                  <p className={`text-sm font-semibold leading-tight ${
                    scrolled ? 'text-gray-900' : 'text-white'
                  }`}>
                    Admin User
                  </p>
                  <p className={`text-xs ${scrolled ? 'text-gray-600' : 'text-white/80'}`}>
                    Librarian
                  </p>
                </div>
              </button>

              {/* Profile Dropdown */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-in slide-in-from-top-2">
                  <div className="px-4 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-900">Admin User</p>
                    <p className="text-xs text-gray-600">admin@ieslibrary.edu</p>
                  </div>
                  
                  <div className="py-2">
                    <button className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-indigo-50 transition-colors flex items-center gap-3">
                      <Settings className="h-4 w-4 text-gray-500" />
                      Settings
                    </button>
                    <button className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3">
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

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
            <button
              onClick={() => {
                onAddBook();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add New Book
            </button>
            
            <button
              onClick={() => {
                onExportCSV();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>

            <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
              <Settings className="h-4 w-4" />
              Settings
            </button>

            <button className="w-full flex items-center gap-2 px-4 py-3 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-white transition-colors">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
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

export default AdminHeader;