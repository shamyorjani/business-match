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
    <div className="thank-you-card">
      {/* Success Check Icon */}
      <div className='flex justify-center mb-6'>
        <img className='w-15' src="/images/thanks.svg" alt="Thank You Icon" />
      </div>

      {/* Thank You Message */}
      <div className='flex flex-col items-center'>
        <h1 className="thank-you-title">Thank You !</h1>
        {registrationComplete ? (
          <p className="thank-you-message">
            Your registration is complete! You have successfully matched with {confirmedMeetings.length} exhibitor(s).
            One the meetings schedule is confirmed, ypu will be notified via email.
          </p>
        ) : (
          <p className="thank-you-message">
            You have successfully matched with {confirmedMeetings.length} exhibitor(s). One the meetings schedule is confirmed, ypu will be notified via email.
          </p>
        )}
      </div>

      {/* Meetings Schedule Section */}
      {confirmedMeetings.length > 0 && (
        <div>
          <p className="meeting-schedule-label">Schedule Meetings:</p>

          {/* Meeting Card */}
          <div className="meeting-card">
            <div>
              <p className="meeting-day">Day {confirmedMeetings[currentSlide].day}</p>
              <p>Date: {confirmedMeetings[currentSlide].date} ({confirmedMeetings[currentSlide].dayOfWeek})</p>
              <p>Time: {confirmedMeetings[currentSlide].time}</p>
              <p>Exhibitor: {confirmedMeetings[currentSlide].exhibitor}</p>
              <p>Booth Number: {confirmedMeetings[currentSlide].boothNumber}</p>
            </div>

            {/* Next arrow */}
            {confirmedMeetings.length > 1 && (
              <button
                onClick={nextSlide}
                className="next-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="next-icon"
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
            <div className="navigation-dots">
              {confirmedMeetings.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${currentSlide === index ? 'dot-active' : 'dot-inactive'}`}
                  onClick={() => setCurrentSlide(index)}
                ></span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Contact Information */}
      <p className="contact-info">
        For more information or any updates, kindly contact pr@elite.com.my or WhatsApp,<br />
        +6016-704 8058
      </p>

      {/* Back to Home Button */}
      <div className="flex justify-center mt-6 rounded">
        <button
          onClick={goToHomePage}
          className="px-6 py-2 text-white bg-[#40033f] rounded-4xl hover:bg-[#6f0f55] transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ThankYouPage;
