/* @vitejs/plugin-react */
import React, { useState, useEffect } from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate
} from 'react-router-dom';
import { UNSAFE_enhanceManualRouteObjects } from '@remix-run/router';
import Registration from './Registration';
import Login from './Login';

// Import your components
// ...existing imports...

// Configure future flags for React Router v7 compatibility
const router = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
};

const App = () => {
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    // Listen for custom events to open modals
    const handleOpenRegisterModal = () => {
      setIsRegisterOpen(true);
      setIsLoginOpen(false);
    };

    const handleOpenLoginModal = () => {
      setIsLoginOpen(true);
      setIsRegisterOpen(false);
    };

    document.addEventListener('open-register-modal', handleOpenRegisterModal);
    document.addEventListener('open-login-modal', handleOpenLoginModal);

    return () => {
      document.removeEventListener('open-register-modal', handleOpenRegisterModal);
      document.removeEventListener('open-login-modal', handleOpenLoginModal);
    };
  }, []);

  return (
    <>
      <Registration
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
      <Login
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />

      <BrowserRouter future={router.future}>
        <Routes>
          {/* Your routes here */}
          {/* ...existing routes... */}
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
