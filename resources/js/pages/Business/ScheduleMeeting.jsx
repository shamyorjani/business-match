import React, { useState } from 'react';

const ScheduleMeeting = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Company details
  const companyName = "ABC Company";
  const boothNumber = "A11";

  // Schedule data
  const days = [
    { day: 1, date: "2 June 2025", dayOfWeek: "Monday" },
    { day: 2, date: "3 June 2025", dayOfWeek: "Tuesday" },
    { day: 3, date: "4 June 2025", dayOfWeek: "Wednesday" },
    { day: 4, date: "5 June 2025", dayOfWeek: "Thursday" },
  ];

  const timeSlots = [
    "11 am",
    "12 pm",
    "1 pm",
    "2 pm",
    "3 pm",
    "4 pm",
    "5 pm"
  ];

  // Unavailable slots (day, time)
  const unavailableSlots = [
    { day: 1, time: "11 am" },
    { day: 1, time: "12 pm" },
    { day: 2, time: "1 pm" },
    { day: 4, time: "2 pm" },
  ];

  const isSlotUnavailable = (day, time) => {
    return unavailableSlots.some(slot => slot.day === day && slot.time === time);
  };

  const handleSlotClick = (day, time) => {
    if (!isSlotUnavailable(day, time)) {
      setSelectedSlot({
        day: day.day,
        dayOfWeek: day.dayOfWeek,
        date: day.date,
        time: time
      });
      setShowConfirmModal(true);
    }
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
  };

  const handleConfirm = () => {
    // Here you would typically send the booking information to a server
    setShowConfirmModal(false);
    // You could also show a success message or redirect
  };

  // Format the time range for display (e.g., "3 pm" becomes "3.00pm-4.00pm")
  const formatTimeRange = (timeString) => {
    const hour = parseInt(timeString.split(' ')[0]);
    const period = timeString.split(' ')[1];

    const startHour = period === 'am' ? hour : hour + 12;
    const endHour = startHour + 1;

    const formattedStart = `${startHour > 12 ? startHour - 12 : startHour}.00${period}`;
    const formattedEnd = `${endHour > 12 ? endHour - 12 : endHour}.00${endHour >= 12 ? 'pm' : 'am'}`;

    return `${formattedStart}-${formattedEnd}`;
  };

  return (
    <div className="schedule-container">
      {/* Header */}
      <div className="schedule-header">
        <h1 className="schedule-title">Schedule your meeting</h1>
        <p className="schedule-subtitle">
          Kindly select the available time slots to book a meeting
        </p>
        <p className="schedule-subtitle">
          For more information or any updates, kindly contact pr@elite.com.my or WhatsApp, +6016-704 8058
        </p>
      </div>

      {/* Content */}
      <div className="schedule-content">
        {/* Company details */}
        <div className="company-info">
          <p className="company-detail">Company Name: {companyName}</p>
          <p className="company-detail">Booth Number: {boothNumber}</p>
        </div>

        {/* Legend */}
        <div className="legend-container">
          <div className="legend-item">
            <div className="legend-available"></div>
            <span>Available</span>
          </div>
          <div className="legend-item">
            <div className="legend-unavailable"></div>
            <span>Unavailable</span>
          </div>
        </div>

        {/* Schedule table */}
        <div className="schedule-table-container">
          <table className="schedule-table">
            <thead>
              <tr>
                <th className="time-header">
                  <div>Time</div>
                  <div className="time-label">(UTC+8)</div>
                </th>
                {days.map((day) => (
                  <th key={day.day} className="day-header">
                    <div className="day-number">Day {day.day}</div>
                    <div className="day-date">{day.date}</div>
                    <div className="day-name">({day.dayOfWeek})</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => (
                <tr key={time}>
                  <td className="time-cell">{time}</td>
                  {days.map((day) => {
                    const unavailable = isSlotUnavailable(day.day, time);
                    return (
                      <td
                        key={`${day.day}-${time}`}
                        className={`slot-cell ${unavailable ? 'slot-unavailable' : ''}`}
                        onClick={() => !unavailable && handleSlotClick(day, time)}
                      >
                        {/* Empty cell with background color for status */}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Back button */}
        <div className="button-container">
          <button className="previous-button">
            Back to Previous
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="modal-overlay modal-background">
          <div className="modal-container">
            {/* Close button */}
            <button
              onClick={handleCancel}
              className="modal-close-button"
            >
              ×
            </button>

            <div className="modal-content">
              <h2 className="modal-title">Selected Date and Time</h2>

              <div className="modal-info">
                <p className="modal-day">Day {selectedSlot.day}</p>
                <p className="modal-date">Date: {selectedSlot.date.split(' ')[0]} {selectedSlot.date.split(' ')[1]} {selectedSlot.date.split(' ')[2]} ({selectedSlot.dayOfWeek})</p>
                <p className="modal-time">Time: {formatTimeRange(selectedSlot.time)}</p>
              </div>

              <div className="modal-buttons">
                <button
                  onClick={handleCancel}
                  className="cancel-button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="confirm-button"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleMeeting;
