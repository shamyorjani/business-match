import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { logout, getUser } from '../../services/api';
import Login from '../../components/Login';
import Registration from '../../components/Registration';

const OrganizerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getUser();
        setUser(response.data);
      } catch (error) {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    window.location.reload(); // Reload to show dashboard
  };

  const handleRegistrationSuccess = () => {
    setIsRegistrationOpen(false);
    window.location.reload(); // Reload to show dashboard
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        {isRegistrationOpen ? (
          <Registration 
            isOpen={true} 
            onClose={() => setIsRegistrationOpen(false)}
            onSuccess={handleRegistrationSuccess}
          />
        ) : (
          <Login 
            isOpen={true} 
            onClose={() => {}}
            onSuccess={handleLoginSuccess}
            onRegisterClick={() => setIsRegistrationOpen(true)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#40033f] to-[#9c0c40] text-white p-4 md:py-6 shadow-md">
        <div className="container flex items-center justify-between mx-auto">
          <h1 className="text-xl font-bold md:text-2xl">Organizer Dashboard</h1>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-bold text-[#40033f] bg-white rounded-full hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="relative flex flex-1">
        {/* Sidebar */}
        <div className={`
          fixed md:static inset-y-0 left-0 z-20
          transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 transition-transform duration-300 ease-in-out
          w-64 bg-gradient-to-r from-[#40033f] to-[#9c0c40] shadow-lg flex flex-col`}
        >
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
        </div>

        {/* Main Content */}
        <div className="flex-1 p-2 overflow-auto bg-white md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
