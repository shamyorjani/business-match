import React, { useState } from 'react';
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
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleNext = () => {
    setIsSubmitted(true);

    // Validate all fields
    const validationErrors = validateForm();
    setErrors(validationErrors);

    // Only navigate if there are no errors
    if (Object.keys(validationErrors).length === 0) {
      navigate("/hosted/company");
    }
  };

  const validateForm = () => {
    let tempErrors = {};

    if (!formData.name.trim()) tempErrors.name = "Name is required";
    if (!formData.designation.trim()) tempErrors.designation = "Designation is required";

    // Email validation
    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid";
    }

    if (!formData.phoneNumber.trim()) tempErrors.phoneNumber = "Phone number is required";
    if (!formData.companyName.trim()) tempErrors.companyName = "Company name is required";
    if (!formData.companyNature.trim()) tempErrors.companyNature = "Company nature is required";
    if (!formData.companySize) tempErrors.companySize = "Company size is required";

    return tempErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));

    // Clear error for this field when user starts typing
    if (isSubmitted) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleNext();
  };

  const companySizeOptions = [
    { id: 'size1', value: '1-10', label: '1-10' },
    { id: 'size2', value: '11-50', label: '11-50' },
    { id: 'size3', value: '51-100', label: '51-100' },
    { id: 'size4', value: '101 and above', label: '101 and above' }
  ];

  return (
    <div className="form-container">
      {/* Header */}
      <div className="header">
        <h1 className="header-title">Hosted Buyer Program and Form Submission</h1>
      </div>

      {/* Form Content */}
      <div className="p-6 px-16 py-12 bg-white">
        {/* Step Indicator */}
        <div className="mb-8">
          <h2 className="step-indicator">STEP 1</h2>
          <div className="flex">
            <svg width="326" height="34" viewBox="0 0 400 40">
              <polygon points="240,0 340,0 360,20 340,40 240,40 260,20" fill="#E5E7EB" />
              <polygon points="120,0 220,0 240,20 220,40 120,40 140,20" fill="#E5E7EB" />
              <polygon points="0,0 100,0 120,20 100,40 0,40" fill="#40033f" />
            </svg>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 mb-4 md:grid-cols-2 md:gap-x-[120px]">
            {/* Name */}
            <FormInput
              label="Name"
              id="name"
              name="name"
              placeholder="E.g. John Doe"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
              required={true}
            />

            {/* Designation */}
            <FormInput
              label="Designation"
              id="designation"
              name="designation"
              placeholder="E.g. CEO"
              value={formData.designation}
              onChange={handleChange}
              error={errors.designation}
              required={true}
            />

            {/* Email */}
            <FormInput
              label="Email"
              type="email"
              id="email"
              name="email"
              placeholder="E.g. john@xyz.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required={true}
            />

            {/* Phone Number */}
            <PhoneInput
              label="Phone Number"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="E.g. 123456789"
              value={formData.phoneNumber}
              onChange={handleChange}
              error={errors.phoneNumber}
              countryCode="+60"
              required={true}
            />

            {/* Company Name */}
            <FormInput
              label="Company Name"
              id="companyName"
              name="companyName"
              placeholder="E.g. XZ Sdn Bhd."
              value={formData.companyName}
              onChange={handleChange}
              error={errors.companyName}
              required={true}
            />

            {/* Company Nature */}
            <FormInput
              label="Company Nature of Business"
              id="companyNature"
              name="companyNature"
              placeholder="E.g. E-Commerce, Distributor"
              value={formData.companyNature}
              onChange={handleChange}
              error={errors.companyNature}
              required={true}
            />
          </div>

          {/* Company Size */}
          <div className="mt-6">
            <RadioGroup
              label="Company Size (People)"
              name="companySize"
              options={companySizeOptions}
              value={formData.companySize}
              onChange={handleChange}
              error={errors.companySize}
              required={true}
            />
          </div>

          {/* Required Fields Note */}
          <div className="mt-6 text-sm text-red-600">*All fields are required to fill</div>

          {/* Next Button */}
          <div className="flex justify-end mt-6">
            <button onClick={handleNext} type="button" className="primary-btn">Next</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
