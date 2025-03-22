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
    <div className="p-4 md:p-8 lg:p-16">
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
                  Origin
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </th>
              <th className="hidden px-4 py-3 text-sm font-medium text-left md:table-cell">
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
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-4 text-sm">{item.name}</td>
                <td className="px-4 py-4 text-sm">{item.company}</td>
                <td className="hidden px-4 py-4 text-sm md:table-cell">{item.origin}</td>
                <td className="hidden px-4 py-4 text-sm md:table-cell">{item.industry}</td>
                <td className="px-4 py-4 text-sm">
                  <span className={item.status === 'Confirmed' ? 'text-green-600 font-medium' : 'text-yellow-600'}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      className="px-4 py-1 text-sm text-white bg-[#6f0f55] rounded-full hover:bg-[#40033f]"
                      onClick={() => handleViewClick(item)}
                    >
                      View
                    </button>
                    <div className="flex gap-1">
                      <button className="p-2 text-white bg-green-500 rounded-full hover:bg-green-700" aria-label="Approve">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button className="p-2 text-white bg-red-500 rounded-full hover:bg-red-700" aria-label="Reject">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
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
              <h2 className="mb-4 text-lg font-medium">Hosted Buyer Details:</h2>

              <div className="px-0 md:px-4">
                {/* Buyer Details */}
                <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
                  <p><span className="font-medium">Buyer Name:</span> {selectedItem.name}</p>
                  <p><span className="font-medium">Phone:</span> {selectedItem.phoneNumber}</p>
                  <p><span className="font-medium">Email:</span> {selectedItem.email}</p>
                  <p><span className="font-medium">Company:</span> {selectedItem.company}</p>
                  <p><span className="font-medium">Origin:</span> {selectedItem.origin}</p>
                  <p><span className="font-medium">Industry:</span> {selectedItem.industry}</p>
                  <p><span className="font-medium">Arrival:</span> {selectedItem.arrivalDate}</p>
                  <p><span className="font-medium">Departure:</span> {selectedItem.departureDate}</p>
                  <p><span className="font-medium">Accommodation:</span> {selectedItem.accommodationStatus}</p>
                  <p><span className="font-medium">Flight Status:</span> {selectedItem.flightStatus}</p>
                  <p className="col-span-2"><span className="font-medium">Requirements:</span> {selectedItem.specialRequirements}</p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-6 md:justify-start">
                  <button className="px-4 py-1.5 text-sm border border-[#9c0c40] text-[#9c0c40] rounded-full">
                    Delete
                  </button>
                  <button className="px-4 py-1.5 text-sm border border-[#9c0c40] text-[#9c0c40] rounded-full">
                    Edit
                  </button>
                  <button className="px-4 py-1.5 text-sm bg-[#40033f] text-white rounded-full">
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HostedBuyerProgram;
