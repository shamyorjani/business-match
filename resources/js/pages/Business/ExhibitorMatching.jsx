import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ExhibitorMatching = () => {
  const navigate = useNavigate();
  const [selectedExhibitors, setSelectedExhibitors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [displayCount, setDisplayCount] = useState(5);

  // Load selected exhibitors from localStorage when component mounts
  useEffect(() => {
    const savedExhibitors = localStorage.getItem('selectedExhibitors');
    if (savedExhibitors) {
      setSelectedExhibitors(JSON.parse(savedExhibitors));
    }
  }, []);

  // Save selected exhibitors to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedExhibitors', JSON.stringify(selectedExhibitors));
  }, [selectedExhibitors]);

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

  const loadMore = () => {
    setDisplayCount(prevCount => prevCount + 5);
  };

  const handleScheduleMeeting = () => {
    // Find the full exhibitor objects for the selected exhibitors
    const selectedExhibitorData = exhibitors.filter(exhibitor => 
      selectedExhibitors.includes(exhibitor.name)
    );
    
    // Navigate to schedule meeting page with selected exhibitor data
    navigate('/business/schedule', { 
      state: { 
        selectedExhibitors: selectedExhibitorData 
      } 
    });
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
    },
    {
      id: 5,
      name: 'Beauty Tech',
      boothNumber: 'E 55',
      country: 'Singapore',
      productProfile: 'Skincare, Serums, Moisturizers, Cleansers',
      description: 'Beauty Tech is a leading skincare innovator in Singapore. Our products combine natural ingredients with cutting-edge technology.'
    },
    {
      id: 6,
      name: 'Glow Cosmetics',
      boothNumber: 'F 61',
      country: 'Vietnam',
      productProfile: 'Lip products, Eye shadows, Mascara, Eyeliners',
      description: 'Glow Cosmetics specializes in vibrant, long-lasting makeup products that are cruelty-free and environmentally conscious.'
    },
    {
      id: 7,
      name: 'Natural Beauty',
      boothNumber: 'G 77',
      country: 'Philippines',
      productProfile: 'Organic makeup, Natural ingredients, Vegan products',
      description: 'Natural Beauty creates makeup from 100% plant-based ingredients, catering to environmentally conscious consumers.'
    },
    {
      id: 8,
      name: 'Luxury Skin',
      boothNumber: 'H 83',
      country: 'Japan',
      productProfile: 'Premium skincare, Anti-aging, Luxury treatments',
      description: 'Luxury Skin provides high-end skincare solutions inspired by traditional Japanese beauty rituals and modern science.'
    },
    {
      id: 9,
      name: 'Color Pop',
      boothNumber: 'I 92',
      country: 'South Korea',
      productProfile: 'Bright pigments, K-beauty, Trendy cosmetics',
      description: 'Color Pop is known for bold, trendy colors and innovative formulas that have revolutionized the K-beauty scene.'
    },
    {
      id: 10,
      name: 'Pure Elements',
      boothNumber: 'J 105',
      country: 'Australia',
      productProfile: 'Mineral makeup, Sunscreens, Natural protection',
      description: 'Pure Elements harnesses Australian minerals and botanicals to create effective, skin-friendly beauty products.'
    },
    {
      id: 11,
      name: 'Green Beauty',
      boothNumber: 'K 118',
      country: 'New Zealand',
      productProfile: 'Eco-friendly packaging, Sustainable beauty, Clean ingredients',
      description: 'Green Beauty is committed to sustainability in every aspect of their production, from ingredients to packaging.'
    },
    {
      id: 12,
      name: 'Skin Science',
      boothNumber: 'L 124',
      country: 'Taiwan',
      productProfile: 'Dermatological solutions, Clinical formulas, Problem-solving products',
      description: 'Skin Science combines dermatological expertise with advanced technology to address specific skin concerns.'
    }
  ];

  // Get the current exhibitors to display based on the displayCount
  const visibleExhibitors = exhibitors.slice(0, displayCount);

  return (
    <div className="form-container">
      {/* Header */}
      <div className="header">
        <h1 className="header-title">Top Matches
        <p className="header-subtitle">Kindly select one or more exhibitors to match and schedule a meeting</p>
        </h1>

      </div>

      {/* Content */}
      <div className="content">
        <div className="info-bar">
            <p className="info-counter">Showing {visibleExhibitors.length} out of {exhibitors.length} matches</p>
            <div className="flex items-center gap-4">
                <p className="selected-counter">{selectedExhibitors.length} Exhibitor(s) selected</p>
                {selectedExhibitors.length > 0 && (
                    <button
                        className="btn-primary"
                        onClick={handleScheduleMeeting}
                    >
                        Schedule meeting
                    </button>
                )}
            </div>
        </div>

        <div className="exhibitor-list">
          {visibleExhibitors.map((exhibitor) => (
            <div key={exhibitor.id} className="exhibitor-card">
              <div className="exhibitor-flex">
                {/* Logo */}
                <div className="company-logo">
                  <div>Company</div>
                  <div>Logo</div>
                  <div>1:1</div>
                </div>

                {/* Content */}
                <div className="card-content">
                  <div className="card-grid">
                    <div>
                      <span className="label">Company Name: </span>
                      {exhibitor.name}
                    </div>
                    <div>
                      <span className="label">Booth Number: </span>
                      {exhibitor.boothNumber}
                    </div>
                    <div>
                      <span className="label">Country/Region: </span>
                      {exhibitor.country}
                    </div>
                  </div>

                  <div className="mt-2">
                    <span className="label">Product Profile: </span>
                    {exhibitor.productProfile}
                  </div>

                  <div className="mt-2">
                    <span className="label">Company Description: </span>
                    <p className="mt-1">{exhibitor.description}</p>
                  </div>

                  <div className="flex justify-end gap-3 mt-4">
                    <button
                      className="btn-secondary"
                      onClick={() => openProductModal(exhibitor.name)}
                    >
                      View Products
                    </button>
                    <button
                      className={selectedExhibitors.includes(exhibitor.name) ? 'btn-selected' : 'btn-unselected'}
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

        {/* Show More Button (only shown if there are more exhibitors to display) */}
        {displayCount < exhibitors.length && (
          <div className="flex justify-end mt-8">
            <button className="btn-primary btn-lg" onClick={loadMore}>
              Show More
            </button>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="modal-overlay" style={{ backgroundColor: '#584058B5' }}>
          <div className="modal-container">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="modal-close"
            >
              ×
            </button>

            <div className="modal-content">
              {/* Product Image */}
              <div className="product-logo">
                <div>Product</div>
                <div>Picture</div>
                <div>1:1</div>
              </div>

              {/* Product Details */}
              <div className="w-[90%]">
                <h3 className="modal-title">Product Name: {currentProduct?.name}</h3>

                <div className="relative mt-4">
                  <h4 className="modal-title">Product Description:</h4>
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
                <div className="flex items-center justify-center gap-2 mt-6">
                  <span className={`dot ${currentProductIndex === 0 ? 'dot-active' : 'dot-inactive'}`}></span>
                  <span className={`dot ${currentProductIndex === 1 ? 'dot-active' : 'dot-inactive'}`}></span>
                  <span className={`dot ${currentProductIndex === 2 ? 'dot-active' : 'dot-inactive'}`}></span>
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
