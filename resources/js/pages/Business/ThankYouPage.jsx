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
    <div className="max-w-xl p-12 mx-auto bg-white rounded-lg shadow-lg">
      {/* Success Check Icon */}
      <div className="flex justify-center mb-4">
        <div className="flex items-center justify-center w-16 h-16 bg-green-500 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* Thank You Message */}
      <h1 className="mb-2 text-2xl font-bold text-center">Thank You !</h1>
      <p className="mb-6 text-center">
        You have successfully matched with {confirmedMeetings.length} exhibitor(s). One the
        meetings schedule is confirmed, you will be notified via email.
      </p>

      {/* Meetings Schedule Section */}
      <div>
        <p className="mb-2 font-medium">Schedule Meetings:</p>

        {/* Meeting Card */}
        <div className="relative p-4 mb-2 border border-gray-300 rounded-lg">
          <div>
            <p className="font-medium">Day {confirmedMeetings[currentSlide].day}</p>
            <p>Date: {confirmedMeetings[currentSlide].date} ({confirmedMeetings[currentSlide].dayOfWeek})</p>
            <p>Time: {confirmedMeetings[currentSlide].time}</p>
            <p>Exhibitor: {confirmedMeetings[currentSlide].exhibitor}</p>
            <p>Booth Number: {confirmedMeetings[currentSlide].boothNumber}</p>
          </div>

          {/* Next arrow */}
          {confirmedMeetings.length > 1 && (
            <button
              onClick={nextSlide}
              className="absolute transform -translate-y-1/2 right-4 top-1/2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6"
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
          <div className="flex justify-center gap-1 mt-2">
            {confirmedMeetings.map((_, index) => (
              <span
                key={index}
                className={`inline-block w-2 h-2 rounded-full ${
                  currentSlide === index ? 'bg-black' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentSlide(index)}
              ></span>
            ))}
          </div>
        )}
      </div>

      {/* Contact Information */}
      <p className="mt-6 text-sm">
        For more information or any updates, kindly contact pr@elite.com.my or WhatsApp,<br />
        +6016-704 8058
      </p>
    </div>
  );
};

export default ThankYouPage;
