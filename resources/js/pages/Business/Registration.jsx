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

  const handleNext = () => {
    navigate("/business/company");
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

  const companySizeOptions = [
    { value: '1-10', label: '1-10' },
    { value: '11-50', label: '11-50' },
    { value: '51-100', label: '51-100' },
    { value: '101 and above', label: '101 and above' },
  ];

  return (
    <div className="form-container">
      {/* Header */}
      <div className="header">
        <h1 className="header-title">Business Matching Registration and Form Submission</h1>
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

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 mb-4 md:grid-cols-2 md:gap-x-[120px]">
                <FormInput
                  id="name"
                  name="name"
                  label="Name:"
                  placeholder="E.g. John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  id="designation"
                  name="designation"
                  label="Designation:"
                  placeholder="E.g. CEO"
                  value={formData.designation}
                  onChange={handleChange}
                  required
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
                />

                <PhoneInput
                  id="phoneNumber"
                  name="phoneNumber"
                  label="Phone Number:"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  id="companyName"
                  name="companyName"
                  label="Company Name:"
                  placeholder="E.g. XZ Sdn Bhd."
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                />

                <FormInput
                  id="companyNature"
                  name="companyNature"
                  label="Company Nature of Business:"
                  placeholder="E.g. E-Commerce, Distributor"
                  value={formData.companyNature}
                  onChange={handleChange}
                  required
                />
              </div>

              <RadioGroup
                name="companySize"
                label="Company Size (People):"
                options={companySizeOptions}
                value={formData.companySize}
                onChange={handleChange}
                required
              />

              {/* Required Fields Note */}
          <div className="mt-6 text-sm text-red-600">*All fields are required to fill</div>

          {/* Next Button */}
          <div className="flex justify-end mt-6">
            <button onClick={handleNext} type="submit" className="primary-btn">Next</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registration;
