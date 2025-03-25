import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Configure Axios to always use the correct backend URL
// This ensures we don't accidentally send requests to the Vite dev server
axios.defaults.baseURL = 'http://127.0.0.1:8000';

// Create a special API instance with proper headers
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

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
        const response = await axios.get('/api/business-meetings');
        setBusinessData(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching business meetings:', err);
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

  // Enhance approveAllMeetings with better debugging
  const approveAllMeetings = async (item) => {
    try {
      if (!item || !item.schedules || item.schedules.length === 0) {
        console.error('Invalid item or no schedules found:', item);
        return null;
      }

      // Extract user_id and visitor_company_id from the first schedule
      const firstSchedule = item.schedules[0];
      if (!firstSchedule || !firstSchedule.id) {
        console.error('Invalid first schedule:', firstSchedule);
        return null;
      }

      // Get meeting details
      const meeting = await axios.get(`/api/meetings/${firstSchedule.id}`);
      if (!meeting.data) {
        console.error('No meeting data found for ID:', firstSchedule.id);
        return null;
      }

      const userId = meeting.data.user_id;
      const visitorCompanyId = meeting.data.visitor_company_id;

      if (!userId || !visitorCompanyId) {
        console.error('Missing user_id or visitor_company_id:', { userId, visitorCompanyId });
        return null;
      }

      // Approve each meeting individually using the direct update endpoint
      for (const schedule of item.schedules) {
        try {
          const response = await axios.post(`/api/direct-meeting-approve/${schedule.id}`);
        } catch (error) {
          console.error(`Error approving meeting ${schedule.id}:`, error);
        }
      }

      // Update the UI state for all meetings
      const updatedData = businessData.map(businessItem => {
        if (businessItem.id === item.id) {
          // Update the main item status
          const updatedItem = {
            ...businessItem,
            status: 'Approved'
          };
          
          // Update all schedules to approved status (status 4)
          if (updatedItem.schedules) {
            updatedItem.schedules = updatedItem.schedules.map(schedule => ({
              ...schedule,
              status: 4 // Status 4 means approved
            }));
          }
          
          return updatedItem;
        }
        return businessItem;
      });

      setBusinessData(updatedData);
      setRefreshData(prev => !prev);
      
      return { success: true };
    } catch (error) {
      console.error('Error in approveAllMeetings:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      console.error('Error approving all meetings:', error);
      return null;
    }
  };

  // Handle click on "Approve All" button
  const handleApproveAll = async () => {
    if (!selectedItem) return;

    try {
      setProcessing(true);

      // Directly approve all meetings without checking status
      const result = await approveAllMeetings(selectedItem);
      if (result) {
        console.log('All meetings have been approved successfully!');
        closeModal(); // Close the modal after successful approval
      } else {
        console.log('Failed to approve all meetings. Please try again.');
      }
    } catch (error) {
      console.log('An error occurred while approving all meetings. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle confirmation from warning modal
  const handleConfirmAction = async () => {
    try {
      setProcessing(true);
      if (currentAction === 'approve-all') {
        const result = await approveAllMeetings(selectedItem);
        if (result) {
          console.log('All meetings have been approved successfully!');
          closeModal(); // Close the modal after successful approval
        } else {
          console.log('Failed to approve all meetings. Please try again.');
        }
      }
    } catch (error) {
      console.log('An error occurred while processing your request. Please try again.');
    } finally {
      setProcessing(false);
      setShowWarningModal(false);
      setRefreshData(prev => !prev);
    }
  };

  // Add new function to check pending meetings
  const checkPendingMeetings = (item) => {
    return item.schedules.some(schedule => schedule.status !== 3 && schedule.status !== 4);
  };

  // Add new function to handle send email click
  const handleSendEmailClick = async (item) => {
    try {
      setProcessing(true);
      
      // Check for pending meetings
      if (checkPendingMeetings(item)) {
        // Open the modal to show pending meetings
        setSelectedItem(item);
        setCurrentScheduleIndex(0);
        setShowModal(true);
        console.log('There are pending meetings. Please approve or reject them first.');
        return;
      }

      try {
        // Get meeting details to ensure we have the correct data
        const meetingResponse = await axios.get(`/api/meetings/${item.id}`);
        const meetingData = meetingResponse.data;

        if (!meetingData || !meetingData.user_id || !meetingData.visitor_company_id) {
          throw new Error('Invalid meeting data received');
        }

        try {
          // Send status email with the correct data structure
          const response = await axios.post('/api/meetings/send-status-email', {
            user_id: meetingData.user_id,
            visitor_company_id: meetingData.visitor_company_id,
            schedules: item.schedules.map(schedule => ({
              id: schedule.id,
              day: schedule.day,
              date: schedule.date,
              dayOfWeek: schedule.dayOfWeek,
              time: schedule.time,
              exhibitor: schedule.exhibitor,
              boothNumber: schedule.boothNumber,
              status: schedule.status
            }))
          });

          if (response.data.success) {
            console.log(response.data);
            console.log('Status email sent successfully');
            // You could add a success notification here
          } else {
            throw new Error('Failed to send email: ' + (response.data.message || 'Unknown error'));
          }
        } catch (emailError) {
          console.error('Error sending email:', emailError);
          if (emailError.response) {
            console.error('Email error response:', emailError.response.data);
            throw new Error(`Failed to send email: ${emailError.response.data.message || 'Server error'}`);
          }
          throw emailError;
        }
      } catch (meetingError) {
        console.error('Error fetching meeting details:', meetingError);
        if (meetingError.response) {
          console.error('Meeting error response:', meetingError.response.data);
          throw new Error(`Failed to fetch meeting details: ${meetingError.response.data.message || 'Server error'}`);
        }
        throw meetingError;
      }
    } catch (error) {
      console.error('Error in handleSendEmailClick:', error);
      // You could add an error notification here
      alert(error.message || 'An error occurred while sending the email. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle click on modal approve button
  const handleModalApprove = async () => {
    if (!selectedItem) return;

    try {
      setProcessing(true);
      const meetingId = selectedItem.schedules[currentScheduleIndex].id;
      const currentStatus = selectedItem.schedules[currentScheduleIndex].status;

      // If already rejected (status 3), approve it to toggle
      // If pending (not 3 or 4) or already approved (status 4), proceed with approval
      const response = await axios.post(`/api/meetings/${meetingId}/approve`);

      if (response.data.success) {
        // Update the UI with the new status
        const updatedSchedules = [...selectedItem.schedules];
        updatedSchedules[currentScheduleIndex] = {
          ...updatedSchedules[currentScheduleIndex],
          status: 4 // Approved
        };

        setSelectedItem({
          ...selectedItem,
          schedules: updatedSchedules,
          status: 'Approved'
        });

        setProcessing(false);
        setRefreshData(prev => !prev);

        console.log('Meeting has been approved successfully!');
      }
    } catch (error) {
      console.error('Error in approve handler:', error);

      // Show detailed error message
      const errorDetails = error.response?.data?.message || error.message;
      console.log(`Failed to approve meeting: ${errorDetails}`);

      setProcessing(false);
    }
  };

  // Handle modal reject button
  const handleModalReject = async () => {
    if (!selectedItem) return;

    try {
      setProcessing(true);
      const meetingId = selectedItem.schedules[currentScheduleIndex].id;
      const currentStatus = selectedItem.schedules[currentScheduleIndex].status;

      // If already approved (status 4), reject it to toggle
      // If pending (not 3 or 4) or already rejected (status 3), proceed with rejection
      const response = await axios.post(`/api/meetings/${meetingId}/reject`);

      if (response.data.success) {
        // Update the UI with the new status
        const updatedSchedules = [...selectedItem.schedules];
        updatedSchedules[currentScheduleIndex] = {
          ...updatedSchedules[currentScheduleIndex],
          status: 3 // Rejected
        };

        setSelectedItem({
          ...selectedItem,
          schedules: updatedSchedules,
          status: 'Rejected'
        });

        setProcessing(false);
        setRefreshData(prev => !prev);

        console.log('Meeting has been rejected successfully!');
      }
    } catch (error) {
      console.error('Error in reject handler:', error);

      // Show detailed error message
      const errorDetails = error.response?.data?.message || error.message;
      console.log(`Failed to reject meeting: ${errorDetails}`);

      setProcessing(false);
    }
  };

  if (loading) {
    return <div className="p-16 py-10 text-center">Loading business meetings...</div>;
  }

  if (error) {
    return <div className="p-16 py-10 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-4 md:p-8 lg:p-16">
      <div className="flex flex-col mb-6 space-y-4 md:flex-row md:justify-between md:space-y-0">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 pr-8 text-sm border border-gray-300 rounded-full"
          />
        </div>
      </div>

      {/* Table with responsive wrapper */}
      <div className="overflow-x-auto rounded shadow">
        <table className="w-full min-w-full bg-white border-collapse">
          <thead className="bg-gray-50">
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
              <th className="hidden px-4 py-3 text-sm font-medium text-left md:table-cell">
                <div className="flex items-center">
                  Company size
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th className="px-4 py-3 text-sm font-medium text-left">
                <div className="flex items-center">
                  Schedule
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
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm">{item.name}</td>
                  <td className="px-4 py-4 text-sm">{item.company}</td>
                  <td className="hidden px-4 py-4 text-sm md:table-cell">{item.companySize}</td>
                  <td className="px-4 py-4 text-sm">
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
                  <td className="px-4 py-4 text-sm">
                    <span className={
                      item.status === 'Approved' ? 'text-green-600' :
                      item.status === 'Rejected' ? 'text-red-600' : ''
                    }>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-2 text-white bg-[#40033f] rounded-full hover:bg-[#2a0228] transition-colors duration-200"
                        onClick={() => handleSendEmailClick(item)}
                        disabled={processing}
                        aria-label="Send Email"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  No business meetings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(88, 64, 88, 0.7)' }}>
          <div className="relative w-full max-w-lg mx-auto overflow-hidden bg-white shadow-lg rounded-xl">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute p-2 text-gray-400 top-2 right-2 hover:text-gray-600 focus:outline-none"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-6">
              <h2 className="mb-4 text-lg font-medium">Schedule Meetings:</h2>
              
              {/* Add warning message for pending meetings */}
              {checkPendingMeetings(selectedItem) && (
                <div className="p-4 mb-4 text-sm text-yellow-800 bg-yellow-100 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>There are pending meetings. Please approve or reject them before sending the email.</span>
                  </div>
                </div>
              )}

              <div className="px-0 md:px-4">
                {/* Visitor Details */}
                <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                  <p><span className="font-medium">Visitor Name:</span> {selectedItem.name}</p>
                  <p><span className="font-medium">Phone:</span> {selectedItem.phoneNumber}</p>
                  <p><span className="font-medium">Company:</span> {selectedItem.company}</p>
                  <p><span className="font-medium">Registration:</span> {selectedItem.registrationNumber || 'N/A'}</p>
                  <p><span className="font-medium">Business Nature:</span> {selectedItem.businessNature}</p>
                  <p><span className="font-medium">Country/Region:</span> {selectedItem.country}</p>
                </div>

                {/* Divider */}
                <div className="my-4 border-t border-gray-200"></div>

                {/* Meeting Schedule */}
                {selectedItem.schedules && selectedItem.schedules.length > 0 && (
                  <div className="relative mb-4 text-sm">
                    <div className="pr-8 space-y-2">
                      <p className="font-bold">Day {selectedItem.schedules[currentScheduleIndex].day}</p>
                      <p><span className="font-medium">Date:</span> {selectedItem.schedules[currentScheduleIndex].date} ({selectedItem.schedules[currentScheduleIndex].dayOfWeek})</p>
                      <p><span className="font-medium">Time:</span> {selectedItem.schedules[currentScheduleIndex].time}</p>
                      <p><span className="font-medium">Exhibitor:</span> {selectedItem.schedules[currentScheduleIndex].exhibitor}</p>
                      <p><span className="font-medium">Booth Number:</span> {selectedItem.schedules[currentScheduleIndex].boothNumber}</p>
                      {/* Display meeting status with color coding */}
                      <p><span className="font-medium">Status:</span>
                        <span className={
                          selectedItem.schedules[currentScheduleIndex].status === 4 ? 'ml-2 text-green-600 font-semibold' :
                          selectedItem.schedules[currentScheduleIndex].status === 3 ? 'ml-2 text-red-600 font-semibold' :
                          'ml-2 text-gray-600'
                        }>
                          {selectedItem.schedules[currentScheduleIndex].status === 4 ? 'Approved' :
                           selectedItem.schedules[currentScheduleIndex].status === 3 ? 'Rejected' : 'Pending'}
                        </span>
                      </p>
                    </div>

                    {selectedItem.schedules.length > 1 && (
                      <button
                        onClick={nextSchedule}
                        className="absolute right-0 p-1 transform -translate-y-1/2 bg-gray-100 rounded-full top-1/2"
                        aria-label="Next meeting"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}

                {/* Navigation dots with counter */}
                {selectedItem.schedules && selectedItem.schedules.length > 1 && (
                  <div className="flex flex-col items-center mt-4 mb-6">
                    <p className="mb-1 text-xs text-gray-500">
                      {currentScheduleIndex + 1} of {selectedItem.schedules.length} meetings
                    </p>
                    <div className="flex items-center justify-center gap-1">
                      {selectedItem.schedules.map((_, index) => (
                        <span
                          key={index}
                          className={`inline-block w-2 h-2 rounded-full cursor-pointer ${
                            currentScheduleIndex === index ? 'bg-black h-3 w-3' : 'bg-gray-300'
                          }`}
                          onClick={() => setCurrentScheduleIndex(index)}
                          aria-label={`Meeting ${index + 1}`}
                        ></span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-center gap-3 pt-4 md:justify-start">
                  <button
                    className="px-4 py-1.5 text-sm bg-red-500 text-white rounded-full"
                    onClick={handleModalReject}
                    disabled={processing}
                  >
                    Reject
                  </button>
                  <button className="px-4 py-1.5 text-sm border border-[#9c0c40] text-[#9c0c40] rounded-full">
                    Edit
                  </button>
                  <button
                    className="px-4 py-1.5 text-sm bg-[#40033f] text-white rounded-full"
                    onClick={handleModalApprove}
                    disabled={selectedItem.schedules[currentScheduleIndex].status === 4 ||
                             selectedItem.schedules[currentScheduleIndex].status === 3 ||
                             processing}
                  >
                    Approve
                  </button>
                  <button
                    className="px-4 py-1.5 text-sm bg-[#9c0c40] text-white rounded-full"
                    onClick={handleApproveAll}
                    disabled={processing}
                  >
                    Approve All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Warning Modal for Approve/Reject All */}
      {showWarningModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(88, 64, 88, 0.7)' }}>
          <div className="relative w-full max-w-sm p-6 mx-auto bg-white shadow-lg rounded-xl">
            <button
              onClick={() => setShowWarningModal(false)}
              className="absolute p-2 text-gray-400 top-2 right-2 hover:text-gray-600"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 className="mb-4 text-lg font-medium text-center">Attention</h3>

            <p className="mb-6 text-sm text-center md:text-base">{warningMessage}</p>

            <div className="flex flex-wrap justify-center gap-3">
              <button
                className="px-4 py-2 text-sm text-white bg-[#40033f] rounded-full min-w-[100px]"
                onClick={handleConfirmAction}
              >
                Approve All
              </button>

              <button
                  className="px-4 py-2 text-sm border border-[#9c0c40] text-[#9c0c40] rounded-full min-w-[100px]"
                onClick={() => setShowWarningModal(false)}
              >
                Cancel
              </button>

              <button
                className="px-4 py-2 text-sm text-white bg-[#9c0c40] rounded-full min-w-[100px]"
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
