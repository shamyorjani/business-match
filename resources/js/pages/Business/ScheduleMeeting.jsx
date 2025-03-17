import React, { useState } from 'react';

const ScheduleMeeting = () => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("ABC Company");
  const [selectedSlots, setSelectedSlots] = useState([]);

  // Company data
  const companies = [
    { name: "ABC Company", boothNumber: "A11" },
    { name: "XYZ Corporation", boothNumber: "B22" },
    { name: "123 Industries", boothNumber: "C33" }
  ];

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

  const isSlotSelected = (day, time) => {
    return selectedSlots.some(slot => slot.day === day && slot.time === time);
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
    // Add the selected slot to the list of selected slots
    setSelectedSlots([...selectedSlots, selectedSlot]);
    setShowConfirmModal(false);
  };

  const handleCompanyChange = (e) => {
    const selected = companies.find(company => company.name === e.target.value);
    setSelectedCompany(selected.name);
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
    <div className="form-container">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#40033f] to-[#9c0c40] px-14 py-8">
        <h1 className="text-2xl font-bold text-white">Schedule your meeting</h1>
        <p className="mt-1 text-sm text-white">
          Kindly select the available time slots to book a meeting
        </p>
        <p className="mt-1 text-sm text-white">
          For more information or any updates, kindly contact pr@elite.com.my or WhatsApp, +6016-704 8058
        </p>
      </div>

      {/* Content */}
      <div className="py-4 px-14 white ">
        {/* Company details */}
       <div className='flex justify-between align-bottom'>
       <div className="mb-4">
          <div className="relative inline-block w-56 mb-2">
            <select
              value={selectedCompany}
              onChange={handleCompanyChange}
              className="block appearance-none w-full bg-white border border-black px-2 py-0 pr-8 rounded-4xl shadow-sm focus:outline-none focus:ring-1 ring-black text-[16px] text-black font-medium"
            >
              {companies.map(company => (
                <option key={company.name} value={company.name}>
                  {company.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 text-black pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>
          <p className="text-sm font-medium">Booth Number: {companies.find(company => company.name === selectedCompany)?.boothNumber}</p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mb-4 font-medium">
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 bg-white border border-gray-300 rounded-full"></div>
            <span className="text-sm">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 bg-[#9c0c40] rounded-full"></div>
            <span className="text-sm">Unavailable</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 bg-green-400 rounded-full"></div>
            <span className="text-sm">Selected</span>
          </div>
        </div>
       </div>

        {/* Schedule table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-center border border-gray-300 bg-gray-50">
                  <div>Time</div>
                  <div className="text-xs">(UTC+8)</div>
                </th>
                {days.map((day) => (
                  <th key={day.day} className="p-2 text-center border border-gray-300 bg-gray-50">
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
                  <td className="p-2 text-center border border-gray-300">{time}</td>
                  {days.map((day) => {
                    const unavailable = isSlotUnavailable(day.day, time);
                    const selected = isSlotSelected(day.day, time);

                    let cellClass = "p-2 border border-gray-300 text-center cursor-pointer";
                    if (unavailable) {
                      cellClass += " bg-[#9c0c40]";
                    } else if (selected) {
                      cellClass += " bg-green-400";
                    }

                    return (
                      <td
                        key={`${day.day}-${time}`}
                        className={cellClass}
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
          <button className="px-8 py-2 btn-secondary">
            Back to Previous
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(88, 64, 88, 0.7)' }}>
          <div className="relative w-full max-w-md mx-4 bg-white shadow-lg rounded-xl">
            {/* Close button */}
            <button
              onClick={handleCancel}
              className="modal-close"
            >
              ×
            </button>

            <div className="flex flex-col items-center py-2 pb-5">
              <h2 className="my-6 text-xl font-semibold text-center">Selected Date and Time</h2>
              <hr className='w-full h-0.5'/>
              <div className="w-full p-10 text-center">
                <p className="text-lg font-medium">Day {selectedSlot.day}</p>
                <p className="text-base">Date: {selectedSlot.date} ({selectedSlot.dayOfWeek})</p>
                <p className="text-base">Time: {formatTimeRange(selectedSlot.time)}</p>
              </div>

              <div className="flex justify-center gap-4 p-4">
                <button
                  onClick={handleCancel}
                  className="px-5 py-1.5 text-sm border border-[#9c0c40] text-[#9c0c40] rounded-full"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-5 py-1.5 text-sm bg-[#40033f] text-white rounded-full"
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
