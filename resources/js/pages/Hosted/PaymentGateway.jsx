import React, { useState } from 'react';
import PrimaryApplicant from '../../components/form/PrimaryApplicant';
import AdditionalApplicant from '../../components/form/AdditionalApplicant';
import StayDetails from '../../components/form/StayDetails';

const PaymentGateway = () => {
  const [formData, setFormData] = useState({
    name: '',
    passportNumber: '',
    email: '',
    phoneNumber: '',
    additionalName: '',
    additionalPassport: '',
    stayingDuration: '',
    roomType: '',
    extraNight: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your form submission logic here
    window.location.href = '/hosted/payment-card';
  };

  return (
    <div className="form-container">
      {/* Header */}
      <div className="header">
        <h1 className="header-title">Payment Gateway</h1>
      </div>

      {/* Form Content */}
      <div className="p-6 px-16 py-12 bg-white">
        <form onSubmit={handleSubmit}>
          {/* Primary Applicant */}
          <PrimaryApplicant formData={formData} handleChange={handleChange} />

          {/* Divider */}
          <div className="my-6 border-t border-gray-200"></div>

          {/* Additional Applicant */}
          <AdditionalApplicant formData={formData} handleChange={handleChange} />

          {/* Divider */}
          <div className="my-6 border-t border-gray-200"></div>

          {/* Stay Details */}
          <StayDetails formData={formData} handleChange={handleChange} />

          {/* Submit Button */}
          <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="px-8 py-2 bg-[#40033f] text-white rounded-full hover:bg-[#6f0f55] focus:outline-none"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentGateway;
