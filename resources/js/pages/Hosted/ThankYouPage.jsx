import React from 'react';

const ThankYouPage = () => {
  // Program requirements data
  const requirements = [
    "Pay a refundable deposit for the complimentary 4-star hotel room stay",
    "Have to least 3 business meetings each day for the whole duration of IBE( a total of 12 meetings)",
    "Attend at least 2 stage programs (Seminar, talks, and workshop)."
  ];

  return (
    <div className="thank-you-card">
      {/* Success Check Icon */}
      <div className='flex justify-center mb-6'>
        <img className='w-16 h-16' src="/images/thanks.svg" alt="Success Check" />
      </div>

      {/* Thank You Message */}
      <div className='flex flex-col items-center mb-6'>
        <h1 className="mb-3 text-2xl font-bold text-center">Thank You !</h1>
        <p className="text-center">
          You have successfully submitted to <strong>IBE 2025</strong> - Hosted Buyer Program.
          <br />A confirmation letter will be sent your email if you are approved
        </p>
      </div>

      {/* Requirements Box */}
      <div className="p-6 mb-6 border border-gray-300 rounded-lg">
        <p className="mb-2">If you are accepted in to the program, you will be required to:</p>
        <ol className="pl-6 space-y-1 list-decimal">
          {requirements.map((requirement, index) => (
            <li key={index}>{requirement}</li>
          ))}
        </ol>
      </div>

      {/* Contact Information */}
      <p className="text-sm">
        For more information or any updates, kindly contact pr@elite.com.my or WhatsApp,
        <br />+6016-704 8058
      </p>
    </div>
  );
};

export default ThankYouPage;
