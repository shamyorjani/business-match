import React from 'react';

const ThankYouPage = () => {
  return (
    <div className="max-w-2xl p-8 mx-auto bg-white rounded-lg shadow-md">
      {/* Success Check Icon */}
      <div className='flex justify-center'>
      <img src="/images/thanks.svg" alt="My Image" />
      </div>

      {/* Thank You Message */}
      <h1 className="mb-3 text-2xl font-bold text-center">Thank You !</h1>
      <p className="mb-6 text-center">
        You have successfully submitted to <strong>IBE 2025</strong>- Hosted Buyer Program.
        <br />A confirmation letter will be sent your email if you are approved
      </p>

      {/* Requirements Box */}
      <div className="p-6 mb-6 border border-gray-300 rounded-lg">
        <p className="mb-2">If you are accepted in to the program, you will be required to:</p>
        <ol className="pl-6 space-y-1 list-decimal">
          <li>Pay a refundable deposit for the complimentary 4-star hotel room stay</li>
          <li>Have to least 3 business meetings each day for the whole duration of IBE( a total of 12 meetings)</li>
          <li>Attend at least 2 stage programs (Seminar, talks, and workshop).</li>
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
