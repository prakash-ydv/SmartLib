// ============================================
// 🎨 HERO COMPONENT - PRODUCTION READY
// Mobile-First | Optimized | Accessible
// ============================================

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, TrendingUp, Users, ArrowRight } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  // Stats data - Easy to update
  const stats = [
    { 
      icon: BookOpen, 
      label: 'Total Books', 
      value: '50,000+', 
      color: 'from-blue-400 to-cyan-400',
      ariaLabel: 'Total books available: 50,000 plus'
    },
    { 
      icon: Users, 
      label: 'Active Readers', 
      value: '5,000+', 
      color: 'from-purple-400 to-pink-400',
      ariaLabel: 'Active readers: 5,000 plus'
    },
    { 
      icon: TrendingUp, 
      label: 'Books Added', 
      value: '500+', 
      color: 'from-green-400 to-emerald-400',
      ariaLabel: 'Books added monthly: 500 plus'
    },
  ];

  // Navigation handlers
  const handleBrowseCatalog = () => {
    // Smooth scroll to catalog section
    const catalogSection = document.querySelector('.books-grid');
    if (catalogSection) {
      const headerOffset = 100;
      const elementPosition = catalogSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleHowItWorks = () => {
    // You can change this to navigate to a different page or scroll
    alert('How It Works section coming soon! 📚');
    // Or: navigate('/how-it-works');
  };

  return (
    <section 
      className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
      aria-label="Hero section"
    >
      {/* Animated Background - Optimized for mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="hero-blob hero-blob-1" />
        <div className="hero-blob hero-blob-2" />
        <div className="hero-blob hero-blob-3" />
      </div>

      <div className="relative container-custom py-12 sm:py-16 lg:py-20">
        <div className="text-center space-y-6 md:space-y-8">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-white/80 backdrop-blur-sm rounded-full border border-indigo-200 shadow-lg">
            <Sparkles 
              className="h-3.5 w-3.5 md:h-4 md:w-4 text-indigo-600" 
              aria-hidden="true"
            />
            <span className="text-xs md:text-sm font-semibold text-gray-700">
              University's Largest Digital Library
            </span>
          </div>

          {/* Main Heading */}
          <div className="space-y-3 md:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
              <span className="block text-gray-900 mb-2">
                Discover Your
              </span>
              <span className="block gradient-text">
                Next Great Read
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed px-4">
              Access 50,000+ books across 100+ departments. Simply scan the QR code 
              outside our library or browse online anytime, anywhere.
            </p>
          </div>

          {/* CTA Buttons - Touch Friendly */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 md:gap-4 px-4 sm:px-0">
            <button 
              onClick={handleBrowseCatalog}
              className="btn btn-primary group"
              aria-label="Browse book catalog"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Browse Catalog
                <ArrowRight 
                  className="h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" 
                  aria-hidden="true"
                />
              </span>
            </button>
            
            <button 
              onClick={handleHowItWorks}
              className="btn btn-secondary"
              aria-label="Learn how SmartLib works"
            >
              How It Works
            </button>
          </div>

          {/* Stats Grid - Mobile First */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto pt-8 md:pt-12 px-4">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="group relative bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 border border-gray-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                role="article"
                aria-label={stat.ariaLabel}
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-10 rounded-xl transition-opacity`} />
                <div className="relative space-y-2 md:space-y-3">
                  <div 
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center transform group-hover:scale-110 transition-transform`}
                    aria-hidden="true"
                  >
                    <stat.icon className="h-5 w-5 md:h-6 md:w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Bottom Wave - Decorative */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 120" 
          className="w-full h-auto" 
          preserveAspectRatio="none"
        >
          <path 
            fill="#ffffff" 
            fillOpacity="1" 
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z" 
          />
        </svg>
      </div>
    </section>
  );
};

export default Hero;