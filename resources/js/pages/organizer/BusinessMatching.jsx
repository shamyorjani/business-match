import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BusinessMatching = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentScheduleIndex, setCurrentScheduleIndex] = useState(0);
  const [businessData, setBusinessData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // New state variables for approval features
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [currentAction, setCurrentAction] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [refreshData, setRefreshData] = useState(false);

  useEffect(() => {
    // Fetch business meetings data
    const fetchBusinessMeetings = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/schedule-meetings/business');

        // Add some debugging to see what's being returned
        console.log("API Response:", response.data);

        // Set the business data (even if it's empty)
        setBusinessData(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching business meetings:', err);

        // More detailed error message
        const errorMessage = err.response?.data?.message
          ? `Failed to fetch business meetings: ${err.response.data.message}`
          : 'Failed to fetch business meetings. Please try again later.';

        setError(errorMessage);
        setBusinessData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBusinessMeetings();
  }, [refreshData]);

  // Filter data based on search query
  const filteredData = businessData.filter(item => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.company.toLowerCase().includes(query) ||
      item.companySize.toLowerCase().includes(query) ||
      item.status.toLowerCase().includes(query)
    );
  });

  const handleViewClick = (item) => {
    setSelectedItem(item);
    setCurrentScheduleIndex(0);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const nextSchedule = () => {
    if (selectedItem && selectedItem.schedules.length > 1) {
      setCurrentScheduleIndex((prev) => (prev + 1) % selectedItem.schedules.length);
    }
  };

  const prevSchedule = () => {
    if (selectedItem && selectedItem.schedules.length > 1) {
      setCurrentScheduleIndex((prev) =>
        prev === 0 ? selectedItem.schedules.length - 1 : prev - 1
      );
    }
  };

  // New functions for meeting approval/rejection

  // Approve a single meeting (no email)
  const approveMeeting = async (id) => {
    try {
      setProcessing(true);
      const response = await axios.post(`/api/meetings/${id}/approve`);

      // Update the data in the state
      const updatedData = businessData.map(item => {
        if (item.id === id) {
          return { ...item, status: 'Approved' };
        }
        return item;
      });

      setBusinessData(updatedData);
      setProcessing(false);
      setRefreshData(prev => !prev); // Trigger refresh
      return response.data;
    } catch (error) {
      console.error('Error approving meeting:', error);
      setProcessing(false);
      return null;
    }
  };

  // Reject a single meeting
  const rejectMeeting = async (id) => {
    try {
      setProcessing(true);
      const response = await axios.post(`/api/meetings/${id}/reject`);

      // Update the data in the state
      const updatedData = businessData.map(item => {
        if (item.id === id) {
          return { ...item, status: 'Rejected' };
        }
        return item;
      });

      setBusinessData(updatedData);
      setProcessing(false);
      setRefreshData(prev => !prev); // Trigger refresh
      return response.data;
    } catch (error) {
      console.error('Error rejecting meeting:', error);
      setProcessing(false);
      return null;
    }
  };

  // Check if all meetings for a user-company pair are processed
  const checkAllProcessed = async (userId, visitorCompanyId) => {
    try {
      const response = await axios.post('/api/meetings/check-processed', {
        user_id: userId,
        visitor_company_id: visitorCompanyId
      });

      return response.data;
    } catch (error) {
      console.error('Error checking meetings status:', error);
      return { allProcessed: false, pendingCount: 0 };
    }
  };

  // Approve all meetings for a user-company pair
  const approveAllMeetings = async (item) => {
    try {
      if (!item || !item.schedules || item.schedules.length === 0) {
        return;
      }

      // Extract user_id and visitor_company_id from the first schedule
      const firstSchedule = item.schedules[0];
      const meeting = await axios.get(`/api/meetings/${firstSchedule.id}`);
      const userId = meeting.data.user_id;
      const visitorCompanyId = meeting.data.visitor_company_id;

      const response = await axios.post('/api/meetings/approve-all', {
        user_id: userId,
        visitor_company_id: visitorCompanyId
      });

      // Update UI
      setRefreshData(prev => !prev);
      return response.data;
    } catch (error) {
      console.error('Error approving all meetings:', error);
      return null;
    }
  };

  // Handle click on table approve button (send email)
  const handleApproveClick = async (item) => {
    if (item.status === 'Approved' || item.status === 'Rejected') {
      alert('This meeting has already been ' + item.status.toLowerCase());
      return;
    }

    await approveMeeting(item.id);
  };

  // Handle click on table reject button
  const handleRejectClick = async (item) => {
    if (item.status === 'Approved' || item.status === 'Rejected') {
      alert('This meeting has already been ' + item.status.toLowerCase());
      return;
    }

    await rejectMeeting(item.id);
  };

  // Handle click on modal approve button
  const handleModalApprove = async () => {
    if (!selectedItem) return;

    try {
      const response = await axios.post(`/api/meetings/${selectedItem.id}/approve`);

      setRefreshData(prev => !prev);
      closeModal();
    } catch (error) {
      console.error('Error approving in modal:', error);
    }
  };

  // Handle click on "Approve All" button
  const handleApproveAll = async () => {
    if (!selectedItem) return;

    // Check if all meetings are processed first
    const firstSchedule = selectedItem.schedules[0];
    const meeting = await axios.get(`/api/meetings/${firstSchedule.id}`);
    const userId = meeting.data.user_id;
    const visitorCompanyId = meeting.data.visitor_company_id;

    const checkResult = await checkAllProcessed(userId, visitorCompanyId);

    if (!checkResult.allProcessed) {
      // Show warning modal
      setWarningMessage(`You have ${checkResult.pendingCount} pending meetings. Do you want to approve them all?`);
      setCurrentAction('approve-all');
      setShowWarningModal(true);
      return;
    }

    // If we get here, all meetings are already processed
    alert('All meetings have already been processed.');
  };

  // Handle confirmation from warning modal
  const handleConfirmAction = async () => {
    if (currentAction === 'approve-all') {
      await approveAllMeetings(selectedItem);
    }

    setShowWarningModal(false);
    setRefreshData(prev => !prev);
    closeModal();
  };

  if (loading) {
    return <div className="p-16 py-10 text-center">Loading business meetings...</div>;
  }

  if (error) {
    return <div className="p-16 py-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-16 py-10">
      <div className="flex justify-between mt-6 mb-6">
        <button className="flex items-center px-4 py-1 text-sm border border-gray-300 rounded-full">
          <span className="mr-1">+</span> Add more categories
        </button>

        {/* Search input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Type Here to Search"
            className="w-64 px-4 py-1 pr-8 text-sm border border-gray-300 rounded-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute transform -translate-y-1/2 right-3 top-1/2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Table */}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-4 py-3 text-sm font-medium text-left">
              <div className="flex items-center">
                Name
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </th>
            <th className="px-4 py-3 text-sm font-medium text-left">
              <div className="flex items-center">
                Company
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </th>
            <th className="px-4 py-3 text-sm font-medium text-left">
              <div className="flex items-center">
                Company size
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </th>
            <th className="px-4 py-3 text-sm font-medium text-left">
              <div className="flex items-center">
                Schedule Meetings
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </th>
            <th className="px-4 py-3 text-sm font-medium text-left">
              <div className="flex items-center">
                Status
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </th>
            <th className="px-4 py-3 text-sm font-medium text-left">
              <div className="flex items-center">
                Action
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="px-4 py-4">{item.name}</td>
                <td className="px-4 py-4">{item.company}</td>
                <td className="px-4 py-4">{item.companySize}</td>
                <td className="px-4 py-4">
                  <a
                    href="#"
                    className="text-black underline"
                    onClick={(e) => {
                      e.preventDefault();
                      handleViewClick(item);
                    }}
                  >
                    View
                  </a>
                </td>
                <td className="px-4 py-4">
                  <span className={
                    item.status === 'Approved' ? 'text-green-600' :
                    item.status === 'Rejected' ? 'text-red-600' : ''
                  }>
                    {item.status}
                  </span>
                </td>
                <td className="flex items-center gap-2 px-4 py-4">
                  <button
                    className="px-2 py-1 text-white bg-green-500 rounded-full hover:bg-green-700"
                    onClick={() => handleApproveClick(item)}
                    disabled={processing || item.status === 'Approved' || item.status === 'Rejected'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </button>

                  <button
                    className="px-2 py-1 text-white bg-red-500 rounded-full hover:bg-red-700"
                    onClick={() => handleRejectClick(item)}
                    disabled={processing || item.status === 'Approved' || item.status === 'Rejected'}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-4 py-4 text-center">
                No business meetings found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Detail Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(88, 64, 88, 0.7)' }}>
          <div className="relative w-full max-w-lg p-6 mx-4 bg-white shadow-lg rounded-xl">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="modal-close"
            >
              ×
            </button>
            <h2 className="mb-4 text-lg font-medium">Schedule Meetings:</h2>
            <div className="px-4">
              {/* Visitor Details */}
              <div className="space-y-1 text-sm">
                <p>Visitor Name: {selectedItem.name}</p>
                <p>Phone number: {selectedItem.phoneNumber}</p>
                <p>Company Name: {selectedItem.company}</p>
                <p>Company Registration Number: {selectedItem.registrationNumber}</p>
                <p>Company Nature of Business: {selectedItem.businessNature}</p>
                <p>Company Country/ Region: {selectedItem.country}</p>
              </div>

              {/* Divider */}
              <div className="my-4 border-t border-gray-200"></div>

              {/* Meeting Schedule */}
              {selectedItem.schedules && selectedItem.schedules.length > 0 && (
                <div className="relative pr-8 text-sm">
                  <div className="space-y-1">
                    <p className="font-bold">Day {selectedItem.schedules[currentScheduleIndex].day}</p>
                    <p className="font-bold">Date: {selectedItem.schedules[currentScheduleIndex].date} ({selectedItem.schedules[currentScheduleIndex].dayOfWeek})</p>
                    <p className="font-bold">Time: {selectedItem.schedules[currentScheduleIndex].time}</p>
                    <p className="font-bold">Exhibitor: {selectedItem.schedules[currentScheduleIndex].exhibitor}</p>
                    <p className="font-bold">Booth Number: {selectedItem.schedules[currentScheduleIndex].boothNumber}</p>
                  </div>

                  {selectedItem.schedules.length > 1 && (
                    <button
                      onClick={nextSchedule}
                      className="absolute right-0 transform -translate-y-1/2 top-1/2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              )}

              {/* Navigation dots with counter */}
              {selectedItem.schedules && selectedItem.schedules.length > 1 && (
                <div className="flex flex-col items-center mt-4">
                  <p className="mb-1 text-xs text-gray-500">
                    {currentScheduleIndex + 1} of {selectedItem.schedules.length} meetings
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    {selectedItem.schedules.map((_, index) => (
                      <span
                        key={index}
                        className={`inline-block w-2 h-2 rounded-full ${
                          currentScheduleIndex === index ? 'bg-black h-3 w-3' : 'bg-gray-300'
                        } cursor-pointer`}
                        onClick={() => setCurrentScheduleIndex(index)}
                      ></span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-row items-center gap-3 p-3">
                <button className="px-5 py-1.5 text-sm border border-[#9c0c40] text-[#9c0c40] rounded-full">
                  Delete
                </button>
                <button className="px-5 py-1.5 text-sm border border-[#9c0c40] text-[#9c0c40] rounded-full">
                  Edit
                </button>
                <button
                  className="px-5 py-1.5 text-sm bg-[#40033f] text-white rounded-full"
                  onClick={handleModalApprove}
                  disabled={selectedItem.status === 'Approved' || selectedItem.status === 'Rejected'}
                >
                  Approve
                </button>
                <button
                  className="px-5 py-1.5 text-sm bg-[#9c0c40] text-white rounded-full"
                  onClick={handleApproveAll}
                >
                  Approve All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning Modal for Approve/Reject All */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(88, 64, 88, 0.7)' }}>
          <div className="relative w-full max-w-md p-6 mx-4 bg-white shadow-lg rounded-xl">
            <button
              onClick={() => setShowWarningModal(false)}
              className="absolute text-gray-500 top-2 right-2 hover:text-gray-700"
            >
              ×
            </button>

            <h3 className="mb-4 text-lg font-medium text-center">Attention</h3>

            <p className="mb-6 text-center">{warningMessage}</p>

            <div className="flex justify-center gap-4">
              <button
                className="px-5 py-2 text-sm text-white bg-[#40033f] rounded-full"
                onClick={handleConfirmAction}
              >
                Approve All
              </button>

              <button
                className="px-5 py-2 text-sm border border-[#9c0c40] text-[#9c0c40] rounded-full"
                onClick={() => setShowWarningModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-5 py-2 text-sm text-white bg-[#9c0c40] rounded-full"
                onClick={() => {
                  setShowWarningModal(false);
                  // Keep the main modal open
                }}
              >
                View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessMatching;
