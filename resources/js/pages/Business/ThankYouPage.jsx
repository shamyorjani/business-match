import React, { useState } from 'react';

const ThankYouPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Sample confirmed meeting data
  const confirmedMeetings = [
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
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % confirmedMeetings.length);
  };

  return (
    <div className="thank-you-card">
      {/* Success Check Icon */}
      <div className='flex justify-center'>
      <img src="/images/thanks.svg" alt="My Image" />
      </div>

      {/* Thank You Message */}
      <h1 className="thank-you-title">Thank You !</h1>
      <p className="thank-you-message">
        You have successfully matched with {confirmedMeetings.length} exhibitor(s). One the
        meetings schedule is confirmed, you will be notified via email.
      </p>

      {/* Meetings Schedule Section */}
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

      {/* Contact Information */}
      <p className="contact-info">
        For more information or any updates, kindly contact pr@elite.com.my or WhatsApp,<br />
        +6016-704 8058
      </p>
    </div>
  );
};

export default ThankYouPage;
