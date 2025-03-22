import React, { useState } from 'react';
import { login } from '../services/api';

const Login = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await login(formData);

      setSuccess(true);
      // Clear the form
      setFormData({
        email: '',
        password: ''
      });

      // Close the modal after successful login
      setTimeout(() => {
        onClose();
        window.location.reload();
      }, 2000);

    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response && error.response.data.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Login failed. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg">

        <button onClick={onClose} className="modal-close">×</button>

        <h2 className="mb-4 text-2xl font-bold text-center text-[#40033f]">Sign In</h2>

        {success && (
          <div className="p-3 mb-4 text-sm text-green-800 bg-green-100 rounded">
            Login successful! Redirecting...
          </div>
        )}

        {errors.general && (
          <div className="p-3 mb-4 text-sm text-red-800 bg-red-100 rounded">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40033f]"
              required
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-600">{errors.email[0]}</p>
            )}
          </div>

          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#40033f]"
              required
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password[0]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 font-bold text-white rounded-md bg-gradient-to-r from-[#40033f] to-[#9c0c40] hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#40033f]"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onClose();
                // Add a small delay before opening registration modal
                setTimeout(() => {
                  document.dispatchEvent(new CustomEvent('open-register-modal'));
                }, 100);
              }}
              className="text-[#9c0c40] hover:underline"
            >
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
