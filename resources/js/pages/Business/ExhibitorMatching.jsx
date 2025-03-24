import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Import API service
import { getCompanyLogo, getProductImage } from '../../utils/imageUtils'; // Import image utility functions
import { loadExhibitorSelections, saveExhibitorSelections, clearAllExhibitorSelections } from '../../utils/selectionUtils';

const ExhibitorMatching = () => {
  const navigate = useNavigate();
  const [selectedExhibitors, setSelectedExhibitors] = useState([]);
  const [validSelectedExhibitors, setValidSelectedExhibitors] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [displayCount, setDisplayCount] = useState(5);
  const [exhibitors, setExhibitors] = useState([]);
  const [filteredExhibitors, setFilteredExhibitors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [subcategories, setSubcategories] = useState([]);
  const [currentInterests, setCurrentInterests] = useState([]);
  const [exhibitorProducts, setExhibitorProducts] = useState({});

  // Load selected exhibitors from localStorage when component mounts
  useEffect(() => {
    const fetchSelectedExhibitors = async () => {
      try {
        // Get selected interests - only use current ones from localStorage
        const savedInterests = localStorage.getItem('selectedInterests');
        if (!savedInterests) return;

        const interests = JSON.parse(savedInterests);
        // Store the full interest objects
        setCurrentInterests(interests);

        // Extract just the subcategory names
        const currentSubcategories = interests.map(interest => interest.subCategory);
        setSubcategories(currentSubcategories);

        // Use the utility function to load selections based on these subcategories
        const savedSelections = loadExhibitorSelections(currentSubcategories);
        if (savedSelections && savedSelections.length > 0) {
          setSelectedExhibitors(savedSelections);
        }
      } catch (error) {
        console.error('Error loading selected exhibitors:', error);
      }
    };

    fetchSelectedExhibitors();
  }, []);

  // Update valid selections whenever exhibitors or selected exhibitors change
  useEffect(() => {
    // Filter selected exhibitors to only include those that are currently in the exhibitors list
    const currentValidSelections = selectedExhibitors.filter(
      selectedName => exhibitors.some(exhibitor => exhibitor.company_name === selectedName)
    );

    setValidSelectedExhibitors(currentValidSelections);

    // Only update storage with valid selections if we have exhibitors loaded
    if (exhibitors.length > 0 && currentValidSelections.length !== selectedExhibitors.length) {
      setSelectedExhibitors(currentValidSelections);
    }
  }, [exhibitors, selectedExhibitors]);

  // Fetch exhibitors based on selected interests
  useEffect(() => {
    const fetchExhibitors = async () => {
      try {
        setLoading(true);
        setError(null); // Clear any previous errors

        // Get current interests directly from state instead of localStorage
        if (currentInterests.length === 0) {
          // If no interests in state yet, get from localStorage
          const savedInterests = localStorage.getItem('selectedInterests');
          if (!savedInterests) {
            setLoading(false);
            return;
          }

          const interests = JSON.parse(savedInterests);
          setCurrentInterests(interests);

          // Extract just the subcategory names
          const subcats = interests.map(interest => interest.subCategory);
          setSubcategories(subcats);
        }

        // Use subcategories from state
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
            // Get exhibitors data
            const exhibitorsData = Array.isArray(response.data) ? response.data : [];

            // Enhanced deduplication logic that checks booth numbers and company names
            const uniqueExhibitors = [];
            const seenCompanyBoothPairs = new Set();

            exhibitorsData.forEach(exhibitor => {
              // Create a unique key combining company name and booth number
              // This handles cases where the same company appears with slightly different data
              const companyBoothKey = `${exhibitor.company_name}-${exhibitor.booth_number}`.toLowerCase();

              if (!seenCompanyBoothPairs.has(companyBoothKey)) {
                seenCompanyBoothPairs.add(companyBoothKey);
                uniqueExhibitors.push(exhibitor);
              } else {
                // If we find a duplicate, we might want to merge product profiles to ensure
                // we're not losing any information when removing duplicates
                const existingIndex = uniqueExhibitors.findIndex(ex =>
                  `${ex.company_name}-${ex.booth_number}`.toLowerCase() === companyBoothKey
                );

                if (existingIndex !== -1) {
                  const existing = uniqueExhibitors[existingIndex];

                  // If the duplicate has a longer product profile, use that instead
                  if (exhibitor.product_profile &&
                      (!existing.product_profile ||
                       exhibitor.product_profile.length > existing.product_profile.length)) {
                    uniqueExhibitors[existingIndex].product_profile = exhibitor.product_profile;
                  }

                  // Same for description
                  if (exhibitor.description &&
                      (!existing.description ||
                       exhibitor.description.length > existing.description.length)) {
                    uniqueExhibitors[existingIndex].description = exhibitor.description;
                  }
                }

                console.log(`Duplicate exhibitor found and merged: ${exhibitor.company_name} (Booth: ${exhibitor.booth_number})`);
              }
            });

            console.log(`Filtered ${exhibitorsData.length - uniqueExhibitors.length} duplicate exhibitors`);

            setExhibitors(uniqueExhibitors);
            setFilteredExhibitors(uniqueExhibitors); // Initialize filtered exhibitors with deduplicated exhibitors
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
  }, [currentInterests]);

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
    if (selectedExhibitors.length >= 0 && subcategories.length > 0) {
      // Use the utility function to save selections
      saveExhibitorSelections(selectedExhibitors, subcategories);
    }
  }, [selectedExhibitors, subcategories]);

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
      // Show loading state in the modal
      setCurrentProduct({
        name: 'Loading...',
        description: 'Loading product details...',
        exhibitor_id: exhibitorId,
        noProducts: false // Add flag to track if there are no products
      });
      setShowModal(true);
      setCurrentProductIndex(0);

      // Fetch products for this exhibitor if not already cached
      if (!exhibitorProducts[exhibitorId] || exhibitorProducts[exhibitorId].length === 0) {
        const response = await api.get(`/exhibitors/${exhibitorId}/products`);
        console.log('Product data received:', response.data);

        // Check if there are actual products (not just placeholder "no products" message)
        // A real product won't have name containing "No Products" and will have a positive ID
        const hasRealProducts = response.data &&
                               response.data.length > 0 &&
                               !response.data[0].name.includes('No Products') &&
                               response.data[0].id > 0;

        if (hasRealProducts) {
          console.log('Found real products for exhibitor:', exhibitorId);
          // Store products in state for this specific exhibitor
          setExhibitorProducts(prev => ({
            ...prev,
            [exhibitorId]: response.data
          }));

          // Set the first product as current
          setCurrentProduct(response.data[0]);
        } else {
          console.log('No real products found for exhibitor:', exhibitorId);
          // Handle case where no products are found
          const exhibitor = exhibitors.find(e => e.id === exhibitorId) || {};
          const companyName = exhibitor.company_name || 'This company';

          setCurrentProduct({
            noProducts: true,
            exhibitor_id: exhibitorId,
            companyName: companyName
          });
        }
      } else {
        // Use cached products
        console.log('Using cached products for exhibitor', exhibitorId);
        setCurrentProduct(exhibitorProducts[exhibitorId][0]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);

      // Display error state as no products in the modal
      const exhibitor = exhibitors.find(e => e.id === exhibitorId) || {};
      const companyName = exhibitor.company_name || 'This company';

      setCurrentProduct({
        noProducts: true,
        exhibitor_id: exhibitorId,
        companyName: companyName
      });
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const nextProduct = (exhibitorId) => {
    try {
      // Check if we have products for this exhibitor
      const products = exhibitorProducts[exhibitorId];

      if (products && products.length > 0) {
        const nextIndex = (currentProductIndex + 1) % products.length;
        setCurrentProductIndex(nextIndex);
        setCurrentProduct(products[nextIndex]);
      } else {
        // If no products in state, try to fetch them
        openProductModal(exhibitorId);
      }
    } catch (error) {
      console.error('Error displaying next product:', error);
    }
  };

  const loadMore = () => {
    setDisplayCount(prevCount => prevCount + 5);
  };

  const handleScheduleMeeting = () => {
    // Find the full exhibitor objects for the selected exhibitors
    const selectedExhibitorData = exhibitors.filter(exhibitor =>
      validSelectedExhibitors.includes(exhibitor.company_name)
    );

    // Format the exhibitor data properly for ScheduleMeeting component
    const formattedExhibitors = selectedExhibitorData.map(exhibitor => ({
      name: exhibitor.company_name,
      boothNumber: exhibitor.booth_number || 'N/A'
    }));

    // Navigate to schedule meeting page with selected exhibitor data
    navigate('/business/schedule', {
      state: {
        selectedExhibitors: formattedExhibitors
      }
    });
  };

  // Clear all saved selections for current subcategories
  const clearAllSelections = () => {
    // Only clear the current selections, not all selections
    setSelectedExhibitors([]);
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
        {/* Search and selection info */}
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <input
              type="text"
              placeholder="Search by company name, products, region..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {validSelectedExhibitors.length > 0 && (
              <button
                className="px-3 py-2 ml-4 text-sm text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50"
                onClick={clearAllSelections}
              >
                Clear Selections
              </button>
            )}
          </div>
        </div>

        {/* Selected subcategories display - Only show current subcategories */}
        {subcategories.length > 0 && (
          <div className="px-4 py-2 mb-4 bg-gray-100 rounded-md">
            <p className="font-semibold">Filtering by:</p>
            <div className="flex flex-wrap gap-2 mt-1">
              {subcategories.map((subcat, index) => (
                <span key={index} className="px-2 py-1 text-sm bg-gray-200 rounded">
                  {subcat}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="info-bar flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-0">
          <p className="info-counter text-sm md:text-base">Showing {visibleExhibitors.length} out of {filteredExhibitors.length} matches</p>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4 w-full md:w-auto">
            <p className="selected-counter text-sm md:text-base">{validSelectedExhibitors.length} Exhibitor(s) selected</p>
            {validSelectedExhibitors.length > 0 && (
              <button
                className="btn-primary w-full md:w-auto"
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
          <div className="exhibitor-list grid gap-4">
            {visibleExhibitors.map((exhibitor) => (
              <div key={exhibitor.id} className="exhibitor-card p-4 border rounded-lg">
                <div className="exhibitor-flex flex-col md:flex-row gap-4">
                  <div className="company-logo w-full md:w-40 h-32 md:h-40 mx-auto md:mx-0">
                    {exhibitor.logo ? (
                        <img src={`/assets/images/${exhibitor.logo}`} alt={`${exhibitor.company_name} logo`} className="object-contain w-full h-full bg-white" />
                    ) : (
                        <img
                            src={getCompanyLogo(exhibitor.company_name) || '/images/placeholder-logo.png'}
                            alt={`${exhibitor.company_name} logo`}
                            className="object-contain w-full h-full bg-white"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/placeholder-logo.png';
                            }}
                        />
                    )}
                </div>

                {/* Content */}
                  <div className="card-content flex-1">
                    <div className="card-grid grid md:grid-cols-2 gap-2">
                      <div className="break-words">
                        <span className="label font-semibold">Company Name: </span>
                        {exhibitor.company_name}
                      </div>
                      <div>
                        <span className="label font-semibold">Booth Number: </span>
                        {exhibitor.booth_number}
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <span className="label font-semibold">Country/Region: </span>
                        {exhibitor.region_country}
                      </div>
                    </div>

                    <div className="mt-2">
                      <span className="label font-semibold">Product Profile: </span>
                      {exhibitor.product_profile || 'No product profile available'}
                    </div>

                    <div className="mt-2">
                      <span className="label font-semibold">Company Description: </span>
                      <p className="mt-1">{exhibitor.description}</p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                      <button
                        className="btn-secondary w-full sm:w-auto"
                        onClick={() => openProductModal(exhibitor.id)}
                      >
                        View Products
                      </button>
                      <button
                        className={`${selectedExhibitors.includes(exhibitor.company_name) ? 'btn-selected' : 'btn-unselected'} w-full sm:w-auto`}
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 mb-4">
          {/* Back to Interest Page Button */}
          <button className="btn-secondary w-full sm:w-auto" onClick={goBack}>
            &larr; Back to Interest
          </button>

          {/* Show More Button (only shown if there are more exhibitors to display) */}
          {displayCount < filteredExhibitors.length ? (
            <button className="btn-primary btn-lg w-full sm:w-auto" onClick={loadMore}>
              Show More ({Math.min(5, filteredExhibitors.length - displayCount)} remaining)
            </button>
          ) : (
            <div></div> /* Empty div to maintain layout when show more is not displayed */
          )}
        </div>
      </div>

      {/* Product Modal */}
      {showModal && currentProduct && (
        <div className="modal-overlay fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: '#584058B5' }}>
          <div className="modal-container bg-white rounded-lg shadow-lg w-[95%] md:w-[80%] max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="modal-close absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl font-bold"
            >
              ×
            </button>

            <div className="modal-content p-4 md:p-6 flex flex-col items-center">
            {currentProduct.noProducts ? (
              <div className="flex flex-col items-center justify-center w-full p-4 md:p-6 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 md:w-16 md:h-16 mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m0-10l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <h3 className="mb-2 text-lg md:text-xl font-semibold text-gray-700">No Products Available</h3>
                <p className="text-sm md:text-base text-gray-600">
                  {currentProduct.companyName} does not have any products available at this time.
                </p>
              </div>
            ) : (
              <>
                <div className="product-logo w-full max-w-[200px] h-40 md:h-48 mb-4">
                    {currentProduct.image ? (
                        <img src={`/assets/images/${currentProduct.image}`} alt={currentProduct.name} className="object-contain w-full h-full bg-white" />
                    ) : (
                        <img
                            src={getProductImage(currentProduct.company_name || '', currentProduct.name) || '/images/placeholder-product.png'}
                            alt={currentProduct.name}
                            className="object-contain w-full h-full bg-white"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/assets/images/logo1.jpg';
                            }}
                        />
                    )}
                </div>

                {/* Product Details */}
                <div className="w-full">
                  <h3 className="modal-title text-lg md:text-xl">Product Name: {currentProduct.name}</h3>

                  <div className="relative mt-4">
                    <h4 className="modal-title text-base md:text-lg">Product Description:</h4>
                    <p className="mt-2 text-sm md:text-base">{currentProduct.description}</p>

                    {/* Next button - only show if there are multiple products */}
                    {currentProduct.exhibitor_id && exhibitorProducts[currentProduct.exhibitor_id]?.length > 1 && (
                      <button
                        onClick={() => nextProduct(currentProduct.exhibitor_id)}
                        className="absolute right-0 text-xl font-bold transform -translate-y-1/2 top-1/2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Navigation dots - only show actual number of products */}
                  {currentProduct.exhibitor_id && exhibitorProducts[currentProduct.exhibitor_id]?.length > 0 && (
                    <div className="flex items-center justify-center gap-2 mt-6">
                      {exhibitorProducts[currentProduct.exhibitor_id].map((_, index) => (
                        <span
                          key={index}
                          className={`dot ${currentProductIndex === index ? 'dot-active' : 'dot-inactive'}`}
                          onClick={() => {
                            setCurrentProductIndex(index);
                            setCurrentProduct(exhibitorProducts[currentProduct.exhibitor_id][index]);
                          }}
                        ></span>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExhibitorMatching;
