import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import FormInput from '../../components/form/FormInput';
import PhoneInput from '../../components/form/PhoneInput';
import RadioGroup from '../../components/form/RadioGroup';

const Registration = () => {
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
  const [errors, setErrors] = useState({});

  // Load saved data when component mounts
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('businessRegistration') || '{}');
    if (Object.keys(savedData).length > 0) {
      setFormData(prevState => ({
        ...prevState,
        ...savedData
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ''
    }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.designation.trim()) newErrors.designation = 'Designation is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.companyName.trim()) newErrors.companyName = 'Company name is required';
    if (!formData.companyNature.trim()) newErrors.companyNature = 'Company nature is required';
    if (!formData.companySize) newErrors.companySize = 'Company size is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Save form data to localStorage
      localStorage.setItem('businessRegistration', JSON.stringify(formData));
      // Navigate to the next page using react-router-dom
      navigate("/business/company");
    } else {
      // Focus on first error field
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.getElementById(firstErrorField);
      if (errorElement) errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const companySizeOptions = [
    { value: '1-10', label: '1-10' },
    { value: '11-50', label: '11-50' },
    { value: '51-100', label: '51-100' },
    { value: '101 and above', label: '101 and above' },
  ];

  return (
    <div className="form-container w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="header px-3 sm:px-6">
        <h1 className="header-title text-xl sm:text-2xl md:text-3xl">Business Matching Registration and Form Submission</h1>
      </div>

      {/* Form Content */}
      <div className="p-3 sm:p-6 px-8 py-8 md:px-16 md:py-12 bg-white">
        {/* Step Indicator */}
        <div className="mb-4 md:mb-8">
          <h2 className="step-indicator">STEP 1</h2>
          <div className="flex w-full overflow-hidden">
            <svg width="100%" height="34" viewBox="0 0 400 40" preserveAspectRatio="xMidYMid meet">
              <polygon points="240,0 340,0 360,20 340,40 240,40 260,20" fill="#E5E7EB" />
              <polygon points="120,0 220,0 240,20 220,40 120,40 140,20" fill="#E5E7EB" />
              <polygon points="0,0 100,0 120,20 100,40 0,40" fill="#40033f" />
            </svg>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-3 mb-3 sm:gap-6 sm:mb-4 md:grid-cols-2 md:gap-x-[120px]">
            <FormInput
              id="name"
              name="name"
              label="Name:"
              placeholder="E.g. John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              error={errors.name}
            />

            <FormInput
              id="designation"
              name="designation"
              label="Designation:"
              placeholder="E.g. CEO"
              value={formData.designation}
              onChange={handleChange}
              required
              error={errors.designation}
            />

            <FormInput
              id="email"
              name="email"
              type="email"
              label="Email:"
              placeholder="E.g. john@xyz.com"
              value={formData.email}
              onChange={handleChange}
              required
              error={errors.email}
            />

            <PhoneInput
              id="phoneNumber"
              name="phoneNumber"
              label="Phone Number:"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              error={errors.phoneNumber}
            />

            <FormInput
              id="companyName"
              name="companyName"
              label="Company Name:"
              placeholder="E.g. XZ Sdn Bhd."
              value={formData.companyName}
              onChange={handleChange}
              required
              error={errors.companyName}
            />

            <FormInput
              id="companyNature"
              name="companyNature"
              label="Company Nature of Business:"
              placeholder="E.g. E-Commerce, Distributor"
              value={formData.companyNature}
              onChange={handleChange}
              required
              error={errors.companyNature}
            />
          </div>

          <RadioGroup
            name="companySize"
            label="Company Size (People):"
            options={companySizeOptions}
            value={formData.companySize}
            onChange={handleChange}
            required
            error={errors.companySize}
          />

          {/* Required Fields Note */}
          <div className="mt-3 sm:mt-6 text-xs sm:text-sm text-red-600">*All fields are required to fill</div>

          {/* Next Button */}
          <div className="flex justify-center sm:justify-end mt-4 sm:mt-6">
            <button type="submit" className="primary-btn w-full sm:w-auto px-4 py-2">Next</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
