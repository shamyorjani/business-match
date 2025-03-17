import React from 'react';

const ThankYouPage = () => {
  // Sample confirmed meeting data
  const confirmedMeetings = [
    {
      day: 3,
      date: "04 June 2025",
      dayOfWeek: "Thursday",
      time: "3.00pm-4.00pm",
      exhibitor: "ABC Company",
      boothNumber: "A11"
    }
  ];

  return (
    <div className="thank-you-card">
      {/* Success Check Icon */}
      <div className='flex justify-center mb-6'>
      <img className='w-15' src="/images/thanks.svg" alt="My Image" />
      </div>

      {/* Thank You Message */}
      <div className='flex flex-col items-center'>
      <h1 className="thank-you-title">Thank You !</h1>
      <p className="thank-you-message">
        You have successfully matched with {confirmedMeetings.length} exhibitor(s). One the
        meetings schedule is confirmed, you will be notified via email.

      </p>
      </div>

      {/* Meetings Schedule Section */}
      <div>
        <p className="meeting-schedule-label">Schedule Meetings:</p>

        {/* Meeting Cards - Show all meetings in a list */}
        {confirmedMeetings.map((meeting, index) => (
          <div className="meeting-card" key={index}>
            <div>
              <p className="meeting-day">Day {meeting.day}</p>
              <p>Date: {meeting.date} ({meeting.dayOfWeek})</p>
              <p>Time: {meeting.time}</p>
              <p>Exhibitor: {meeting.exhibitor}</p>
              <p>Booth Number: {meeting.boothNumber}</p>
            </div>
          </div>
        ))}
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
