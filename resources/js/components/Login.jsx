import React, { useState } from 'react';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = ({ isOpen, onClose, onLoginSuccess, onRegisterClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login({ email, password });
      if (response.data.token) {
        onLoginSuccess(response.data.token);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        setError('Invalid email or password');
      } else {
        setError('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClose}></div>
      <div className="relative z-10 w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#40033f]">Login</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40033f]"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40033f]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 text-white bg-[#40033f] rounded-md hover:bg-[#6f0f55] focus:outline-none focus:ring-2 focus:ring-[#40033f] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Logging in...
              </div>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          {/* <p className="mb-2 text-base text-gray-700">Don't have an account?</p>
          <button
            onClick={onRegisterClick}
            className="w-full py-2 text-sm font-medium text-white bg-[#9c0c40] rounded-md hover:bg-[#40033f] transition-colors duration-200"
          >
            Register Now
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
