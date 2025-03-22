import React, { useState } from 'react';

const HostedBuyerProgram = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Sample data for the hosted buyer program table
  const hostedBuyerData = [
    {
      id: 1,
      name: 'Alex Johnson',
      company: 'Global Imports',
      origin: 'United States',
      industry: 'Retail',
      arrivalDate: '01 June 2025',
      departureDate: '05 June 2025',
      status: 'Confirmed',
      accommodationStatus: 'Booked',
      flightStatus: 'Confirmed',
      phoneNumber: '+1 555-123-4567',
      email: 'alex.johnson@globalimports.com',
      specialRequirements: 'Vegetarian meals'
    },
    {
      id: 2,
      name: 'Sarah Wong',
      company: 'Asia Distributors',
      origin: 'Hong Kong',
      industry: 'Distribution',
      arrivalDate: '31 May 2025',
      departureDate: '04 June 2025',
      status: 'Pending',
      accommodationStatus: 'Processing',
      flightStatus: 'Pending',
      phoneNumber: '+852 5567-8901',
      email: 'sarah.wong@asiadist.com',
      specialRequirements: 'Airport pickup needed'
    },
    {
      id: 3,
      name: 'Mohammed Al-Farsi',
      company: 'Gulf Trading Co',
      origin: 'UAE',
      industry: 'Import/Export',
      arrivalDate: '02 June 2025',
      departureDate: '06 June 2025',
      status: 'Confirmed',
      accommodationStatus: 'Booked',
      flightStatus: 'Confirmed',
      phoneNumber: '+971 50-123-4567',
      email: 'mohammed@gulftrading.ae',
      specialRequirements: 'Halal meals only'
    },
    {
      id: 4,
      name: 'Maria Schmidt',
      company: 'European Ventures',
      origin: 'Germany',
      industry: 'Manufacturing',
      arrivalDate: '01 June 2025',
      departureDate: '05 June 2025',
      status: 'Pending',
      accommodationStatus: 'Booked',
      flightStatus: 'Pending',
      phoneNumber: '+49 30-12345678',
      email: 'maria@european-ventures.de',
      specialRequirements: 'None'
    }
  ];

  // Filter data based on search query
  const filteredData = hostedBuyerData.filter(item => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) ||
      item.company.toLowerCase().includes(query) ||
      item.origin.toLowerCase().includes(query) ||
      item.status.toLowerCase().includes(query) ||
      item.industry.toLowerCase().includes(query)
    );
  });

  const handleViewClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  return (
    <div className="p-16 py-10">
      <div className="flex justify-between mt-6 mb-6">
        {/* Add buyer button */}
        <button className="flex items-center px-4 py-1 text-sm border border-gray-300 rounded-full">
          <span className="mr-1">+</span> Add new buyer
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
                Origin
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </th>
            <th className="px-4 py-3 text-sm font-medium text-left">
              <div className="flex items-center">
                Industry
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
          {filteredData.map((item) => (
            <tr key={item.id} className="border-b border-gray-200">
              <td className="px-4 py-4">{item.name}</td>
              <td className="px-4 py-4">{item.company}</td>
              <td className="px-4 py-4">{item.origin}</td>
              <td className="px-4 py-4">{item.industry}</td>
              <td className="px-4 py-4">
                <span className={item.status === 'Confirmed' ? 'text-green-600' : ''}>
                  {item.status}
                </span>
              </td>
              <td className="flex items-center gap-2 px-4 py-4">
                <button
                  className="px-4 py-1 text-white bg-[#6f0f55] rounded-full hover:bg-[#40033f]"
                  onClick={() => handleViewClick(item)}
                >
                  View
                </button>
                <button className="px-2 py-1 text-white bg-green-500 rounded-full hover:bg-green-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <button className="px-2 py-1 text-white bg-red-500 rounded-full hover:bg-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Detail Modal */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: 'rgba(88, 64, 88, 0.7)' }}>
          <div className="relative w-full max-w-lg p-6 mx-4 bg-white shadow-lg rounded-xl">
            {/* Close button */}
            <button onClick={closeModal} className="modal-close">×</button>
            <h2 className="mb-4 text-lg font-medium">Hosted Buyer Details:</h2>
            <div className="px-4">
              {/* Buyer Details */}
              <div className="space-y-1 text-sm">
                <p><span className="font-bold">Buyer Name:</span> {selectedItem.name}</p>
                <p><span className="font-bold">Phone Number:</span> {selectedItem.phoneNumber}</p>
                <p><span className="font-bold">Email:</span> {selectedItem.email}</p>
                <p><span className="font-bold">Company:</span> {selectedItem.company}</p>
                <p><span className="font-bold">Origin:</span> {selectedItem.origin}</p>
                <p><span className="font-bold">Industry:</span> {selectedItem.industry}</p>
                <p><span className="font-bold">Arrival Date:</span> {selectedItem.arrivalDate}</p>
                <p><span className="font-bold">Departure Date:</span> {selectedItem.departureDate}</p>
                <p><span className="font-bold">Accommodation Status:</span> {selectedItem.accommodationStatus}</p>
                <p><span className="font-bold">Flight Status:</span> {selectedItem.flightStatus}</p>
                <p><span className="font-bold">Special Requirements:</span> {selectedItem.specialRequirements}</p>
              </div>

              <div className="flex flex-row items-center gap-3 p-3 mt-4">
                <button className="px-5 py-1.5 text-sm border border-[#9c0c40] text-[#9c0c40] rounded-full">
                  Delete
                </button>
                <button className="px-5 py-1.5 text-sm border border-[#9c0c40] text-[#9c0c40] rounded-full">
                  Edit
                </button>
                <button className="px-5 py-1.5 text-sm bg-[#40033f] text-white rounded-full">
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

export default HostedBuyerProgram;
