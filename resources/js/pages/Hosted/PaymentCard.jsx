import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PaymentCard = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [depositMethod, setDepositMethod] = useState('full');
  const [orderData, setOrderData] = useState([]);
  const [totalAmount, setTotalAmount] = useState('0.00');
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    // Load saved data from localStorage
    const savedSummary = localStorage.getItem('paymentSummary');
    if (savedSummary) {
      try {
        const parsedData = JSON.parse(savedSummary);
        setOrderData(parsedData.orderData);
        setTotalAmount(parsedData.totalAmount);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error loading payment summary:', error);
      }
    } else {
      // If no saved data, redirect back to payment gateway
      navigate('/hosted/payment-gateway');
    }
  }, [navigate]);

  const handlePayment = async () => {
    try {
      const amount = depositMethod === 'full' 
        ? parseFloat(totalAmount)
        : parseFloat(totalAmount) * 0.3;

      // Process payment through API
      const response = await axios.post('/api/payments/process', {
        hotel_booking_id: formData.bookingId,
        payment_type: depositMethod,
        payment_method: paymentMethod,
        amount: amount.toFixed(2)
      });

      // Clear localStorage
      localStorage.removeItem('hostedPaymentData');
      localStorage.removeItem('paymentSummary');

      // Redirect to success page with payment details
      navigate('/hosted/success', {
        state: {
          orderId: response.data.order_id,
          transactionId: response.data.transaction_id,
          amount: amount.toFixed(2)
        }
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      // Handle error (show error message to user)
    }
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-5xl py-20 mx-auto bg-white rounded-md shadow-md px-14">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold font-cardo">Payment Summary</h1>
        <div className="text-sm text-gray-500">
          Order ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left Column - Order Summary */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="p-6 border border-gray-200 rounded-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">Name:</span>
                <span>{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span>{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Phone:</span>
                <span>{formData.phoneNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Passport Number:</span>
                <span>{formData.passportNumber}</span>
              </div>
            </div>
          </div>

          {/* Additional Applicant Information */}
          {formData.additionalName && (
            <div className="p-6 border border-gray-200 rounded-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Applicant</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span className="font-medium">Name:</span>
                  <span>{formData.additionalName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Passport Number:</span>
                  <span>{formData.additionalPassport}</span>
                </div>
              </div>
            </div>
          )}

          {/* Stay Details */}
          <div className="p-6 border border-gray-200 rounded-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stay Details</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span className="font-medium">Staying Duration:</span>
                <span>{formData.stayingDuration}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Room Type:</span>
                <span>{formData.roomType}</span>
              </div>
              {formData.extraNight && (
                <div className="flex justify-between">
                  <span className="font-medium">Extra Night:</span>
                  <span>{formData.extraNight}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Summary */}
          <div className="p-6 border border-gray-200 rounded-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Summary</h3>
            <div className="space-y-3">
              {orderData.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-medium">RM {item.value}</span>
                </div>
              ))}
              <div className="pt-3 mt-3 border-t border-gray-200">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total Amount</span>
                  <span className="font-semibold text-gray-900">RM {totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Payment Options */}
        <div className="space-y-6">
          <div className="p-6 border border-gray-200 rounded-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Select Payment Method</label>
                <div className="flex space-x-2">
                  <img src="/images/master-card.svg" className="w-8 h-8" alt="Mastercard" />
                  <img src="/images/visa.svg" className="w-8 h-8" alt="Visa" />
                </div>
              </div>

              <div className="relative">
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-[#40033f] focus:border-[#40033f] text-black"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                >
                  <option value="credit">Debit / Credit Card</option>
                  <option value="online">Online Banking</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 text-black pointer-events-none">
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border border-gray-200 rounded-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Options</h3>
            <div className="space-y-4">
              <div className="relative">
                <select
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-[#40033f] focus:border-[#40033f] text-black"
                  value={depositMethod}
                  onChange={(e) => setDepositMethod(e.target.value)}
                >
                  <option value="full">Full Payment</option>
                  <option value="deposit">Deposit Only</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 text-black pointer-events-none">
                  <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-md">
                <p className="text-sm text-gray-600">
                  {depositMethod === 'full' 
                    ? `Full payment of RM ${totalAmount} will be processed.`
                    : `A deposit of RM ${(parseFloat(totalAmount) * 0.3).toFixed(2)} will be processed.`}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="w-full py-3 text-white bg-[#40033f] rounded-md hover:bg-[#6f0f55] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#40033f]"
          >
            {depositMethod === 'full' ? 'Pay Full Amount' : 'Pay Deposit'} - RM {depositMethod === 'full' ? totalAmount : (parseFloat(totalAmount) * 0.3).toFixed(2)}
          </button>

          <div className="text-xs text-gray-500 text-center">
            <p>Your payment information is secure and encrypted</p>
            <p className="mt-1">By proceeding with the payment, you agree to our Terms and Conditions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
