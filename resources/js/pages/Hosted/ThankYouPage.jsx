import React from 'react';
import { useNavigate } from 'react-router-dom';

const ThankYouPage = () => {
  const navigate = useNavigate();

  // Program requirements data
  const requirements = [
    "Pay a refundable deposit for the complimentary 4-star hotel room stay",
    "Have to least 3 business meetings each day for the whole duration of IBE (a total of 12 meetings)",
    "Attend at least 2 stage programs (Seminar, talks, and workshop)."
  ];

  const goToHomePage = () => {
    navigate('/');
  };

  return (
    <div className="max-w-3xl px-4 py-8 mx-auto my-8 md:px-8 lg:px-12">
      {/* Success Check Icon */}
      <div className='flex justify-center mb-6'>
        <img className='w-16 h-16 sm:w-20 sm:h-20' src="/images/thanks.svg" alt="Success Check" />
      </div>

      {/* Thank You Message */}
      <div className='flex flex-col items-center mb-8'>
        <h1 className="mb-4 text-2xl font-bold text-center md:text-3xl lg:text-4xl">Thank You!</h1>
        <p className="text-sm text-center md:text-base lg:text-lg">
          You have successfully submitted to <strong>IBE 2025</strong> - Hosted Buyer Program.
          <br className="hidden sm:block" />A confirmation letter will be sent to your email if you are approved.
        </p>
      </div>

      {/* Requirements Box */}
      <div className="p-4 mb-8 border border-gray-300 rounded-lg md:p-6">
        <p className="mb-2 text-sm font-medium md:text-base">If you are accepted into the program, you will be required to:</p>
        <ol className="pl-5 ml-1 space-y-2 text-sm list-decimal md:text-base">
          {requirements.map((requirement, index) => (
            <li key={index} className="pl-1">{requirement}</li>
          ))}
        </ol>
      </div>

      {/* Contact Information */}
      <p className="mb-8 text-xs text-center md:text-sm">
        For more information or any updates, kindly contact pr@elite.com.my or WhatsApp,
        <br />+6016-704 8058
      </p>

      {/* Back to Home Button */}
      <div className="flex justify-center">
        <button
          onClick={goToHomePage}
          className="px-6 py-2 text-sm text-white rounded-full md:text-base md:px-8 md:py-3 bg-[#40033f] hover:bg-[#6f0f55] transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
