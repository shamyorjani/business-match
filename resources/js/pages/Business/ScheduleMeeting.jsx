import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Import the API service

const ScheduleMeeting = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false); // New state for cancel booking modal
  const [slotToCancel, setSlotToCancel] = useState(null); // Store the slot to be cancelled
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedSlots, setSelectedSlots] = useState([]);
  // Track if we're updating an existing slot
  const [isUpdating, setIsUpdating] = useState(false);

  // New state for message modal
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState("");

  // Add a new state for submission loading
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Function to show message modal instead of alert
  const showMessage = (message) => {
    setMessageModalContent(message);
    setShowMessageModal(true);
  };

  // Get selected exhibitors from navigation state
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    // Try to load from localStorage first
    const storedSlots = JSON.parse(localStorage.getItem('selectedMeetingSlots')) || [];

    if (location.state && location.state.selectedExhibitors) {
      // Process exhibitor data from navigation state
      const exhibitorData = location.state.selectedExhibitors;
      setCompanies(exhibitorData);

      // Get the set of currently selected company names
      const currentlySelectedCompanies = new Set(exhibitorData.map(company => company.name));

      // Filter stored slots to keep only those for currently selected companies
      const filteredSlots = storedSlots.filter(slot =>
        currentlySelectedCompanies.has(slot.company)
      );

      // Update localStorage with filtered slots
      localStorage.setItem('selectedMeetingSlots', JSON.stringify(filteredSlots));

      if (filteredSlots.length > 0) {
        console.log("Loading filtered slots from localStorage:", filteredSlots);
        setSelectedSlots(filteredSlots);
      } else {
        // Handle scheduled meetings from route state if localStorage is now empty
        if (location.state.scheduledMeetings && location.state.scheduledMeetings.length > 0) {
          const filteredMeetings = location.state.scheduledMeetings.filter(
            meeting => currentlySelectedCompanies.has(meeting.company)
          );
          setSelectedSlots(filteredMeetings);
          localStorage.setItem('selectedMeetingSlots', JSON.stringify(filteredMeetings));
        } else if (location.state.meetings && location.state.meetings.length > 0) {
          // Convert meetings format from ThankYou page back to our format
          const convertedMeetings = location.state.meetings
            .map(meeting => ({
              day: meeting.day,
              date: meeting.date,
              dayOfWeek: meeting.dayOfWeek,
              time: convertTimeRangeToSimpleTime(meeting.time),
              company: meeting.exhibitor,
              boothNumber: meeting.boothNumber
            }))
            .filter(meeting => currentlySelectedCompanies.has(meeting.company));

          setSelectedSlots(convertedMeetings);
          localStorage.setItem('selectedMeetingSlots', JSON.stringify(convertedMeetings));
        }
      }

      // Find the first company without a meeting scheduled
      const scheduledCompanies = new Set();

      // Use the filtered slots
      filteredSlots.forEach(slot => scheduledCompanies.add(slot.company));

      // Find first unscheduled company
      const unscheduledCompany = exhibitorData.find(company =>
        !scheduledCompanies.has(company.name)
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
        { name: "123 Industries", boothNumber: "C33" },
        { name: "Global Solutions", boothNumber: "D44" },
        { name: "Tech Innovators", boothNumber: "E55" },
        { name: "Future Systems", boothNumber: "F66" }
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

  // Format the time range for display (e.g., "3 pm" becomes "3.00pm-4.00pm")
  const formatTimeRange = (timeString) => {
    const hour = parseInt(timeString.split(' ')[0]);
    const period = timeString.split(' ')[1];

    const startHour = period === 'am' ? hour : (hour === 12 ? 12 : hour);
    const endHour = startHour + 1;

    const endPeriod = endHour >= 12 && period === 'pm' ? 'pm' :
                      startHour === 11 && period === 'am' ? 'pm' : period;

    const formattedStart = `${startHour}.00${period}`;
    const formattedEnd = `${endHour > 12 ? endHour - 12 : endHour}.00${endPeriod}`;

    return `${formattedStart}-${formattedEnd}`;
  };

  // Generate dates starting from tomorrow for the next 4 days
  const generateDaysFromTomorrow = () => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Start from tomorrow

    const generatedDays = [];
    for (let i = 0; i < 4; i++) { // Generate 4 days
      const currentDate = new Date(tomorrow);
      currentDate.setDate(tomorrow.getDate() + i);

      generatedDays.push({
        day: i + 1,
        date: `${currentDate.getDate()} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
        dayOfWeek: daysOfWeek[currentDate.getDay()]
      });
    }

    return generatedDays;
  };

  // Schedule data with dynamic dates
  const days = generateDaysFromTomorrow();

  const timeSlots = [
    "11 am",
    "12 pm",
    "1 pm",
    "2 pm",
    "3 pm",
    "4 pm",
    "5 pm"
  ];;

  // Company-specific unavailable slots (company, day, time)
const companyUnavailableSlots = {
    // Company 1
    "ABC Company": [
        { day: 1, time: "11 am" },
        { day: 2, time: "1 pm" },
        { day: 4, time: "4 pm" },
    ],
    // Company 2
    "HJ Company": [
        { day: 1, time: "12 pm" },
        { day: 3, time: "2 pm" },
        { day: 4, time: "5 pm" },
    ],
    // Company 3
    "AAA Company": [
        { day: 2, time: "2 pm" },
        { day: 3, time: "11 am" },
        { day: 4, time: "1 pm" },
    ],
    // Company 4
    "XYZ Company": [
        { day: 1, time: "2 pm" },
        { day: 2, time: "3 pm" },
        { day: 4, time: "12 pm" },
    ],
    // Company 5
    "Beauty Tech": [
        { day: 1, time: "3 pm" },
        { day: 2, time: "11 am" },
        { day: 3, time: "5 pm" },
    ],
    // Company 6
    "Glow Cosmetics": [
        { day: 1, time: "5 pm" },
        { day: 3, time: "12 pm" },
        { day: 4, time: "3 pm" },
    ],
    // Company 7
    "Natural Beauty": [
        { day: 1, time: "4 pm" },
        { day: 2, time: "12 pm" },
        { day: 3, time: "1 pm" },
    ],
    // Company 8
    "Luxury Skin": [
        { day: 2, time: "4 pm" },
        { day: 3, time: "3 pm" },
        { day: 4, time: "11 am" },
    ],
    // Company 9
    "Color Pop": [
        { day: 1, time: "1 pm" },
        { day: 2, time: "5 pm" },
        { day: 3, time: "4 pm" },
    ],
    // Company 10
    "Pure Elements": [
        { day: 1, time: "11 am" },
        { day: 2, time: "2 pm" },
        { day: 4, time: "5 pm" },
    ],
    // Company 11
    "Green Beauty": [
        { day: 1, time: "12 pm" },
        { day: 3, time: "2 pm" },
        { day: 4, time: "3 pm" },
    ],
    // Company 12
    "Skin Science": [
        { day: 1, time: "3 pm" },
        { day: 2, time: "4 pm" },
        { day: 3, time: "11 am" },
    ]
};

  // Default unavailable slots for companies not explicitly listed
  const defaultUnavailableSlots = [
    { day: 1, time: "11 am" },
    { day: 4, time: "2 pm" },
  ];

  const isSlotUnavailable = (day, time) => {
    // Get the unavailable slots for the currently selected company
    const companySlots = companyUnavailableSlots[selectedCompany] || defaultUnavailableSlots;

    // Check if this slot is unavailable for the selected company
    return companySlots.some(slot => slot.day === day && slot.time === time);
  };

  // Also check if the slot is already taken by another company
  const isSlotTakenByOtherCompany = (day, time) => {
    return selectedSlots.some(slot =>
      slot.day === day &&
      slot.time === time &&
      slot.company !== selectedCompany
    );
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

  // Check if any company has this slot selected (used for highlighting cells)
  const isAnyCompanySlotSelected = (day, time) => {
    return selectedSlots.some(slot => slot.day === day && slot.time === time);
  };

  const handleSlotClick = (day, time) => {
    // First check if this is the current company's slot (for cancellation)
    const existingSlot = selectedSlots.find(slot =>
      slot.day === day.day &&
      slot.time === time &&
      slot.company === selectedCompany
    );

    if (existingSlot) {
      // This is the current company's slot - show cancellation modal
      setSlotToCancel(existingSlot);
      setShowCancelModal(true);
      return;
    }

    // Check both if the slot is unavailable for this company or taken by another company
    if (isSlotUnavailable(day, time) || isSlotTakenByOtherCompany(day, time)) {
      if (isSlotTakenByOtherCompany(day, time)) {
        const occupyingCompany = getSlotCompany(day, time);
        // Replace alert with modal
        showMessage(`This slot is already scheduled for ${occupyingCompany}. Please select a different time.`);
      }
      return;
    }

    // Original single company code for adding a new booking
    const existingSlotIndex = selectedSlots.findIndex(slot =>
      slot.day === day.day && slot.time === time
    );

    // If this slot is already selected by another company
    if (existingSlotIndex !== -1) {
      const existingSlot = selectedSlots[existingSlotIndex];

      // Only allow changing slots for the currently selected company
      if (existingSlot.company === selectedCompany) {
        setSelectedSlot(existingSlot);
        setIsUpdating(true);
        setShowConfirmModal(true);
      } else {
        // Replace alert with modal
        showMessage(`This slot is already scheduled for ${existingSlot.company}. Please select a different time.`);
      }
      return;
    }

    // Check if company already has a meeting scheduled
    const companyHasMeeting = selectedSlots.some(slot => slot.company === selectedCompany);
    if (companyHasMeeting && !isUpdating) {
      // Replace alert with modal
      showMessage(`${selectedCompany} already has a scheduled meeting. Please select a different company/time or remove their existing meeting first.`);
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

  // Handler for cancelling a booking
  const handleCancelBooking = () => {
    if (!slotToCancel) return;

    // Remove the slot from selected slots
    const updatedSlots = selectedSlots.filter(slot =>
      !(slot.day === slotToCancel.day &&
        slot.time === slotToCancel.time &&
        slot.company === slotToCancel.company)
    );

    setSelectedSlots(updatedSlots);
    localStorage.setItem('selectedMeetingSlots', JSON.stringify(updatedSlots));
    setShowCancelModal(false);
    setSlotToCancel(null);
  };

  // Close the cancel modal
  const handleCancelModalClose = () => {
    setShowCancelModal(false);
    setSlotToCancel(null);
  };

  const handleCancel = () => {
    setShowConfirmModal(false);
    setIsUpdating(false);
  };

  const handleConfirm = () => {
    // Original single company logic
    if (isUpdating) {
      // Remove the old slot for this company
      setSelectedSlots(selectedSlots.filter(slot => slot.company !== selectedCompany));
      setIsUpdating(false);
    }

    // Add the selected slot to the list of selected slots
    const updatedSlots = [...selectedSlots.filter(slot => slot.company !== selectedCompany), selectedSlot];
    setSelectedSlots(updatedSlots);

    // Save to localStorage
    localStorage.setItem('selectedMeetingSlots', JSON.stringify(updatedSlots));

    setShowConfirmModal(false);

    // Automatically switch to next unscheduled company
    const companiesWithMeetings = new Set([...selectedSlots.map(slot => slot.company), selectedCompany]);
    const nextUnscheduledCompany = companies.find(company => !companiesWithMeetings.has(company.name));

    if (nextUnscheduledCompany) {
      setSelectedCompany(nextUnscheduledCompany.name);
    }
  };

  const handleCompanyChange = (e) => {
    setSelectedCompany(e.target.value);
  };

  const handleNextClick = () => {
    // Only allow submit if all companies have meetings scheduled
    if (selectedSlots.length < companies.length) {
      // Replace alert with modal
      showMessage("Please schedule meetings for all companies before proceeding.");
      return;
    }

    // Format the meeting data for submission
    const meetings = selectedSlots.map(slot => ({
      day: slot.day,
      date: slot.date,
      dayOfWeek: slot.dayOfWeek,
      time: formatTimeRange(slot.time),
      exhibitor: slot.company,
      boothNumber: slot.boothNumber
    }));

    // Get all saved registration data from localStorage
    const businessData = JSON.parse(localStorage.getItem('businessRegistration') || '{}');
    const companyData = JSON.parse(localStorage.getItem('companyInfoData') || '{}');
    const selectedInterests = JSON.parse(localStorage.getItem('selectedInterests') || '[]');

    // Set loading state to true
    setIsSubmitting(true);

    // Prepare the final data for submission
    const finalData = {
      registration: {
        ...businessData,
        registration_type: 'business'
      },
      companyInfo: companyData,
      interests: selectedInterests,
      meetings: meetings
    };

    console.log('Submitting registration data:', finalData);

    // Submit all data to the backend
    api.post('/visitor/register', finalData)
      .then(response => {
        console.log('Registration successful:', response.data);

        // Clear all exhibitor selections from localStorage
        clearAllSelectedExhibitors();

        // Navigate to thank you page with scheduled meetings data
        navigate('/business/thankyou', {
          state: {
            meetings,
            selectedExhibitors: companies,
            scheduledMeetings: selectedSlots,
            registrationComplete: true,
            registrationId: response.data.registration_id || null
          }
        });
      })
      .catch(error => {
        console.error('Registration failed:', error);
        // Set loading state back to false on error
        setIsSubmitting(false);
        handleRegistrationError(error);
      });
  };

  // Add this new function to clear all exhibitor selections
  const clearAllSelectedExhibitors = () => {
    // Clear meeting slots
    localStorage.removeItem('selectedMeetingSlots');

    // Get current interests
    const savedInterests = localStorage.getItem('selectedInterests');
    if (savedInterests) {
      const interests = JSON.parse(savedInterests);
      const subcategoriesList = interests.map(interest => interest.subCategory);

      // Clear selections for each subcategory
      subcategoriesList.forEach(subcategory => {
        localStorage.removeItem(`selectedExhibitors_${subcategory}`);
      });

      // Also clear the combined selection key if it exists
      if (subcategoriesList && subcategoriesList.length > 0) {
        const sortedKey = [...subcategoriesList].sort().join('_');
        localStorage.removeItem(`selectedExhibitors_${sortedKey}`);
      }
    }
  };

  const handleRegistrationError = (error) => {
    console.error('Registration failed:', error);

    // Enhanced error logging
    if (error.response) {
      console.error('Error response data:', error.response.data);
      console.error('Error response status:', error.response.status);
      console.error('Error response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Error request:', error.request);
    } else {
      console.error('Error message:', error.message);
    }

    let errorMessage = "Registration failed. Please try again or contact support.";

    // Try to extract meaningful error message from response
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.response?.data?.error) {
      errorMessage = error.response.data.error;
    }

    showMessage(errorMessage);
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

  // Add a function to clear meeting data
  const clearMeetingData = () => {
    localStorage.removeItem('selectedMeetingSlots');
    setSelectedSlots([]);
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
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 011.414 1.414l-4 4a1 1 01-1.414 0l-4-4a1 1 010-1.414z" clipRule="evenodd"></path>
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
          <div className="flex items-center">
            <div className="w-4 h-4 mr-2 bg-orange-400 rounded-full"></div>
            <span className="text-sm">Booked by Others</span>
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
                    const isSelected = isAnyCompanySlotSelected(day.day, time);
                    const slotCompany = getSlotCompany(day.day, time);
                    const isOwnedByCurrentCompany = slotCompany === selectedCompany;
                    const isTakenByOther = isSlotTakenByOtherCompany(day.day, time);

                    let cellClass = "p-2 border border-gray-300 text-center cursor-pointer";
                    if (unavailable) {
                      cellClass += " bg-[#9c0c40]"; // Company's unavailable slot
                    } else if (isTakenByOther) {
                      cellClass += " bg-orange-400 relative"; // Taken by another company
                    } else if (isSelected && isOwnedByCurrentCompany) {
                      cellClass += " bg-green-400 relative"; // Current company's selected slot
                    }

                    return (
                      <td
                        key={`${day.day}-${time}`}
                        className={cellClass}
                        onClick={() => handleSlotClick(day, time)}
                        title={isOwnedByCurrentCompany ? "Click to cancel booking" :
                               unavailable ? "Unavailable" :
                               isTakenByOther ? `Booked by ${slotCompany}` : "Click to book"}
                      >
                        {isSelected && (
                          <span className="absolute px-1 text-xs font-medium -translate-x-1/2 bg-white rounded left-1/2 -top-3">
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
            disabled={isSubmitting}
          >
            Back to Previous
          </button>

          <button
            className="px-8 py-2 bg-[#40033f] text-white rounded-4xl disabled:opacity-50"
            onClick={handleNextClick}
            disabled={selectedSlots.length < companies.length || isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </span>
            ) : (
              "Submit"
            )}
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

      {/* Cancellation Modal */}
      {showCancelModal && slotToCancel && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(88, 64, 88, 0.7)' }}>
          <div className="relative w-full max-w-md mx-4 bg-white shadow-lg rounded-xl">
            {/* Close button */}
            <button
              onClick={handleCancelModalClose}
              className="modal-close"
            >
              ×
            </button>

            <div className="flex flex-col items-center py-2 pb-5">
              <h2 className="my-6 text-xl font-semibold text-center">
                Cancel Meeting Booking
              </h2>
              <hr className='w-full h-0.5'/>
              <div className="w-full p-10 text-center">
                <p className="text-lg font-medium">Are you sure you want to cancel this meeting?</p>
                <p className="mt-4 text-base">Day {slotToCancel.day}</p>
                <p className="text-base">Date: {slotToCancel.date} ({slotToCancel.dayOfWeek})</p>
                <p className="text-base">Time: {formatTimeRange(slotToCancel.time)}</p>
                <p className="text-base">Company: {slotToCancel.company}</p>
                <p className="text-base">Booth: {slotToCancel.boothNumber}</p>
              </div>

              <div className="flex justify-center gap-4 p-4">
                <button
                  onClick={handleCancelModalClose}
                  className="px-5 py-1.5 text-sm border border-[#9c0c40] text-[#9c0c40] rounded-full"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  className="px-5 py-1.5 text-sm bg-[#9c0c40] text-white rounded-full"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Message Modal */}
      {showMessageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(88, 64, 88, 0.7)' }}>
          <div className="relative w-full max-w-md mx-4 bg-white shadow-lg rounded-xl">
            {/* Close button */}
            <button
              onClick={() => setShowMessageModal(false)}
              className="modal-close"
            >
              ×
            </button>

            <div className="flex flex-col items-center py-2 pb-5">
              <h2 className="my-6 text-xl font-semibold text-center">
                Information
              </h2>
              <hr className='w-full h-0.5'/>
              <div className="w-full p-10 text-center">
                <p className="text-base">{messageModalContent}</p>
              </div>

              <div className="flex justify-center gap-4 p-4">
                <button
                  onClick={() => setShowMessageModal(false)}
                  className="px-5 py-1.5 text-sm bg-[#40033f] text-white rounded-full"
                >
                  OK
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
