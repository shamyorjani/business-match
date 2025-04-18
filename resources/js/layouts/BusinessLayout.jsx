import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const Header = () => (
  <header className="bg-gradient-to-r from-[#40033f] to-[#9c0c40] text-white py-8 px-14">
    <div className="container flex items-center justify-between mx-auto">
      <div className="flex items-center">
        {/* Logo */}
        <img className='main-logo' src="/images/logo.svg" alt="My Image" />
      </div>

      {/* Sign In & Cart */}
      <div className="flex items-center space-x-4 font-cardo">
        {/* Navigation Links */}
        <nav className="hidden space-x-12 md:flex">
          <Link to="/" className="nav-menu">Home</Link>
          <Link to="#" className="nav-menu">Exhibitions</Link>
          <Link to="#" className="nav-menu">About us</Link>
          <Link to="#" className="nav-menu">Contact us</Link>
        </nav>
      </div>
    </div>
  </header>
);

const Footer = () => (
  <footer className="relative w-full mt-140">
    <img className="absolute bottom-[-160px] z-0 w-full" src="/images/first.svg" alt="" />
    <img className="absolute bottom-[-160px] z-0 w-full" src="/images/second.svg" alt="" />
    <img className='absolute bottom-0 w-full z-1' src="/images/last.svg" alt="" />
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
