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
    <div className="max-w-4xl mx-auto overflow-hidden border border-gray-200 rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#40033f] to-[#9c0c40] p-6">
        <h1 className="text-2xl font-bold text-white">Schedule your meeting</h1>
        <p className="mt-1 text-sm text-white">
          Kindly select the available time slots to book a meeting
        </p>
        <p className="mt-1 text-sm text-white">
          For more information or any updates, kindly contact pr@elite.com.my or WhatsApp, +6016-704 8058
        </p>
      </div>

      {/* Content */}
      <div className="p-6 bg-white">
        {/* Company details */}
        <div className="mb-4">
          <p className="font-medium">Company Name: {companyName}</p>
          <p className="font-medium">Booth Number: {boothNumber}</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border border-gray-300 rounded-full"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-[#9c0c40] rounded-full"></div>
            <span>Unavailable</span>
          </div>
        </div>

        {/* Schedule table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left border border-gray-300">
                  <div>Time</div>
                  <div className="text-xs">(UTC+8)</div>
                </th>
                {days.map((day) => (
                  <th key={day.day} className="p-2 text-center border border-gray-300">
                    <div>Day {day.day}</div>
                    <div className="text-xs">{day.date}</div>
                    <div className="text-xs">({day.dayOfWeek})</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {timeSlots.map((time) => (
                <tr key={time}>
                  <td className="p-2 border border-gray-300">{time}</td>
                  {days.map((day) => {
                    const unavailable = isSlotUnavailable(day.day, time);
                    return (
                      <td
                        key={`${day.day}-${time}`}
                        className={`p-2 border border-gray-300 text-center cursor-pointer ${
                          unavailable ? 'bg-[#9c0c40]' : ''
                        }`}
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
        <div className="flex justify-end mt-8">
          <button className="px-6 py-2 text-[#9c0c40] border border-[#9c0c40] rounded-full">
            Back to Previous
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: '#584058B5' }}>
          <div className="relative w-full max-w-md p-6 mx-4 bg-white rounded-2xl">
            {/* Close button */}
            <button
              onClick={handleCancel}
              className="absolute text-xl font-light text-gray-500 top-4 right-4"
            >
              ×
            </button>

            <div className="flex flex-col items-center">
              <h2 className="my-6 text-xl font-semibold text-center">Selected Date and Time</h2>

              <div className="w-full mb-8 text-center">
                <p className="text-lg font-medium">Day {selectedSlot.day}</p>
                <p className="text-base">Date: {selectedSlot.date.split(' ')[0]} {selectedSlot.date.split(' ')[1]} {selectedSlot.date.split(' ')[2]} ({selectedSlot.dayOfWeek})</p>
                <p className="text-base">Time: {formatTimeRange(selectedSlot.time)}</p>
              </div>

              <div className="flex justify-center gap-4 mt-4">
                <button
                  onClick={handleCancel}
                  className="px-8 py-2 text-sm border border-[#9c0c40] text-[#9c0c40] rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-8 py-2 text-sm text-white bg-[#40033f] rounded-full"
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
