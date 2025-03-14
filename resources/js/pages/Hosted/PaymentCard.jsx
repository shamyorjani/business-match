import React, { useState } from 'react';

const PaymentCard = () => {
const [paymentMethod, setPaymentMethod] = useState('credit');
const [depositMethod, setDepositMethod] = useState('full');

// Sample order data
const orderData = [
{ label: "Refundable Deposit", value: "450.00" },
{ label: "Room Booking (2 nights)", value: "850.00" },
{ label: "Registration Fee", value: "150.00" }
];

const totalAmount = orderData.reduce((sum, item) => sum + parseFloat(item.value), 0).toFixed(2);

const handlePayment = () => {
console.log("Processing payment...");
// Add payment processing logic here
};

return (
<div className="max-w-3xl p-8 mx-auto bg-white rounded-md shadow-md">
    <h1 className="mb-6 text-2xl font-bold">Summary</h1>

    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Left Column - Order Summary */}
        <div className="p-6 border border-gray-200 rounded-md">
            {orderData.map((item, index) => (
            <div key={index} className="flex justify-between mb-4">
                <span className="text-gray-600">
                    {item.label.split('').map(() => '•').join('')}
                </span>
                <span className="text-gray-600">
                    {item.value.split('').map(() => 'x').join('')}
                </span>
            </div>
            ))}

            <div className="my-4 border-t border-gray-200"></div>

            <div className="flex justify-between mt-6">
                <span className="font-medium">Total Order Amount</span>
                <span className="font-medium">
                    {totalAmount.split('').map(() => 'x').join('')}
                </span>
            </div>
        </div>

        {/* Right Column - Payment Options */}
        <div>
            {/* Payment Method */}
            <div className="b-4 ">
                <div className='flex flex-row'>
                    <label className="block mb-2 text-sm font-medium text-gray-700">Payment Method</label>
                    <div className="flex items-center mb-2">
                        <div className="flex ml-4 space-x-4">
                            <img src="/images/method.svg" alt="Mastercard" className="h-6" />
                            <img src="/images/master-card.svg" alt="" />
                            <img src="/images/visa.svg" alt="Visa" className="h-6" />
                        </div>
                    </div>
                </div>


                <div className="relative">
                    <select
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-[#40033f] focus:border-[#40033f]"
                        value={paymentMethod} onChange={(e)=> setPaymentMethod(e.target.value)}
                        >
                        <option value="credit">Debit / Credit Card</option>
                        <option value="online">Online Banking</option>
                    </select>
                    <div
                        className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Deposit Method */}
            <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-700">Deposit Method</label>
                <div className="relative">
                    <select
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-[#40033f] focus:border-[#40033f]"
                        value={depositMethod} onChange={(e)=> setDepositMethod(e.target.value)}
                        >
                        <option value="full">Full Payment</option>
                        <option value="deposit">Deposit Only</option>
                    </select>
                    <div
                        className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fillRule="evenodd"
                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Pay Button */}
            <button onClick={handlePayment}
                className="w-full bg-[#40033f] text-white py-3 rounded-md hover:bg-[#6f0f55] focus:outline-none">
                Pay
            </button>
        </div>
    </div>
</div>
);
};

export default PaymentCard;
