import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const BusinessMatchingForm = () => {

  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    email: '',
    phoneNumber: '',
    companyName: '',
    companyNature: '',
    companySize: ''
  });


    const handleNext = () => {
        navigate("/company");
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here
    console.log(formData);
  };

  return (
    <div className="form-container">
      {/* Header */}
      <div className="header">
        <h1 className="header-title">Business Matching Registration and Form Submission</h1>
      </div>

      {/* Form Content */}
      <div className="p-6 bg-white">
        {/* Step Indicator */}
        <div className="mb-8">
          <h2 className="step-indicator">STEP 1</h2>
          <div className="flex">
            <svg width="326" height="34" viewBox="0 0 400 40">
              <polygon points="240,0 340,0 360,20 340,40 240,40 260,20" fill="#E5E7EB" />
              <polygon points="120,0 220,0 240,20 220,40 120,40 140,20" fill="#E5E7EB" />
              <polygon points="0,0 100,0 120,20 100,40 0,40" fill="#581C87" />
            </svg>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="form-label">Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="E.g. John Doe"
                className="form-input"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* Designation */}
            <div>
              <label htmlFor="designation" className="form-label">Designation:</label>
              <input
                type="text"
                id="designation"
                name="designation"
                placeholder="E.g. CEO"
                className="form-input"
                value={formData.designation}
                onChange={handleChange}
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="E.g. john@xyz.com"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-gray-800 font-medium mb-2">Phone Number:</label>
              <div className="flex">
                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-l px-2">
                  <div className="w-6 h-4 mr-1 flex items-center justify-center overflow-hidden">
                    {/* Malaysia flag - simplified version */}
                    <div className="w-full h-full relative bg-blue-600 flex flex-col">
                      <div className="w-full h-1/2 bg-red-600"></div>
                      <div className="absolute top-0 left-0 w-1/3 h-full bg-blue-900 flex items-center justify-center">
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <span className="text-sm">+60</span>
                </div>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  placeholder="E.g. 123456789"
                  className="flex-1 border border-gray-200 rounded-r p-2 focus:outline-none focus:border-purple-500"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="form-label">Company Name:</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                placeholder="E.g. XZ Sdn Bhd."
                className="form-input"
                value={formData.companyName}
                onChange={handleChange}
              />
            </div>

            {/* Company Nature */}
            <div>
              <label htmlFor="companyNature" className="form-label">Company Nature of Business:</label>
              <input
                type="text"
                id="companyNature"
                name="companyNature"
                placeholder="E.g. E-Commerce, Distributor"
                className="form-input"
                value={formData.companyNature}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Company Size */}
          <div className="mt-6">
            <label className="form-label">Company Size (People):</label>
            <div className="flex flex-wrap gap-x-8">
              <div className="radio-container">
                <input
                  type="radio"
                  id="size1"
                  name="companySize"
                  value="1-10"
                  checked={formData.companySize === '1-10'}
                  onChange={handleChange}
                  className="radio-input"
                />
                <label htmlFor="size1" className="radio-label">1-10</label>
              </div>
              <div className="radio-container">
                <input
                  type="radio"
                  id="size2"
                  name="companySize"
                  value="11-50"
                  checked={formData.companySize === '11-50'}
                  onChange={handleChange}
                  className="radio-input"
                />
                <label htmlFor="size2" className="radio-label">11-50</label>
              </div>
              <div className="radio-container">
                <input
                  type="radio"
                  id="size3"
                  name="companySize"
                  value="51-100"
                  checked={formData.companySize === '51-100'}
                  onChange={handleChange}
                  className="radio-input"
                />
                <label htmlFor="size3" className="radio-label">51-100</label>
              </div>
              <div className="radio-container">
                <input
                  type="radio"
                  id="size4"
                  name="companySize"
                  value="101 and above"
                  checked={formData.companySize === '101 and above'}
                  onChange={handleChange}
                  className="radio-input"
                />
                <label htmlFor="size4" className="radio-label">101 and above</label>
              </div>
            </div>
          </div>

          {/* Required Fields Note */}
          <div className="mt-6 text-red-600 text-sm">*All fields are required to fill</div>

          {/* Next Button */}
          <div className="mt-6 flex justify-end">
            <button onClick={handleNext} type="submit" className="primary-btn">Next</button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default BusinessMatchingForm;
