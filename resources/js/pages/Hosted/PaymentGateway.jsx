import React, { useState } from 'react';

const PaymentSummary = () => {
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [depositMethod, setDepositMethod] = useState('full');

  // Sample order data
  const orderItems = [
    { id: 1, name: "Item 1", price: "xxxx" },
    { id: 2, name: "Item 2", price: "xxxx" },
    { id: 3, name: "Item 3", price: "xxxx" }
  ];

  const handlePayment = () => {
    console.log("Processing payment...");
    // Add payment processing logic here
  };

  return (
    <div className="max-w-3xl p-6 mx-auto bg-white rounded-sm shadow-md">
      <h1 className="mb-6 text-xl font-semibold">Summary</h1>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Left Column - Order Summary */}
        <div className="w-full p-6 border border-gray-200 rounded-md md:w-1/2">
          {orderItems.map((item) => (
            <div key={item.id} className="flex justify-between py-2">
              <div className="text-gray-700">••••••••••••••••••••</div>
              <div className="text-gray-700">xxxx</div>
            </div>
          ))}

          <div className="my-4 border-t border-gray-200"></div>

          <div className="flex justify-between pt-2">
            <div className="font-medium">Total Order Amount</div>
            <div className="font-medium">xxxx</div>
          </div>
        </div>

        {/* Right Column - Payment Options */}
        <div className="w-full md:w-1/2">
          {/* Payment Method */}
          <div className="mb-4">
            <div className="flex items-center mb-1">
              <label className="block text-sm font-medium">Payment Method</label>
              <div className="flex items-center ml-4">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-[#40033f] border-gray-300 rounded"
                  checked={true}
                  readOnly
                />
                <div className="flex ml-2 space-x-2">
                  <img src="/api/placeholder/25/15" alt="Mastercard" className="h-5" />
                  <img src="/api/placeholder/25/15" alt="Visa" className="h-5" />
                </div>
              </div>
            </div>

            <div className="relative">
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="credit">Debit / Credit Card</option>
                <option value="online">Online Banking</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Deposit Method */}
          <div className="mb-6">
            <label className="block mb-1 text-sm font-medium">Deposit Method</label>
            <div className="relative">
              <select
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                value={depositMethod}
                onChange={(e) => setDepositMethod(e.target.value)}
              >
                <option value="full">Full Payment</option>
                <option value="deposit">Deposit Only</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Pay Button */}
          <button
            onClick={handlePayment}
            className="w-full bg-[#40033f] text-white py-3 text-lg font-medium rounded-sm hover:bg-[#6f0f55] focus:outline-none"
          >
            Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
