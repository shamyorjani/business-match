import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HostedBuyerProgram = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);
  const [hostedBuyerData, setHostedBuyerData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [verifyingIds, setVerifyingIds] = useState(new Set());
  const [rejectingIds, setRejectingIds] = useState(new Set());

  // Fetch data from API
  useEffect(() => {
    const fetchHostedBuyers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/hosted');
        if (response.data.success) {
          setHostedBuyerData(response.data.data);
        } else {
          setError('Failed to fetch hosted buyer data');
        }
      } catch (err) {
        console.error('Error fetching hosted buyers:', err);
        setError(err.response?.data?.message || 'Failed to fetch hosted buyer data');
      } finally {
        setLoading(false);
      }
    };

    fetchHostedBuyers();
  }, []);

  // Filter data based on search query
  const filteredData = hostedBuyerData.filter(item => {
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
    setCurrentDocumentIndex(0);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
    setCurrentDocumentIndex(0);
  };

  const nextDocument = () => {
    if (selectedItem && selectedItem.documents.length > 1) {
      setCurrentDocumentIndex((prev) => (prev + 1) % selectedItem.documents.length);
    }
  };

  const prevDocument = () => {
    if (selectedItem && selectedItem.documents.length > 1) {
      setCurrentDocumentIndex((prev) =>
        prev === 0 ? selectedItem.documents.length - 1 : prev - 1
      );
    }
  };

  const handleApprove = async (item) => {
    try {
      // Prevent multiple clicks
      if (verifyingIds.has(item.id)) return;
      
      // Add to verifying set
      setVerifyingIds(prev => new Set([...prev, item.id]));

      const response = await axios.post('/api/hosted/varification-email', {
        user_id: item.user_id,
        visitor_company_id: item.company_id
      });

      if (response.data.success) {
        // Update the item's status in the local state
        setHostedBuyerData(prevData => 
          prevData.map(data => 
            data.id === item.id 
              ? { ...data, status: response.data.status_name }
              : data
          )
        );
      } else {
        alert(response.data.message || 'Failed to send verification email');
      }
    } catch (error) {
      console.error('Error sending verification email:', error);
      alert(error.response?.data?.message || 'Failed to send verification email');
    } finally {
      // Remove from verifying set
      setVerifyingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const handleReject = async (item) => {
    try {
      // Prevent multiple clicks
      if (rejectingIds.has(item.id)) return;
      
      // Add to rejecting set
      setRejectingIds(prev => new Set([...prev, item.id]));

      const response = await axios.post('/api/hosted/reject', {
        user_id: item.user_id,
        visitor_company_id: item.company_id
      });

      if (response.data.success) {
        // Update the item's status in the local state
        setHostedBuyerData(prevData => 
          prevData.map(data => 
            data.id === item.id 
              ? { ...data, status: response.data.status_name }
              : data
          )
        );
      } else {
        alert(response.data.message || 'Failed to send rejection email');
      }
    } catch (error) {
      console.error('Error sending rejection email:', error);
      alert(error.response?.data?.message || 'Failed to send rejection email');
    } finally {
      // Remove from rejecting set
      setRejectingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  // Add function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'text-green-600 font-medium';
      case 'Rejected':
        return 'text-red-600 font-medium';
      case 'Email Sent':
        return 'text-blue-600 font-medium';
      default:
        return 'text-yellow-600';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#40033f] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading hosted buyer data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 text-sm text-white bg-[#40033f] rounded-full hover:bg-[#2a0228]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 lg:p-8">
      <div className="flex flex-col mb-6 space-y-4 md:flex-row md:justify-between md:space-y-0">
        {/* Search input */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Type Here to Search"
            className="w-full px-4 py-2 pr-8 text-sm border border-gray-300 rounded-full"
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
                  Company Size
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th className="px-4 py-3 text-sm font-medium text-left">
                <div className="flex items-center">
                  Documents
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
                  <td className="px-4 py-4 text-sm">
                    <a
                      href="#"
                      className="text-black underline"
                      onClick={(e) => {
                        e.preventDefault();
                        handleViewClick(item);
                      }}
                    >
                      {item.name}
                    </a>
                  </td>
                  <td className="px-4 py-4 text-sm">{item.company}</td>
                  <td className="hidden px-4 py-4 text-sm md:table-cell">{item.companySize}</td>
                  <td className="px-4 py-4 text-sm">
                    {item.documents && item.documents.length > 0 ? (
                      <button
                        onClick={() => handleViewClick(item)}
                        className="text-[#40033f] hover:text-[#2a0228] font-medium"
                      >
                        View ({item.documents.length})
                      </button>
                    ) : (
                      <span className="text-gray-500">No documents</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className={getStatusColor(item.status)}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex gap-1">
                        <button 
                          className={`p-2 text-white rounded-full ${
                            item.status === 'Approved' || item.status === 'Email Sent'
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : verifyingIds.has(item.id)
                              ? 'bg-green-400'
                              : 'bg-green-500 hover:bg-green-700'
                          }`} 
                          aria-label="Approve"
                          onClick={() => handleApprove(item)}
                          disabled={item.status === 'Approved' || item.status === 'Email Sent' || verifyingIds.has(item.id)}
                        >
                          {verifyingIds.has(item.id) ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                        <button 
                          className={`p-2 text-white rounded-full ${
                            item.status === 'Rejected' || item.status === 'Email Sent'
                              ? 'bg-gray-400 cursor-not-allowed' 
                              : rejectingIds.has(item.id)
                              ? 'bg-red-400'
                              : 'bg-red-500 hover:bg-red-700'
                          }`} 
                          aria-label="Reject"
                          onClick={() => handleReject(item)}
                          disabled={item.status === 'Rejected' || item.status === 'Email Sent' || rejectingIds.has(item.id)}
                        >
                          {rejectingIds.has(item.id) ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                  No hosted buyers found
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
              <h2 className="mb-4 text-lg font-medium">Uploaded Documents</h2>

              <div className="px-0 md:px-4">
                {/* Documents Section */}
                {selectedItem.documents && selectedItem.documents.length > 0 && (
                  <div className="mt-6">
                    <div className="relative">
                      <div className="relative aspect-video">
                        <img
                          src={selectedItem.documents[currentDocumentIndex].url}
                          alt={`Document ${currentDocumentIndex + 1}`}
                          className="object-cover w-full h-full rounded-lg"
                        />
                      </div>
                      {selectedItem.documents.length > 1 && (
                        <>
                          <button
                            onClick={prevDocument}
                            className="absolute left-2 p-1 transform -translate-y-1/2 bg-gray-100 rounded-full top-1/2"
                            aria-label="Previous document"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={nextDocument}
                            className="absolute right-2 p-1 transform -translate-y-1/2 bg-gray-100 rounded-full top-1/2"
                            aria-label="Next document"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                    {/* Navigation dots with counter */}
                    <div className="flex flex-col items-center mt-4">
                      <p className="mb-1 text-xs text-gray-500">
                        {currentDocumentIndex + 1} of {selectedItem.documents.length} documents
                      </p>
                      <div className="flex items-center justify-center gap-1">
                        {selectedItem.documents.map((_, index) => (
                          <span
                            key={index}
                            className={`inline-block w-2 h-2 rounded-full cursor-pointer ${
                              currentDocumentIndex === index ? 'bg-black h-3 w-3' : 'bg-gray-300'
                            }`}
                            onClick={() => setCurrentDocumentIndex(index)}
                            aria-label={`Document ${index + 1}`}
                          ></span>
                        ))}
                      </div>
                    </div>

                    {/* Download Button */}
                    <div className="flex justify-center mt-6">
                      <button 
                        className="px-4 py-2 text-sm text-white bg-[#40033f] rounded-full hover:bg-[#2a0228] flex items-center gap-2"
                        onClick={() => window.open(selectedItem.documents[currentDocumentIndex].url, '_blank')}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download Document
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostedBuyerProgram;
