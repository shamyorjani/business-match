import React, { useState, useEffect } from 'react';
import PrimaryApplicant from '../../components/form/PrimaryApplicant';
import AdditionalApplicant from '../../components/form/AdditionalApplicant';
import StayDetails from '../../components/form/StayDetails';
import { useLocation, useNavigate } from 'react-router-dom';

const PaymentGateway = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [companyId, setCompanyId] = useState(null);

  // Get URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const user = params.get('user');
    const company = params.get('company');
    
    if (user && company) {
      try {
        // Decrypt the parameters
        const decryptedUser = atob(user);
        const decryptedCompany = atob(company);
        setUserId(decryptedUser);
        setCompanyId(decryptedCompany);
      } catch (error) {
        console.error('Error decrypting parameters:', error);
      }
    }
  }, [location]);

  const [formData, setFormData] = useState({
    name: '',
    passportNumber: '',
    email: '',
    phoneNumber: '',
    additionalName: '',
    additionalPassport: '',
    stayingDuration: '',
    roomType: '',
    extraNight: '',
    userId: '',
    companyId: ''
  });

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('hostedPaymentData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setFormData(prevData => ({
          ...prevData,
          ...parsedData
        }));
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Save form data to localStorage
    const dataToSave = {
      ...formData,
      userId,
      companyId
    };
    localStorage.setItem('hostedPaymentData', JSON.stringify(dataToSave));

    // Calculate total amount
    const totalAmount = calculateTotalAmount(formData);
    
    // Save total amount to localStorage for payment card
    localStorage.setItem('paymentSummary', JSON.stringify({
      ...dataToSave,
      totalAmount,
      orderData: [
        { label: "Refundable Deposit", value: "450.00" },
        { label: "Room Booking (2 nights)", value: "850.00" },
        { label: "Registration Fee", value: "150.00" },
        ...(formData.extraNight ? [{ label: "Extra Night", value: "450.00" }] : [])
      ]
    }));

    // Navigate to payment card
    navigate('/hosted/payment-card');
  };

  const calculateTotalAmount = (data) => {
    let total = 1450.00; // Base amount (450 + 850 + 150)
    if (data.extraNight) {
      total += 450.00; // Add extra night charge
    }
    return total.toFixed(2);
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
