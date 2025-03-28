import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api'; // Import the API service

const Interest = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [categories, setCategories] = useState([]); // State for categories
    const [openCategoryIndex, setOpenCategoryIndex] = useState(null); // Track which category is expanded
    const [searchTerm, setSearchTerm] = useState(''); // Track the search term
    const [loading, setLoading] = useState(true); // State for loading
    const [loadingMore, setLoadingMore] = useState(false); // State for loading more when scrolling
    const [lastFetchTime, setLastFetchTime] = useState(0);
    const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes in milliseconds
    const [lastLoadedIds, setLastLoadedIds] = useState([]); // Track IDs of loaded categories
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const [hasMore, setHasMore] = useState(true); // Track if there are more categories to load
    const ITEMS_PER_PAGE = 10; // Number of categories to load per page

    // Load selected interests from local storage on component mount
    useEffect(() => {
        const savedInterests = localStorage.getItem('selectedInterests');
        if (savedInterests) {
            setSelectedInterests(JSON.parse(savedInterests));
        }
    }, []);

    // Check if cached categories data exists and is still valid
    const getCachedCategories = () => {
        const cachedData = localStorage.getItem('categoriesCache');
        if (cachedData) {
            try {
                const { timestamp, categories, loadedIds } = JSON.parse(cachedData);
                const now = Date.now();
                if (now - timestamp < CACHE_DURATION) {
                    // Set the list of already loaded IDs
                    if (loadedIds) {
                        setLastLoadedIds(loadedIds);
                    } else {
                        // For backward compatibility with previous cache format
                        setLastLoadedIds(categories.map(cat => cat.id));
                    }
                    return categories;
                }
            } catch (error) {
                console.error('Error parsing cached categories:', error);
            }
        }
        return null;
    };

    // Fetch categories and subcategories from the API or use cached data
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // Check if we have valid cached data
                const cachedCategories = getCachedCategories();

                if (cachedCategories) {
                    console.log('Using cached categories data');
                    setCategories(cachedCategories);
                    setLoading(false);

                    // Now check for any new categories since the last load
                    await fetchNewCategories(cachedCategories);
                    return;
                }

                // No valid cache, proceed with full API fetch
                setLoading(true);
                await performFullFetch();
            } catch (error) {
                console.error('Error fetching categories:', error);
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Function to fetch only new categories not in the cache
    const fetchNewCategories = async (existingCategories) => {
        try {
            setLoadingMore(true);
            // Get all categories to find new ones
            const response = await api.get('/categories');
            const allCategoriesData = response.data;

            if (!Array.isArray(allCategoriesData)) {
                console.error('Unexpected response format:', allCategoriesData);
                setLoadingMore(false);
                return;
            }

            // Find categories that aren't in our cache
            const newCategories = allCategoriesData.filter(
                category => !lastLoadedIds.includes(category.id)
            );

            if (newCategories.length === 0) {
                console.log('No new categories found');
                setLoadingMore(false);
                return;
            }

            console.log(`Found ${newCategories.length} new categories`);

            // Fetch subcategories for each new category
            const newCategoriesWithSubcategories = await Promise.all(
                newCategories.map(async (category) => {
                    try {
                        const subcategoriesResponse = await api.get(`/categories/${category.id}/subcategories`);
                        return {
                            ...category,
                            subCategories: subcategoriesResponse.data
                        };
                    } catch (error) {
                        console.error(`Error fetching subcategories for category ${category.id}:`, error);
                        return {
                            ...category,
                            subCategories: []
                        };
                    }
                })
            );

            // Filter out categories without subcategories
            const filteredNewCategories = newCategoriesWithSubcategories.filter(
                category => category.subCategories && category.subCategories.length > 0
            );

            if (filteredNewCategories.length === 0) {
                setLoadingMore(false);
                return;
            }

            // Combine existing categories with new ones
            const updatedCategories = [...existingCategories, ...filteredNewCategories];

            // Update the list of loaded IDs
            const updatedLoadedIds = [...lastLoadedIds, ...filteredNewCategories.map(cat => cat.id)];
            setLastLoadedIds(updatedLoadedIds);

            // Update the cache
            localStorage.setItem('categoriesCache', JSON.stringify({
                timestamp: Date.now(),
                categories: updatedCategories,
                loadedIds: updatedLoadedIds
            }));

            // Update state with combined data
            setCategories(updatedCategories);
            setLastFetchTime(Date.now());
            setLoadingMore(false);

        } catch (error) {
            console.error('Error fetching new categories:', error);
            setLoadingMore(false);
        }
    };

    // Function to perform a full fetch of all categories
    const performFullFetch = async () => {
        try {
            const response = await api.get('/categories');
            const categoriesData = response.data;

            if (Array.isArray(categoriesData)) {
                // Calculate pagination
                const startIndex = 0;
                const endIndex = ITEMS_PER_PAGE;
                const initialCategories = categoriesData.slice(startIndex, endIndex);
                
                // Fetch subcategories for initial categories
                setLoadingMore(true);
                const categoriesWithSubcategories = await Promise.all(
                    initialCategories.map(async (category) => {
                        try {
                            const subcategoriesResponse = await api.get(`/categories/${category.id}/subcategories`);
                            return {
                                ...category,
                                subCategories: subcategoriesResponse.data
                            };
                        } catch (error) {
                            console.error(`Error fetching subcategories for category ${category.id}:`, error);
                            return {
                                ...category,
                                subCategories: []
                            };
                        }
                    })
                );

                // Filter out categories without subcategories
                const filteredCategories = categoriesWithSubcategories.filter(
                    category => category.subCategories && category.subCategories.length > 0
                );

                const categoryIds = filteredCategories.map(cat => cat.id);
                setLastLoadedIds(categoryIds);

                // Cache the filtered categories data
                localStorage.setItem('categoriesCache', JSON.stringify({
                    timestamp: Date.now(),
                    categories: filteredCategories,
                    loadedIds: categoryIds
                }));
                setLastFetchTime(Date.now());

                setCategories(filteredCategories);
                setHasMore(categoriesData.length > ITEMS_PER_PAGE);
                setCurrentPage(1);
                setLoadingMore(false);
                setLoading(false);
            } else {
                console.error('Unexpected response format:', categoriesData);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error in full fetch:', error);
            setLoading(false);
        }
    };

    // Function to load more categories
    const loadMoreCategories = async () => {
        if (loadingMore || !hasMore) return;

        try {
            setLoadingMore(true);
            const response = await api.get('/categories');
            const categoriesData = response.data;

            if (Array.isArray(categoriesData)) {
                const startIndex = currentPage * ITEMS_PER_PAGE;
                const endIndex = startIndex + ITEMS_PAGE;
                const nextCategories = categoriesData.slice(startIndex, endIndex);

                if (nextCategories.length === 0) {
                    setHasMore(false);
                    setLoadingMore(false);
                    return;
                }

                // Fetch subcategories for next batch of categories
                const categoriesWithSubcategories = await Promise.all(
                    nextCategories.map(async (category) => {
                        try {
                            const subcategoriesResponse = await api.get(`/categories/${category.id}/subcategories`);
                            return {
                                ...category,
                                subCategories: subcategoriesResponse.data
                            };
                        } catch (error) {
                            console.error(`Error fetching subcategories for category ${category.id}:`, error);
                            return {
                                ...category,
                                subCategories: []
                            };
                        }
                    })
                );

                // Filter out categories without subcategories
                const filteredNewCategories = categoriesWithSubcategories.filter(
                    category => category.subCategories && category.subCategories.length > 0
                );

                if (filteredNewCategories.length === 0) {
                    setHasMore(false);
                    setLoadingMore(false);
                    return;
                }

                // Update the list of loaded IDs
                const updatedLoadedIds = [...lastLoadedIds, ...filteredNewCategories.map(cat => cat.id)];
                setLastLoadedIds(updatedLoadedIds);

                // Update categories state
                setCategories(prevCategories => [...prevCategories, ...filteredNewCategories]);
                setCurrentPage(prevPage => prevPage + 1);
                setHasMore(endIndex < categoriesData.length);

                // Update cache
                const cachedData = JSON.parse(localStorage.getItem('categoriesCache') || '{}');
                localStorage.setItem('categoriesCache', JSON.stringify({
                    ...cachedData,
                    categories: [...(cachedData.categories || []), ...filteredNewCategories],
                    loadedIds: updatedLoadedIds
                }));

                setLoadingMore(false);
            }
        } catch (error) {
            console.error('Error loading more categories:', error);
            setLoadingMore(false);
        }
    };

    // Update scroll handler to use new loadMoreCategories function
    useEffect(() => {
        const handleScroll = () => {
            if (loading || loadingMore) return;

            const scrollPosition = window.innerHeight + window.scrollY;
            const pageHeight = document.body.offsetHeight;

            if (scrollPosition >= pageHeight - 300) {
                loadMoreCategories();
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [loading, loadingMore, hasMore, currentPage]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    const handleNext = () => {
        // Save selected interests to local storage
        localStorage.setItem('selectedInterests', JSON.stringify(selectedInterests));

        // Get user and company IDs from localStorage
        const userCompanyData = JSON.parse(localStorage.getItem('userCompanyData') || '{}');
        
        // Navigate to exhibitor matching with selected interests and user data
        navigate('/hosted/exhibitor-matching', { 
            state: { 
                selectedInterests,
                userId: userCompanyData.userId,
                companyId: userCompanyData.companyId,
                ...formData 
            } 
        });
    };

    const handleBack = () => {
        // Save selected interests to local storage before going back
        localStorage.setItem('selectedInterests', JSON.stringify(selectedInterests));
        navigate('/');
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Check if a subcategory is selected
    const isSelected = (categoryName, subCategoryName) => {
        return selectedInterests.some(
            interest => interest.category === categoryName && interest.subCategory === subCategoryName
        );
    };

    // Toggle selection of a subcategory
    const toggleSubCategorySelection = (categoryName, subCategoryName, categoryId, subCategoryId) => {
        if (isSelected(categoryName, subCategoryName)) {
            // Remove if already selected
            setSelectedInterests(selectedInterests.filter(
                interest => !(interest.category === categoryName && interest.subCategory === subCategoryName)
            ));
        } else {
            // Add if not selected
            setSelectedInterests([...selectedInterests, {
                category: categoryName,
                subCategory: subCategoryName,
                categoryId: categoryId,
                subCategoryId: subCategoryId
            }]);
        }
    };

    const handleClickSubCategory = (categoryName, subCategoryName, categoryId, subCategoryId) => {
        toggleSubCategorySelection(categoryName, subCategoryName, categoryId, subCategoryId);
    };

    // Filter categories based on search term
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filter selected interests to only show those available in the subcategories from the database
    const availableSelectedInterests = selectedInterests.filter(interest =>
        categories.some(category =>
            category.name === interest.category &&
            category.subCategories.some(subCategory => subCategory.name === interest.subCategory)
        )
    );

    // Skeleton loader component for categories
    const CategorySkeletonLoader = () => (
        <>
            {[1, 2, 3, 4].map((item) => (
                <div key={item} className="animate-pulse">
                    <div className="w-full border-t-[1px] border-[#D9D9D9] py-[16px] px-[48px] bg-[#FBFBFB]">
                        <div className="w-3/4 h-5 bg-gray-200 rounded"></div>
                    </div>
                    {item === 2 && (
                        <>
                            <div className="border-t-[1px] border-[#D9D9D9] py-[10px] px-[10%] bg-gray-50">
                                <div className="w-1/2 h-4 bg-gray-200 rounded"></div>
                            </div>
                            <div className="border-t-[1px] border-[#D9D9D9] py-[10px] px-[10%] bg-gray-50">
                                <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
                            </div>
                        </>
                    )}
                </div>
            ))}
        </>
    );

    return (
        <div className="form-container">
            <div className="form-white-container">
            <div className="mb-8">
                <h2 className="step-indicator" style={{ fontFamily: 'Instrument Sans', fontWeight: 700 }}>STEP 3</h2>
                <div className="flex">
                    <svg width="326" height="34" viewBox="0 0 400 40">
                        <polygon points="240,0 340,0 360,20 340,40 240,40 260,20" fill="#9c0c40" />
                        <polygon points="120,0 220,0 240,20 220,40 120,40 140,20" fill="#6f0f55" />
                        <polygon points="0,0 100,0 120,20 100,40 0,40" fill="#40033f" />
                    </svg>
                </div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold" style={{ fontFamily: 'Instrument Sans', fontWeight: 700, fontSize: '24px' }}>Kindly select your interest for business matching :</h3>
                        <p className="text-sm text-gray-600">You may select more than one interest.</p>
                    </div>
                </div>
                <div className='flex justify-center w-full align-items-center'>
                    <div className="relative rounded-2xl w-[80%] md:w-[60%]">
                        <input
                            type="text"
                            placeholder="Type Here to Search"
                            className="w-full px-4 py-3 text-gray-700 bg-white border-0 shadow-2xl rounded-t-2xl focus:outline-none"
                            style={{ padding: '21px 0 10px 48px', fontFamily: 'Instrument Sans', fontWeight: 700, fontSize: '18px' }}
                            value={searchTerm}
                            onChange={handleSearchChange} // Update search term
                        />
                        {/* Main Dropdown */}
                        <div className="relative left-0 w-full overflow-y-auto bg-white shadow-2xl rounded-b-2xl max-h-70">
                            <div className="">
                                {/* Remove the refresh button */}
                                {loading ? (
                                    <CategorySkeletonLoader />
                                ) : searchTerm === '' ? (
                                    // Show all categories if search term is empty
                                    filteredCategories.length > 0 ? (
                                        filteredCategories.map((category, categoryIndex) => (
                                            <div key={categoryIndex} className="relative">
                                                <div className="w-full">
                                                    <button
                                                        className="flex items-center justify-between w-full text-left text-black border-t-[1px] border-[#D9D9D9] focus:outline-none py-[16px] px-[48px] bg-[#FBFBFB]"
                                                        style={{ fontFamily: 'Instrument Sans', fontWeight: 700, fontSize: '15px' }}
                                                        onClick={() =>
                                                            setOpenCategoryIndex(openCategoryIndex === categoryIndex ? null : categoryIndex)
                                                        }
                                                    >
                                                        <span>{category.name}</span>
                                                        {category.subCategories.length > 0 && (
                                                            <svg className={`w-4 h-4 transform ${openCategoryIndex === categoryIndex ? 'rotate-270' : 'rotate-0'}`} fill="none" stroke="#6f0f55" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '29.140735626220703px', height: '31.879962921142578px' }}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>
                                                {openCategoryIndex === categoryIndex && category.subCategories.length > 0 && (
                                                    <div className="">
                                                        {category.subCategories.map((subCategory, subCategoryIndex) => (
                                                            <div className='' key={subCategoryIndex}>
                                                                <button
                                                                    className={`flex border-t-[1px] border-[#D9D9D9] items-center justify-between w-full px-[10%] py-[10px] text-left ${isSelected(category.name, subCategory.name) ? 'bg-[#6f0f55] text-white' : 'text-black hover:text-white hover:bg-[#6f0f55]'} focus:outline-none ${categoryIndex === filteredCategories.length - 1 && subCategoryIndex === category.subCategories.length - 1 ? 'rounded-b-2xl' : ''}`}
                                                                    style={{ fontFamily: 'Instrument Sans', fontWeight: 700, fontSize: '15px' }}
                                                                    onClick={() => handleClickSubCategory(category.name, subCategory.name, category.id, subCategory.id)}
                                                                >
                                                                    <span>{subCategory.name}</span>
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-2 text-center text-gray-500">No categories available</div>
                                    )
                                ) : (
                                    // Show filtered categories when there is a search term
                                    filteredCategories.length === 0 ? (
                                        <div className="px-4 py-2 text-center text-gray-500">No categories found</div>
                                    ) : (
                                        filteredCategories.map((category, categoryIndex) => (
                                            <div key={categoryIndex} className="relative">
                                                <div className="w-full">
                                                    <button
                                                        className="flex items-center justify-between w-full text-left text-black border-t-[1px] border-[#D9D9D9] focus:outline-none py-[16px] px-[48px] bg-[#FBFBFB]"
                                                        style={{ fontFamily: 'Instrument Sans', fontWeight: 700, fontSize: '15px' }}
                                                        onClick={() =>
                                                            setOpenCategoryIndex(openCategoryIndex === categoryIndex ? null : categoryIndex)
                                                        }
                                                    >
                                                        <span>{category.name}</span>
                                                        {category.subCategories.length > 0 && (
                                                            <svg className={`w-4 h-4 transform ${openCategoryIndex === categoryIndex ? 'rotate-270' : 'rotate-0'}`} fill="none" stroke="#6f0f55" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" style={{ width: '29.140735626220703px', height: '31.879962921142578px' }}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>
                                                {openCategoryIndex === categoryIndex && category.subCategories.length > 0 && (
                                                    <div className="">
                                                        {category.subCategories.map((subCategory, subCategoryIndex) => (
                                                            <div className='' key={subCategoryIndex}>
                                                                <button
                                                                    className={`flex border-t-[1px] border-[#D9D9D9] items-center justify-between w-full px-[10%] py-[10px] text-left ${isSelected(category.name, subCategory.name) ? 'bg-[#6f0f55] text-white' : 'text-black hover:text-white hover:bg-[#6f0f55]'} focus:outline-none ${categoryIndex === filteredCategories.length - 1 && subCategoryIndex === category.subCategories.length - 1 ? 'rounded-b-2xl' : ''}`}
                                                                    style={{ fontFamily: 'Instrument Sans', fontWeight: 700, fontSize: '15px' }}
                                                                    onClick={() => handleClickSubCategory(category.name, subCategory.name, category.id, subCategory.id)}
                                                                >
                                                                    <span>{subCategory.name}</span>
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))
                                    )
                                )}
                                {/* Loading more indicator */}
                                {loadingMore && (
                                    <div className="py-4 text-center">
                                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#6f0f55] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                                            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Selected Interests Display */}
                {availableSelectedInterests.length > 0 && (
                    <div className="mt-6">
                        <h4 className="mb-2 font-semibold text-md">Selected Interests:</h4>
                        <div className="flex flex-wrap gap-2">
                            {availableSelectedInterests.map((interest, index) => (
                                <div key={index} className="bg-[#6f0f55] text-white px-3 py-1 rounded-full text-sm flex items-center">
                                    <span>{interest.subCategory}</span>
                                    <button
                                        className="ml-2 focus:outline-none"
                                        onClick={() => toggleSubCategorySelection(interest.category, interest.subCategory, interest.categoryId, interest.subCategoryId)}
                                    >
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {/* Required Fields Note */}
                <div className="mt-6 text-sm text-red-600">*All fields are required to fill</div>

                {/* Navigation Buttons */}
                <div className="flex justify-end gap-4 mt-6">
                    <button type="button" onClick={handleBack} className="back-btn">
                        Back
                    </button>
                    <button type="submit" onClick={handleNext} className="primary-btn">
                        Next
                    </button>
                </div>
            </form>
        </div>
            </div>

    );
};

export default Interest;
