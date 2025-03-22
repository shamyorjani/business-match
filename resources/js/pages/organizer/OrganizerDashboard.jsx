import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const OrganizerDashboard = () => {
  // State to control sidebar visibility on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Toggle sidebar visibility
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Full-width header */}
      <div className="bg-gradient-to-r from-[#40033f] to-[#9c0c40] text-white p-4 md:py-6 shadow-md">
        <div className="container flex items-center justify-between mx-auto">
          <h1 className="text-xl font-bold md:text-2xl">Organizer Dashboard</h1>

          {/* Mobile menu button */}
          <button
            className="p-2 rounded-md md:hidden focus:outline-none focus:ring-2 focus:ring-white"
            onClick={toggleSidebar}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="relative flex flex-1">
        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Sidebar - hidden by default on mobile, shown when sidebarOpen is true */}
        <div className={`
          fixed md:static inset-y-0 left-0 z-20
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 transition-transform duration-300 ease-in-out
          w-64 bg-gradient-to-r from-[#40033f] to-[#9c0c40] shadow-lg flex flex-col`}
        >
          {/* Close button - only visible on mobile */}
          <button
            className="absolute p-2 text-white bg-white bg-opacity-25 rounded-full top-2 right-2 md:hidden"
            onClick={toggleSidebar}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Brand or Logo area */}
          <div className="p-4 border-b border-[#9c2b7a]">
            {/* Add logo or brand here if needed */}
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col p-2 space-y-1">
            <NavLink
              to="business-matching"
              className={({ isActive }) =>
                `py-3 px-4 rounded-md transition-all duration-200 flex items-center text-white text-sm hover:bg-opacity-80 ${isActive ? 'bg-[#6f0f55] font-medium shadow-sm' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-3">📊</span> Business Matching
            </NavLink>
            <NavLink
              to="hosted-buyer-program"
              className={({ isActive }) =>
                `py-3 px-4 rounded-md transition-all duration-200 flex items-center text-white text-sm hover:bg-opacity-80 ${isActive ? 'bg-[#6f0f55] font-medium shadow-sm' : ''}`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <span className="mr-3">👥</span> Hosted Buyer Program
            </NavLink>
          </div>

          {/* Footer area for sidebar */}
          <div className="mt-auto p-4 border-t border-[#9c2b7a] text-white text-xs opacity-70">
            © {new Date().getFullYear()} Business Matching
          </div>
        </div>

        {/* Main Content - takes full width on mobile, adjusted width on desktop */}
        <div className="flex-1 p-4 overflow-auto bg-white md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
