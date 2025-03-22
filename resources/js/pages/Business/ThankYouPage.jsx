import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ThankYouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [confirmedMeetings, setConfirmedMeetings] = useState([]);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  useEffect(() => {
    // Check if registration is complete from navigation state
    if (location.state && location.state.registrationComplete) {
      setRegistrationComplete(true);

      // Store registration ID if available
      const registrationId = location.state.registrationId;
      if (registrationId) {
        localStorage.setItem('registrationId', registrationId);
      }

      // Clear localStorage data after successful registration
      localStorage.removeItem('businessRegistration');
      localStorage.removeItem('companyInfoData');
      localStorage.removeItem('selectedInterests');
      localStorage.removeItem('selectedMeetingSlots');

      // Display registration success message
      console.log('Registration completed successfully');
    }

    // Get meetings data from navigation state
    if (location.state && location.state.meetings && location.state.meetings.length > 0) {
      setConfirmedMeetings([
        {
          day: 3,
          date: "04 June 2025",
          dayOfWeek: "Thursday",
          time: "3.00pm-4.00pm",
          exhibitor: "ABC Company",
          boothNumber: "A11"
        },
        {
          day: 4,
          date: "05 June 2025",
          dayOfWeek: "Friday",
          time: "2.00pm-3.00pm",
          exhibitor: "XYZ Corporation",
          boothNumber: "B22"
        }
      ]);
    }
  }, [location]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % confirmedMeetings.length);
  };

  const goToHomePage = () => {
    navigate('/');
  };

  return (
    <div className="max-w-3xl px-4 py-8 mx-auto my-8 md:px-8 lg:px-12">
      {/* Success Check Icon */}
      <div className='flex justify-center mb-6'>
        <img className='w-16 h-16 sm:w-20 sm:h-20' src="/images/thanks.svg" alt="Thank You Icon" />
      </div>

      {/* Thank You Message */}
      <div className='flex flex-col items-center mb-8'>
        <h1 className="mb-4 text-2xl font-bold text-center md:text-3xl lg:text-4xl">Thank You!</h1>
        {registrationComplete ? (
          <p className="text-sm text-center md:text-base lg:text-lg">
            Your registration is complete! You have successfully matched with {confirmedMeetings.length} exhibitor(s).
            Once the meetings schedule is confirmed, you will be notified via email.
          </p>
        ) : (
          <p className="text-sm text-center md:text-base lg:text-lg">
            You have successfully matched with {confirmedMeetings.length} exhibitor(s). Once the meetings schedule is confirmed, you will be notified via email.
          </p>
        )}
      </div>

      {/* Meetings Schedule Section */}
      {confirmedMeetings.length > 0 && (
        <div className="mb-8">
          <p className="mb-2 text-lg font-semibold md:text-xl">Schedule Meetings:</p>

          {/* Meeting Card */}
          <div className="relative p-4 bg-white border border-gray-200 rounded-lg shadow-sm md:p-6">
            <div className="space-y-2">
              <p className="text-base font-bold md:text-lg">Day {confirmedMeetings[currentSlide].day}</p>
              <p className="text-sm md:text-base">Date: {confirmedMeetings[currentSlide].date} ({confirmedMeetings[currentSlide].dayOfWeek})</p>
              <p className="text-sm md:text-base">Time: {confirmedMeetings[currentSlide].time}</p>
              <p className="text-sm md:text-base">Exhibitor: {confirmedMeetings[currentSlide].exhibitor}</p>
              <p className="text-sm md:text-base">Booth Number: {confirmedMeetings[currentSlide].boothNumber}</p>
            </div>

            {/* Next arrow */}
            {confirmedMeetings.length > 1 && (
              <button
                onClick={nextSlide}
                className="absolute transform -translate-y-1/2 right-4 top-1/2 md:right-6"
                aria-label="Next meeting"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 text-gray-600 md:w-8 md:h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Navigation Dots */}
          {confirmedMeetings.length > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {confirmedMeetings.map((_, index) => (
                <span
                  key={index}
                  className={`inline-block w-2 h-2 rounded-full cursor-pointer md:w-3 md:h-3
                    ${currentSlide === index ? 'bg-[#40033f]' : 'bg-gray-300'}`}
                  onClick={() => setCurrentSlide(index)}
                ></span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contact Information */}
      <p className="mb-8 text-xs text-center md:text-sm">
        For more information or any updates, kindly contact pr@elite.com.my or WhatsApp,<br />
        +6016-704 8058
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
