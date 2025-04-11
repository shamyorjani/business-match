import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-[#40033f] to-[#9c0c40] text-white py-8 px-4 md:px-14 relative">
      <div className="container flex items-center justify-between mx-auto">
        <div className="flex items-center">
          {/* Logo */}
          <img className='main-logo' src="/images/logo.svg" alt="My Image" />
        </div>

        {/* Hamburger Menu Button - Updated to use SVG */}
        <div className="md:hidden">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white focus:outline-none">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
            </svg>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-4 font-cardo">
          <nav className="flex flex-col sm:flex-row">
            <Link to="/" className="nav-menu text-white hover:text-pink-200 transition-colors duration-200 font-medium py-2 border-b-2 border-transparent hover:border-white">Home</Link>
            <Link to="#" className="nav-menu text-white hover:text-pink-200 transition-colors duration-200 font-medium py-2 border-b-2 border-transparent hover:border-white">Exhibitions</Link>
            <Link to="#" className="nav-menu text-white hover:text-pink-200 transition-colors duration-200 font-medium py-2 border-b-2 border-transparent hover:border-white">About us</Link>
            <Link to="#" className="nav-menu text-white hover:text-pink-200 transition-colors duration-200 font-medium py-2 border-b-2 border-transparent hover:border-white">Contact us</Link>
          </nav>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-r from-[#40033f] to-[#9c0c40] z-50 py-4 px-4 shadow-lg">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="text-white py-3 px-4 border-b border-white/20 hover:bg-white/10 rounded-lg flex items-center" onClick={() => setIsMenuOpen(false)}>
              <span className="mr-2">🏠</span> Home
            </Link>
            <Link to="#" className="text-white py-3 px-4 border-b border-white/20 hover:bg-white/10 rounded-lg flex items-center" onClick={() => setIsMenuOpen(false)}>
              <span className="mr-2">🎪</span> Exhibitions
            </Link>
            <Link to="#" className="text-white py-3 px-4 border-b border-white/20 hover:bg-white/10 rounded-lg flex items-center" onClick={() => setIsMenuOpen(false)}>
              <span className="mr-2">ℹ️</span> About us
            </Link>
            <Link to="#" className="text-white py-3 px-4 hover:bg-white/10 rounded-lg flex items-center" onClick={() => setIsMenuOpen(false)}>
              <span className="mr-2">📞</span> Contact us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

const Footer = () => (
    <footer className="py-10 text-center text-gray-600 bg-gray-100 mt-auto">
        <div className="container mx-auto px-4">
            <div className="flex flex-col items-center">
                <img className="w-32 mb-6" src="/images/logo.svg" alt="IBE Logo" />
                <p className="mb-4">© {new Date().getFullYear()} IBE - International Beauty Expo. All rights reserved.</p>
                <div className="flex space-x-6 mt-2">
                    <a href="#" className="text-gray-500 hover:text-[#40033f]">Privacy Policy</a>
                    <a href="#" className="text-gray-500 hover:text-[#40033f]">Terms & Conditions</a>
                    <a href="#" className="text-gray-500 hover:text-[#40033f]">Contact Us</a>
                </div>
            </div>
        </div>
    </footer>
);

const BusinessLayout = () => {
  return (
    <div className="flex flex-col min-h-screen business-layout">
      <Header />

      {/* Content area for business pages */}
      <main className="flex-grow business-content">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default BusinessLayout;
