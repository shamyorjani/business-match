import React, { useState } from 'react';

const ExhibitorMatching = () => {
  const [selectedExhibitors, setSelectedExhibitors] = useState(['ABC Company']);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);

  const toggleSelection = (companyName) => {
    if (selectedExhibitors.includes(companyName)) {
      setSelectedExhibitors(selectedExhibitors.filter(name => name !== companyName));
    } else {
      setSelectedExhibitors([...selectedExhibitors, companyName]);
    }
  };

  const openProductModal = (company) => {
    // Create sample products for the company
    const companyProducts = [
      {
        name: `${company} Concealer`,
        description: `${company} Concealer is the state of the art concealer, developed in 1982. Its formula contains...`
      },
      {
        name: `${company} Foundation`,
        description: `${company} Foundation provides full coverage with a natural finish, perfect for all skin types.`
      },
      {
        name: `${company} Highlighter`,
        description: `${company} Highlighter gives a natural glow that lasts all day without fading.`
      }
    ];

    // Set products and reset index
    setCurrentProduct(companyProducts[0]);
    setCurrentProductIndex(0);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const nextProduct = (company) => {
    // Create sample products again (in a real app, you'd store these)
    const companyProducts = [
      {
        name: `${company} Concealer`,
        description: `${company} Concealer is the state of the art concealer, developed in 1982. Its formula contains...`
      },
      {
        name: `${company} Foundation`,
        description: `${company} Foundation provides full coverage with a natural finish, perfect for all skin types.`
      },
      {
        name: `${company} Highlighter`,
        description: `${company} Highlighter gives a natural glow that lasts all day without fading.`
      }
    ];

    const nextIndex = (currentProductIndex + 1) % companyProducts.length;
    setCurrentProductIndex(nextIndex);
    setCurrentProduct(companyProducts[nextIndex]);
  };

  const exhibitors = [
    {
      id: 1,
      name: 'ABC Company',
      boothNumber: 'A11',
      country: 'Malaysia',
      productProfile: 'Foundations, Concealers, Blush, Highlighters, Powders',
      description: 'We ABC Company are top 20 manufacturer of Makeup products in Malaysia. We specialise in...'
    },
    {
      id: 2,
      name: 'HJ Company',
      boothNumber: 'C 29',
      country: 'Indonesia',
      productProfile: 'Foundations, Concealers, Blush, Highlighters, Powders',
      description: 'We HJ Company are top 20 manufacturer of Makeup products in Indonesia. We specialise in...'
    },
    {
      id: 3,
      name: 'AAA Company',
      boothNumber: 'B 15',
      country: 'Malaysia',
      productProfile: 'Foundations, Concealers, Blush, Highlighters, Powders',
      description: 'We AAA Company are top 20 manufacturer of Makeup products in Malaysia. We specialise in...'
    },
    {
      id: 4,
      name: 'XYZ Company',
      boothNumber: 'D 42',
      country: 'Thailand',
      productProfile: 'Foundations, Concealers, Blush, Highlighters, Powders',
      description: 'We XYZ Company are top 20 manufacturer of Makeup products in Thailand. We specialise in...'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto overflow-hidden border border-gray-200 rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#40033f] to-[#9c0c40] p-6">
        <h1 className="text-2xl font-bold text-white">Top Matches</h1>
        <p className="mt-1 text-sm text-white">Kindly select one or more exhibitors to match and schedule a meeting</p>
      </div>

      {/* Content */}
      <div className="p-6 bg-white">
        {/* Info bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400">Showing {exhibitors.length} out of {exhibitors.length} matches</p>
          <div className="flex items-center gap-4">
            <p className="font-medium">{selectedExhibitors.length} Exhibitor(s) selected</p>
            <button
              className="bg-[#40033f] text-white px-4 py-1 rounded-full text-sm"
            >
              Schedule meeting
            </button>
          </div>
        </div>

        {/* Exhibitor Cards */}
        <div className="space-y-6">
          {exhibitors.map((exhibitor) => (
            <div key={exhibitor.id} className="p-6 border border-gray-200 rounded-lg">
              <div className="flex">
                {/* Logo */}
                <div className="mr-6">
                  <div className="flex flex-col items-center justify-center w-24 h-24 text-center text-gray-600 bg-gray-300">
                    <div>Company</div>
                    <div>Logo</div>
                    <div>1:1</div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1">
                    <div>
                      <span className="font-medium">Company Name: </span>
                      {exhibitor.name}
                    </div>
                    <div>
                      <span className="font-medium">Booth Number: </span>
                      {exhibitor.boothNumber}
                    </div>
                    <div>
                      <span className="font-medium">Country/Region: </span>
                      {exhibitor.country}
                    </div>
                  </div>

                  <div className="mt-2">
                    <span className="font-medium">Product Profile: </span>
                    {exhibitor.productProfile}
                  </div>

                  <div className="mt-2">
                    <span className="font-medium">Company Description: </span>
                    <p className="mt-1">{exhibitor.description}</p>
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      className="border border-[#6f0f55] text-[#6f0f55] px-4 py-1 rounded-full text-sm hover:bg-gray-50"
                      onClick={() => openProductModal(exhibitor.name)}
                    >
                      View Products
                    </button>
                    <button
                      className={`px-4 py-1 rounded-full text-sm ${
                        selectedExhibitors.includes(exhibitor.name)
                          ? 'bg-[#40033f] text-white'
                          : 'border border-[#40033f] text-[#40033f]'
                      }`}
                      onClick={() => toggleSelection(exhibitor.name)}
                    >
                      {selectedExhibitors.includes(exhibitor.name) ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Back to Top Button */}
        <div className="flex justify-end mt-8">
          <button className="bg-[#40033f] text-white px-6 py-2 rounded-full">
            Show More
          </button>
        </div>
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: '#584058B5' }}>
          <div className="relative w-full max-w-md p-6 mx-4 bg-white rounded-2xl">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute text-gray-500 top-4 right-4"
            >
              ×
            </button>

            <div className="flex flex-col items-center">
              {/* Product Image */}
              <div className="flex flex-col items-center justify-center w-24 h-24 mb-4 text-center text-gray-600 bg-gray-300">
                <div>Product</div>
                <div>Picture</div>
                <div>1:1</div>
              </div>

              {/* Product Details */}
              <div className="w-full">
                <h3 className="text-base font-medium">Product Name: {currentProduct?.name}</h3>

                <div className="relative mt-4">
                  <h4 className="text-base font-medium">Product Description:</h4>
                  <p className="mt-2 text-sm">{currentProduct?.description}</p>

                  {/* Next button */}
                  <button
                    onClick={() => nextProduct(currentProduct.name.split(' ')[0])}
                    className="absolute right-0 text-xl font-bold transform -translate-y-1/2 top-1/2"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Navigation dots */}
                <div className="flex justify-center gap-2 mt-6">
                  <span className={`w-2 h-2 rounded-full ${currentProductIndex === 0 ? 'bg-black' : 'bg-gray-300'}`}></span>
                  <span className={`w-2 h-2 rounded-full ${currentProductIndex === 1 ? 'bg-black' : 'bg-gray-300'}`}></span>
                  <span className={`w-2 h-2 rounded-full ${currentProductIndex === 2 ? 'bg-black' : 'bg-gray-300'}`}></span>
                </div>

                {/* Action buttons */}
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={closeModal}
                    className="px-6 py-1.5 text-sm border border-[#6f0f55] text-[#6f0f55] rounded-full"
                  >
                    Close
                  </button>
                  <button className="px-6 py-1.5 text-sm text-white bg-[#40033f] rounded-full">
                    Select
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

export default ExhibitorMatching;
