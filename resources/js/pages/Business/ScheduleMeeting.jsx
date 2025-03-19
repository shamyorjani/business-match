import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ScheduleMeeting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  // Track if we're updating an existing slot
  const [isUpdating, setIsUpdating] = useState(false);

  // Remove multiple mode state
  // const [selectedCompanies, setSelectedCompanies] = useState([]);
  // const [multipleMode, setMultipleMode] = useState(false);

  // Get selected exhibitors from navigation state
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    if (location.state && location.state.selectedExhibitors) {
      // Process exhibitor data from navigation state
      const exhibitorData = location.state.selectedExhibitors.map(exhibitor => ({
        name: exhibitor.name,
        boothNumber: exhibitor.boothNumber
      }));
      setCompanies(exhibitorData);

      // If we have scheduled slots from previous state, restore them
      if (location.state.scheduledMeetings && location.state.scheduledMeetings.length > 0) {
        setSelectedSlots(location.state.scheduledMeetings);
      } else if (location.state.meetings) {
        // Convert meetings format from ThankYou page back to our format when returning
        const convertedMeetings = location.state.meetings.map(meeting => ({
          day: meeting.day,
          date: meeting.date,
          dayOfWeek: meeting.dayOfWeek,
          time: convertTimeRangeToSimpleTime(meeting.time),
          company: meeting.exhibitor,
          boothNumber: meeting.boothNumber
        }));
        setSelectedSlots(convertedMeetings);
      }

      // Find the first company without a meeting scheduled
      const scheduledMeetings = location.state.scheduledMeetings ||
                               (location.state.meetings ? location.state.meetings.map(m => ({ company: m.exhibitor })) : []);

      const unscheduledCompany = exhibitorData.find(company =>
        !scheduledMeetings.some(slot => slot.company === company.name)
      );

      // Set default selected company to the first unscheduled company, or the first company if all are scheduled
      if (unscheduledCompany) {
        setSelectedCompany(unscheduledCompany.name);
      } else if (exhibitorData.length > 0) {
        setSelectedCompany(exhibitorData[0].name);
      }
    } else {
      // Fallback data if no companies were passed
      setCompanies([
        { name: "ABC Company", boothNumber: "A11" },
        { name: "XYZ Corporation", boothNumber: "B22" },
        { name: "123 Industries", boothNumber: "C33" }
      ]);
      setSelectedCompany("ABC Company");
    }
  }, [location]);

  // Convert time range back to simple time (e.g., "3.00pm-4.00pm" becomes "3 pm")
  const convertTimeRangeToSimpleTime = (timeRange) => {
    const startTime = timeRange.split('-')[0].trim();
    const hour = parseInt(startTime);
    const period = startTime.includes('am') ? 'am' : 'pm';
    return `${hour} ${period}`;
  };

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
    return selectedSlots.some(slot =>
      slot.day === day &&
      slot.time === time &&
      slot.company === selectedCompany
    );
  };

  // Find which company has this slot scheduled
  const getSlotCompany = (day, time) => {
    const slot = selectedSlots.find(slot => slot.day === day && slot.time === time);
    return slot ? slot.company : null;
  };

  const handleSlotClick = (day, time) => {
    if (isSlotUnavailable(day, time)) return;

    // Remove multipleMode check and related code
    // Original single company code
    const existingSlotIndex = selectedSlots.findIndex(slot =>
      slot.day === day.day && slot.time === time
    );

    // If this slot is already selected
    if (existingSlotIndex !== -1) {
      const existingSlot = selectedSlots[existingSlotIndex];

      // Only allow changing slots for the currently selected company
      if (existingSlot.company === selectedCompany) {
        setSelectedSlot(existingSlot);
        setIsUpdating(true);
        setShowConfirmModal(true);
      } else {
        // Optionally show an alert that this slot belongs to another company
        alert(`This slot is already scheduled for ${existingSlot.company}. Please select a different time.`);
      }
      return;
    }

    // Check if company already has a meeting scheduled
    const companyHasMeeting = selectedSlots.some(slot => slot.company === selectedCompany);
    if (companyHasMeeting && !isUpdating) {
      // If trying to schedule a second meeting for the same company
      alert(`${selectedCompany} already has a scheduled meeting. Please select a different company or remove their existing meeting first.`);
      return;
    }

    setSelectedSlot({
      day: day.day,
      dayOfWeek: day.dayOfWeek,
      date: day.date,
      time: time,
      company: selectedCompany,
      boothNumber: companies.find(c => c.name === selectedCompany)?.boothNumber
    });
    setShowConfirmModal(true);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setIsUpdating(false);
  };

  const handleConfirm = () => {
    // Remove multipleMode check and related code

    // Original single company logic
    if (isUpdating) {
      // Remove the old slot for this company
      setSelectedSlots(selectedSlots.filter(slot => slot.company !== selectedCompany));
      setIsUpdating(false);
    }

    // Add the selected slot to the list of selected slots
    setSelectedSlots([...selectedSlots.filter(slot => slot.company !== selectedCompany), selectedSlot]);
    setShowConfirmModal(false);

    // Automatically switch to next unscheduled company
    const companiesWithMeetings = new Set([...selectedSlots.map(slot => slot.company), selectedCompany]);
    const nextUnscheduledCompany = companies.find(company => !companiesWithMeetings.has(company.name));

    if (nextUnscheduledCompany) {
      setSelectedCompany(nextUnscheduledCompany.name);
    }
  };

  const handleCompanyChange = (e) => {
    // Remove multipleMode check and related code
    setSelectedCompany(e.target.value);
  };

  // Remove toggleMultipleMode function as it's no longer needed

  const handleNextClick = () => {
    // Only allow next if all companies have meetings scheduled
    if (selectedSlots.length < companies.length) {
      alert("Please schedule meetings for all companies before proceeding.");
      return;
    }

    // Format the meeting data for the ThankYou page
    const meetings = selectedSlots.map(slot => ({
      day: slot.day,
      date: slot.date,
      dayOfWeek: slot.dayOfWeek,
      time: formatTimeRange(slot.time),
      exhibitor: slot.company,
      boothNumber: slot.boothNumber
    }));

    // Navigate to thank you page with scheduled meetings data
    navigate('/business/thankyou', {
      state: {
        meetings,
        selectedExhibitors: companies // Pass the companies to preserve data when returning
      }
    });
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

  const handleBack = () => {
    // Pass back selected exhibitors and scheduled meetings
    navigate('/business/exhibitor-matching', {
      state: {
        selectedExhibitors: companies.map(c => c.name),
        scheduledMeetings: selectedSlots
      }
    });
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
      <div className="py-4 px-14 white">
        {/* Company details */}
        <div className='flex justify-between align-bottom'>
          <div className="mb-4">
            <div className="relative inline-block w-64 mb-2">
              {/* Remove multiple selection checkbox */}

              {/* Improved dropdown design */}
              <select
                value={selectedCompany}
                onChange={handleCompanyChange}
                className="block appearance-none w-full bg-white border-2 border-gray-300 px-4 py-2 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-[16px] text-black font-medium"
              >
                {companies.map(company => {
                  const hasScheduled = selectedSlots.some(slot => slot.company === company.name);
                  return (
                    <option key={company.name} value={company.name}>
                      {company.name} {hasScheduled ? "(Scheduled)" : ""}
                    </option>
                  );
                })}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 pointer-events-none">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"></path>
                </svg>
              </div>
            </div>

            <p className="text-sm font-medium">Booth Number: {companies.find(company => company.name === selectedCompany)?.boothNumber}</p>

            {selectedSlots.some(slot => slot.company === selectedCompany) && (
              <p className="text-sm text-green-600">Meeting scheduled for this company</p>
            )}
          </div>

          {/* Selected meetings counter */}
          <div className="flex items-center">
            <span className="text-sm font-medium">
              {selectedSlots.length} of {companies.length} Meeting{companies.length !== 1 ? 's' : ''} Scheduled
            </span>
          </div>
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
                    const isSelected = selectedSlots.some(slot =>
                      slot.day === day.day && slot.time === time
                    );
                    const slotCompany = getSlotCompany(day.day, time);
                    const isOwnedByCurrentCompany = slotCompany === selectedCompany;

                    let cellClass = "p-2 border border-gray-300 text-center cursor-pointer";
                    if (unavailable) {
                      cellClass += " bg-[#9c0c40]";
                    } else if (isSelected) {
                      cellClass += " bg-green-400 relative"; // Always make it relative for displaying the company name
                    }

                    return (
                      <td
                        key={`${day.day}-${time}`}
                        className={cellClass}
                        onClick={() => !unavailable && handleSlotClick(day, time)}
                      >
                        {isSelected && (
                          <span className="absolute text-xs font-medium -translate-x-1/2 left-1/2 -top-3 bg-white px-1 rounded">
                            {slotCompany}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between mt-8">
          <button
            className="px-8 py-2 btn-secondary"
            onClick={handleBack}
          >
            Back to Previous
          </button>

          <button
            className="px-8 py-2 bg-[#40033f] text-white rounded-md disabled:opacity-50"
            onClick={handleNextClick}
            disabled={selectedSlots.length < companies.length}
          >
            Next
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
              <h2 className="my-6 text-xl font-semibold text-center">
                {isUpdating ? "Update Meeting Time" : "Confirm Meeting Time"}
              </h2>
              <hr className='w-full h-0.5'/>
              <div className="w-full p-10 text-center">
                {/* Remove multipleMode check */}
                <p className="text-lg font-medium">Day {selectedSlot.day}</p>
                <p className="text-base">Date: {selectedSlot.date} ({selectedSlot.dayOfWeek})</p>
                <p className="text-base">Time: {formatTimeRange(selectedSlot.time)}</p>
                <p className="text-base">Company: {selectedSlot.company}</p>
                <p className="text-base">Booth: {selectedSlot.boothNumber}</p>
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
