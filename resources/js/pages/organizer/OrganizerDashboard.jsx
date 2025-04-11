import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import Login from '../../components/Login';

const OrganizerDashboard = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogin = () => {
    setIsLoginOpen(true);
    setError('');
  };

  const handleLogout = () => {
    try {
      setIsLoading(true);
      setIsAuthenticated(false);
      localStorage.removeItem('authToken');
      setIsLoginOpen(true);
      navigate('/');
    } catch (err) {
      setError('Error during logout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginSuccess = (token) => {
    try {
      setIsLoading(true);
      setIsAuthenticated(true);
      setIsLoginOpen(false);
      localStorage.setItem('authToken', token);
      setError('');
      navigate('/dashboard');
    } catch (err) {
      setError('Error during login. Please try again.');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginError = (errorMessage) => {
    setError(errorMessage || 'An error occurred during login. Please try again.');
  };

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // You might want to verify the token with your backend here
          setIsAuthenticated(true);
          setIsLoginOpen(false);
        }
      } catch (err) {
        setError('Error checking authentication status');
        setIsAuthenticated(false);
        setIsLoginOpen(true);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="flex flex-col h-screen">
      {/* Full-width header, only shown when authenticated */}
      {isAuthenticated && (
        <div className="bg-gradient-to-r from-[#40033f] to-[#9c0c40] text-white p-4 md:py-6 shadow-md">
          <div className="container flex items-center justify-between mx-auto">
            <h1 className="text-xl font-bold md:text-2xl">Organizer Dashboard</h1>

            {/* Logout Button */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-transparent border border-white rounded-md hover:bg-white hover:text-[#40033f] transition-colors duration-200 disabled:opacity-50"
              >
                {isLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>

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
      )}

      {/* Login Modal */}
      <div className={`fixed inset-0 z-50 ${(!isAuthenticated || isLoginOpen) ? 'block' : 'hidden'}`}>
        <div className="absolute inset-0 bg-black opacity-90"></div>
        <div className="relative flex items-center justify-center min-h-screen p-4">
          {isLoginOpen && !isAuthenticated && (
            <Login 
              isOpen={isLoginOpen} 
              onClose={() => {
                if (!isAuthenticated) {
                  navigate('/');
                } else {
                  setIsLoginOpen(false);
                }
              }}
              onLoginSuccess={handleLoginSuccess}
              onError={handleLoginError}
            />
          )}
        </div>
      </div>

      {/* Dashboard Content - Only shown when authenticated */}
      {isAuthenticated && (
        <div className="relative flex flex-1">
          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden"
              onClick={toggleSidebar}
            ></div>
          )}

          {/* Sidebar */}
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

          {/* Main Content */}
          <div className="flex-1 p-2 overflow-auto bg-white md:p-6">
            <Outlet />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganizerDashboard;
