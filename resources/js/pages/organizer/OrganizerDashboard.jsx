import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const OrganizerDashboard = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Full-width header */}
      <div className="header">
        <h1 className="header-title">Organizer Dashboard</h1>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="flex flex-col w-64 shadow-lg sidebar">
          {/* Brand or Logo area */}
          <div className="border-b border-[#9c2b7a]">

          </div>

          {/* Navigation Links */}
          <div className="flex flex-col p-2 space-y-1">
            <NavLink
              to="business-matching"
              className={({ isActive }) =>
                `py-3 px-4 rounded-md transition-all duration-200 flex items-center text-white text-sm hover:bg-opacity-80 ${isActive ? 'bg-[#6f0f55] font-medium shadow-sm' : ''}`
              }
            >
              <span className="mr-3">📊</span> Business Matching
            </NavLink>
            <NavLink
              to="hosted-buyer-program"
              className={({ isActive }) =>
                `py-3 px-4 rounded-md transition-all duration-200 flex items-center text-white text-sm hover:bg-opacity-80 ${isActive ? 'bg-[#6f0f55] font-medium shadow-sm' : ''}`
              }
            >
              <span className="mr-3">👥</span> Hosted Buyer Program
            </NavLink>
          </div>

          {/* Footer area for sidebar */}
          <div className="mt-auto p-4 border-t border-[#9c2b7a] text-white text-xs opacity-70">
            © 2023 Business Matching
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
