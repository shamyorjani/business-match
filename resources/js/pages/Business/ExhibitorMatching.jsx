import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Import API service
import { getCompanyLogo, getProductImage } from '../../utils/imageUtils'; // Import image utility functions

const ExhibitorMatching = () => {
  const navigate = useNavigate();
  const [selectedExhibitors, setSelectedExhibitors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [displayCount, setDisplayCount] = useState(5);
  const [exhibitors, setExhibitors] = useState([]);
  const [filteredExhibitors, setFilteredExhibitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load selected exhibitors from localStorage when component mounts
  useEffect(() => {
    const savedExhibitors = localStorage.getItem('selectedExhibitors');
    if (savedExhibitors) {
      setSelectedExhibitors(JSON.parse(savedExhibitors));
    }
  }, []);

  // Fetch exhibitors based on selected interests
  useEffect(() => {
    const fetchExhibitors = async () => {
      try {
        setLoading(true);
        setError(null); // Clear any previous errors

        // Get selected interests from localStorage
        const savedInterests = localStorage.getItem('selectedInterests');

        if (!savedInterests) {
          setLoading(false);
          return;
        }

        const interests = JSON.parse(savedInterests);
        // Extract just the subcategory names
        const subcategories = interests.map(interest => interest.subCategory);

        if (subcategories.length === 0) {
          setLoading(false);
          return;
        }

        console.log('Searching for subcategories:', subcategories);

        // Show a more detailed request for debugging
        console.log('Sending request to /exhibitors/search with data:', { subcategories });

        // Call API to search for exhibitors with matching subcategories
        const response = await api.post('/exhibitors/search', { subcategories });

        console.log('API response:', response.data);

        if (response.data) {
          if (response.data.error) {
            console.error('Error from API:', response.data.error);
            setError(response.data.error);
            setExhibitors([]);
            setFilteredExhibitors([]);
          } else {
            const exhibitorsData = Array.isArray(response.data) ? response.data : [];
            setExhibitors(exhibitorsData);
            setFilteredExhibitors(exhibitorsData); // Initialize filtered exhibitors with all exhibitors
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching exhibitors:', error);

        // Show a more detailed error message
        const errorResponse = error.response;
        console.log('Error response:', errorResponse);

        let errorMessage = 'Failed to load exhibitors. Please try again.';

        if (errorResponse && errorResponse.data && errorResponse.data.error) {
          errorMessage = errorResponse.data.error;
        }

        setError(errorMessage);
        setExhibitors([]);
        setLoading(false);
      }
    };

    fetchExhibitors();
  }, []);

  // Filter exhibitors whenever search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredExhibitors(exhibitors);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = exhibitors.filter(exhibitor =>
      exhibitor.company_name.toLowerCase().includes(searchTermLower) ||
      (exhibitor.product_profile && exhibitor.product_profile.toLowerCase().includes(searchTermLower)) ||
      (exhibitor.description && exhibitor.description.toLowerCase().includes(searchTermLower)) ||
      (exhibitor.region_country && exhibitor.region_country.toLowerCase().includes(searchTermLower))
    );

    setFilteredExhibitors(filtered);
    setDisplayCount(5); // Reset display count when filtering
  }, [searchTerm, exhibitors]);

  // Save selected exhibitors to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedExhibitors', JSON.stringify(selectedExhibitors));
  }, [selectedExhibitors]);

  const goBack = () => {
    navigate('/business/interest'); // Navigate specifically to interest page
  };

  const toggleSelection = (companyName) => {
    if (selectedExhibitors.includes(companyName)) {
      setSelectedExhibitors(selectedExhibitors.filter(name => name !== companyName));
    } else {
      setSelectedExhibitors([...selectedExhibitors, companyName]);
    }
  };

  const openProductModal = async (exhibitorId) => {
    try {
      // Fetch products for this exhibitor
      const response = await api.get(`/exhibitors/${exhibitorId}/products`);

      if (response.data && response.data.length > 0) {
        setCurrentProduct(response.data[0]);
        setCurrentProductIndex(0);
        setShowModal(true);
      } else {
        throw new Error('No products found');
      }
    } catch (error) {
      console.error('Error fetching products:', error);

      // Fallback to sample products if API fails
      const exhibitor = exhibitors.find(e => e.id === exhibitorId) || {};
      const companyName = exhibitor.company_name || 'Company';

      const sampleProducts = [
        {
          name: `${companyName} Concealer`,
          description: `${companyName} Concealer is the state of the art concealer, developed in 1982. Its formula contains...`
        },
        {
          name: `${companyName} Foundation`,
          description: `${companyName} Foundation provides full coverage with a natural finish, perfect for all skin types.`
        },
        {
          name: `${companyName} Highlighter`,
          description: `${companyName} Highlighter gives a natural glow that lasts all day without fading.`
        }
      ];

      setCurrentProduct(sampleProducts[0]);
      setCurrentProductIndex(0);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const nextProduct = async (exhibitorId) => {
    try {
      // Fetch products again or use a cached version
      const response = await api.get(`/exhibitors/${exhibitorId}/products`);

      if (response.data && response.data.length > 0) {
        const products = response.data;
        const nextIndex = (currentProductIndex + 1) % products.length;
        setCurrentProductIndex(nextIndex);
        setCurrentProduct(products[nextIndex]);
      } else {
        throw new Error('No products found');
      }
    } catch (error) {
      console.error('Error fetching products:', error);

      // Fallback to sample products if API fails
      const exhibitor = exhibitors.find(e => e.id === exhibitorId) || {};
      const companyName = exhibitor.company_name || 'Company';

      const sampleProducts = [
        {
          name: `${companyName} Concealer`,
          description: `${companyName} Concealer is the state of the art concealer, developed in 1982. Its formula contains...`
        },
        {
          name: `${companyName} Foundation`,
          description: `${companyName} Foundation provides full coverage with a natural finish, perfect for all skin types.`
        },
        {
          name: `${companyName} Highlighter`,
          description: `${companyName} Highlighter gives a natural glow that lasts all day without fading.`
        }
      ];

      const nextIndex = (currentProductIndex + 1) % sampleProducts.length;
      setCurrentProductIndex(nextIndex);
      setCurrentProduct(sampleProducts[nextIndex]);
    }
  };

  const loadMore = () => {
    setDisplayCount(prevCount => prevCount + 5);
  };

  const handleScheduleMeeting = () => {
    // Find the full exhibitor objects for the selected exhibitors
    const selectedExhibitorData = exhibitors.filter(exhibitor =>
      selectedExhibitors.includes(exhibitor.company_name)
    );

    // Navigate to schedule meeting page with selected exhibitor data
    navigate('/business/schedule', {
      state: {
        selectedExhibitors: selectedExhibitorData
      }
    });
  };

  // Get the current exhibitors to display based on the displayCount and filtered results
  const visibleExhibitors = filteredExhibitors.slice(0, displayCount);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen form-container">
        <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-[#6f0f55] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
        </div>
      </div>
    );
  }

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
        {/* Search bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by company name, products, region..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="info-bar">
            <p className="info-counter">Showing {visibleExhibitors.length} out of {filteredExhibitors.length} matches</p>
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

        {error && (
          <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
            {error}
          </div>
        )}

        {filteredExhibitors.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-lg font-semibold">No matching exhibitors found</p>
            <p className="text-gray-600">Try selecting different interests or categories</p>
            <button className="mt-4 btn-secondary" onClick={goBack}>
              &larr; Back to Select Interests
            </button>
          </div>
        ) : (
          <div className="exhibitor-list">
            {visibleExhibitors.map((exhibitor) => (
              <div key={exhibitor.id} className="exhibitor-card">
                <div className="exhibitor-flex">
                  {/* Logo - Now using the image util function */}
                  <div className="company-logo">
                    {exhibitor.logo ? (
                      <img src={exhibitor.logo} alt={`${exhibitor.company_name} logo`} className="object-contain w-full h-full" />
                    ) : (
                      <img
                        src={getCompanyLogo(exhibitor.company_name) || '/images/placeholder-logo.png'}
                        alt={`${exhibitor.company_name} logo`}
                        className="object-contain w-full h-full"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/images/placeholder-logo.png';
                        }}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="card-content">
                    <div className="card-grid">
                      <div>
                        <span className="label">Company Name: </span>
                        {exhibitor.company_name}
                      </div>
                      <div>
                        <span className="label">Booth Number: </span>
                        {exhibitor.booth_number}
                      </div>
                      <div>
                        <span className="label">Country/Region: </span>
                        {exhibitor.region_country}
                      </div>
                    </div>

                    <div className="mt-2">
                      <span className="label">Product Profile: </span>
                      {exhibitor.product_profile || 'No product profile available'}
                    </div>

                    <div className="mt-2">
                      <span className="label">Company Description: </span>
                      <p className="mt-1">{exhibitor.description}</p>
                    </div>

                    <div className="flex justify-end gap-3 mt-4">
                      <button
                        className="btn-secondary"
                        onClick={() => openProductModal(exhibitor.id)}
                      >
                        View Products
                      </button>
                      <button
                        className={selectedExhibitors.includes(exhibitor.company_name) ? 'btn-selected' : 'btn-unselected'}
                        onClick={() => toggleSelection(exhibitor.company_name)}
                      >
                        {selectedExhibitors.includes(exhibitor.company_name) ? 'Selected' : 'Select'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Button row with show more and back buttons aligned horizontally */}
        <div className="flex items-center justify-between mt-8 mb-4">
          {/* Back to Interest Page Button - positioned at bottom left */}
          <button className="btn-secondary" onClick={goBack}>
            &larr; Back to Interest
          </button>

          {/* Show More Button (only shown if there are more exhibitors to display) */}
          {displayCount < filteredExhibitors.length ? (
            <button className="btn-primary btn-lg" onClick={loadMore}>
              Show More ({Math.min(5, filteredExhibitors.length - displayCount)} remaining)
            </button>
          ) : (
            <div></div> /* Empty div to maintain layout when show more is not displayed */
          )}
        </div>
      </div>

      {/* Product Modal */}
      {showModal && currentProduct && (
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
              {/* Product Image - Now using the image util function */}
              <div className="product-logo">
                {currentProduct.image ? (
                  <img src={currentProduct.image} alt={currentProduct.name} className="object-contain w-full h-full" />
                ) : (
                  <img
                    src={getProductImage(currentProduct.company_name || '', currentProduct.name) || '/images/placeholder-product.png'}
                    alt={currentProduct.name}
                    className="object-contain w-full h-full"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/placeholder-product.png';
                    }}
                  />
                )}
              </div>

              {/* Product Details */}
              <div className="w-[90%]">
                <h3 className="modal-title">Product Name: {currentProduct.name}</h3>

                <div className="relative mt-4">
                  <h4 className="modal-title">Product Description:</h4>
                  <p className="mt-2 text-sm">{currentProduct.description}</p>

                  {/* Next button */}
                  <button
                    onClick={() => {
                      const exhibitor = exhibitors.find(e =>
                        currentProduct.name.includes(e.company_name)
                      );
                      if (exhibitor) {
                        nextProduct(exhibitor.id);
                      }
                    }}
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
