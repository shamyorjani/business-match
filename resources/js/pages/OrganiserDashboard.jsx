import React, { useState } from 'react';

const OrganiserDashboard = () => {
  const [activeTab, setActiveTab] = useState('Business Matching');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [currentScheduleIndex, setCurrentScheduleIndex] = useState(0);

  // Sample data for the business matching table
  const businessData = [
    {
      id: 1,
      name: 'John Doe',
      company: 'John Ltd',
      companySize: '51-100',
      documents: true,
      status: 'Pending',
      phoneNumber: '+6012 345 6789',
      registrationNumber: '202005123456',
      businessNature: 'Wholesaler',
      country: 'Malaysia',
      schedules: [
        {
          id: 101,
          day: 3,
          date: '04 June 2025',
          dayOfWeek: 'Thursday',
          time: '3.00pm-4.00pm',
          exhibitor: 'ABC Company',
          boothNumber: 'A11'
        },
        {
          id: 102,
          day: 2,
          date: '03 June 2025',
          dayOfWeek: 'Wednesday',
          time: '1.00pm-2.00pm',
          exhibitor: 'XYZ Company',
          boothNumber: 'B22'
        },
        {
          id: 103,
          day: 4,
          date: '05 June 2025',
          dayOfWeek: 'Friday',
          time: '10.00am-11.00am',
          exhibitor: 'DEF Corporation',
          boothNumber: 'C15'
        }
      ]
    },
    {
      id: 2,
      name: 'Mary Sue',
      company: 'Mary Inc',
      companySize: '100 and above',
      documents: true,
      status: 'Approved',
      phoneNumber: '+6012 987 6543',
      registrationNumber: '202105789012',
      businessNature: 'Retailer',
      country: 'Singapore',
      schedules: [
        {
          day: 2,
          date: '03 June 2025',
          dayOfWeek: 'Wednesday',
          time: '1.00pm-2.00pm',
          exhibitor: 'XYZ Company',
          boothNumber: 'B22'
        }
      ]
    },
    {
      id: 3,
      name: 'Colin Goober',
      company: 'Colin Llc',
      companySize: '1-10',
      documents: true,
      status: 'Approved',
      phoneNumber: '+6012 345 1234',
      registrationNumber: '202203456789',
      businessNature: 'Manufacturer',
      country: 'Indonesia',
      schedules: [
        {
          day: 1,
          date: '02 June 2025',
          dayOfWeek: 'Tuesday',
          time: '11.00am-12.00pm',
          exhibitor: 'DEF Company',
          boothNumber: 'C33'
        }
      ]
    },
    {
      id: 4,
      name: 'Jack Smith',
      company: 'Jack Co',
      companySize: '11-50',
      documents: true,
      status: 'Pending',
      phoneNumber: '+6012 876 5432',
      registrationNumber: '202009876543',
      businessNature: 'Distributor',
      country: 'Thailand',
      schedules: [
        {
          day: 4,
          date: '05 June 2025',
          dayOfWeek: 'Friday',
          time: '2.00pm-3.00pm',
          exhibitor: 'GHI Company',
          boothNumber: 'D44'
        }
      ]
    }
  ];

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

  return (
    <div className="flex flex-col h-screen">
      {/* Full-width header */}
      <div className="w-full bg-gradient-to-r from-[#40033f] to-[#9c0c40] p-6">
        <h1 className="text-2xl font-medium text-white">Organiser Dashboard</h1>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-48 bg-gradient-to-b from-[#40033f] to-[#9c0c40]">
          {/* Navigation Tabs */}
          <div>
            <div
              className={`py-4 px-6 text-white text-sm cursor-pointer ${activeTab === 'Business Matching' ? 'bg-[#6f0f55]' : ''}`}
              onClick={() => setActiveTab('Business Matching')}
            >
              Business Matching
            </div>
            <div
              className={`py-4 px-6 text-white text-sm cursor-pointer ${activeTab === 'Hosted Buyer Program' ? 'bg-[#6f0f55]' : ''}`}
              onClick={() => setActiveTab('Hosted Buyer Program')}
            >
              Hosted Buyer Program
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white">
          {/* Content for Business Matching tab */}
          {activeTab === 'Business Matching' && (
            <div className="p-6">
              <div className="flex justify-between mt-6 mb-6">
                {/* Add categories button */}
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
                        Uploaded Documents
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
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200">
                      <td className="px-4 py-4">{item.name}</td>
                      <td className="px-4 py-4">{item.company}</td>
                      <td className="px-4 py-4">{item.companySize}</td>
                      <td className="px-4 py-4">
                        <a
                          href="#"
                          className="underline text-[#40033f]"
                          onClick={(e) => {
                            e.preventDefault();
                            handleViewClick(item);
                          }}
                        >
                          View
                        </a>
                      </td>
                      <td className="px-4 py-4">
                        <span className={item.status === 'Approved' ? 'text-green-600' : ''}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Content for Hosted Buyer Program tab */}
          {activeTab === 'Hosted Buyer Program' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold">Hosted Buyer Program</h2>
              <p className="mt-2">This section is under development.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(88, 64, 88, 0.7)' }}>
          <div className="relative w-full max-w-md p-6 mx-4 bg-white shadow-lg rounded-xl">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute text-xl text-gray-500 top-4 right-4"
            >
              ×
            </button>

            <div>
              <h2 className="mb-4 text-lg font-medium">Schedule Meetings:</h2>

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
                <div className="relative px-8 text-sm">
                  <div className="space-y-1">
                    <p className="font-medium">Day {selectedItem.schedules[currentScheduleIndex].day}</p>
                    <p>Date: {selectedItem.schedules[currentScheduleIndex].date} ({selectedItem.schedules[currentScheduleIndex].dayOfWeek})</p>
                    <p>Time: {selectedItem.schedules[currentScheduleIndex].time}</p>
                    <p>Exhibitor: {selectedItem.schedules[currentScheduleIndex].exhibitor}</p>
                    <p>Booth Number: {selectedItem.schedules[currentScheduleIndex].boothNumber}</p>
                  </div>

                  {/* Navigation arrows */}
                  {selectedItem.schedules.length > 1 && (
                    <>
                      <button
                        onClick={prevSchedule}
                        className="absolute left-0 transform -translate-y-1/2 top-1/2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={nextSchedule}
                        className="absolute right-0 transform -translate-y-1/2 top-1/2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              )}

              {/* Navigation dots with counter */}
              {selectedItem.schedules && selectedItem.schedules.length > 1 && (
                <div className="flex flex-col items-center mt-4">
                  <p className="mb-1 text-xs text-gray-500">
                    {currentScheduleIndex + 1} of {selectedItem.schedules.length} meetings
                  </p>
                  <div className="flex justify-center gap-1">
                    {selectedItem.schedules.map((_, index) => (
                      <span
                        key={index}
                        className={`inline-block w-2 h-2 rounded-full ${
                          currentScheduleIndex === index ? 'bg-black' : 'bg-gray-300'
                        } cursor-pointer`}
                        onClick={() => setCurrentScheduleIndex(index)}
                      ></span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex justify-between mt-6">
                <button className="px-5 py-1.5 text-sm border border-[#9c0c40] text-[#9c0c40] rounded-full">
                  Delete
                </button>
                <button className="px-5 py-1.5 text-sm border border-[#9c0c40] text-[#9c0c40] rounded-full">
                  Edit
                </button>
                <button className="px-5 py-1.5 text-sm bg-[#40033f] text-white rounded-full">
                  Approve
                </button>
                <button className="px-5 py-1.5 text-sm bg-[#9c0c40] text-white rounded-full">
                  Approve All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrganiserDashboard;
