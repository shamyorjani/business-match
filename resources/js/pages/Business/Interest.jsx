import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CompanyInfo = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [selectedInterests, setSelectedInterests] = useState([]);

    // Load selected interests from local storage on component mount
    useEffect(() => {
        const savedInterests = localStorage.getItem('selectedInterests');
        if (savedInterests) {
            setSelectedInterests(JSON.parse(savedInterests));
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    const handleNext = () => {
        // Save selected interests to local storage
        localStorage.setItem('selectedInterests', JSON.stringify(selectedInterests));

        // Pass along the selected interests with navigation
        navigate('/business/exhibitor-matching', { state: { selectedInterests, ...formData } });
    };

    const handleBack = () => {
        // Save selected interests to local storage before going back
        localStorage.setItem('selectedInterests', JSON.stringify(selectedInterests));
        navigate('/business/company');
    };

    const [openCategoryIndex, setOpenCategoryIndex] = useState(null); // Track which category is expanded
    const [openSubCategoryIndex, setOpenSubCategoryIndex] = useState(null); // Track which subcategory is expanded
    const [searchTerm, setSearchTerm] = useState(''); // Track the search term

    const categories = [
        {
            name: 'Professional Beauty salon & Skincare solutions',
            subCategories: []
        },
        {
            name: 'Haircare Product, Tools & Accessories',
            subCategories: [
                {
                    name: 'Lip Makeup'
                }
            ]
        },
        {
            name: 'Cosmetics',
            subCategories: [
                {
                    name: 'Face Makeup'
                },
                {
                    name: 'Eye Makeup'
                },
                {
                    name: 'Lip Makeup'
                }
            ]
        },
    ];

    // Filter categories based on search term
    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
    const toggleSubCategorySelection = (categoryName, subCategoryName) => {
        const interestKey = JSON.stringify({ category: categoryName, subCategory: subCategoryName });

        if (isSelected(categoryName, subCategoryName)) {
            // Remove if already selected
            setSelectedInterests(selectedInterests.filter(
                interest => !(interest.category === categoryName && interest.subCategory === subCategoryName)
            ));
        } else {
            // Add if not selected
            setSelectedInterests([...selectedInterests, { category: categoryName, subCategory: subCategoryName }]);
        }
    };

    const handleClickSubCategory = (categoryName, subCategoryName) => {
        toggleSubCategorySelection(categoryName, subCategoryName);
    };

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
                                    {searchTerm === '' ? (
                                        // Show all categories if search term is empty
                                        categories.map((category, categoryIndex) => (
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
                                                                    className={`flex border-t-[1px] border-[#D9D9D9] items-center justify-between w-full px-[10%] py-[10px] text-left ${isSelected(category.name, subCategory.name) ? 'bg-[#6f0f55] text-white' : 'text-black hover:text-white hover:bg-[#6f0f55]'} focus:outline-none ${categoryIndex === categories.length - 1 && subCategoryIndex === category.subCategories.length - 1 ? 'rounded-b-2xl' : ''}`}
                                                                    style={{ fontFamily: 'Instrument Sans', fontWeight: 700, fontSize: '15px' }}
                                                                    onClick={() => handleClickSubCategory(category.name, subCategory.name)}
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
                                        // Show filtered categories when there is a search term
                                        filteredCategories.length === 0 ? (
                                            <div className="px-4 py-2 text-gray-500">No categories found</div>
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

                                                    {/* Subcategory Dropdown */}
                                                    {openCategoryIndex === categoryIndex && category.subCategories.length > 0 && (
                                                        <div className="">
                                                            {category.subCategories.map((subCategory, subCategoryIndex) => (
                                                                <div className='' key={subCategoryIndex}>
                                                                    <button
                                                                        className={`flex border-t-[1px] border-[#D9D9D9] items-center justify-between w-full px-[10%] py-[10px] text-left ${isSelected(category.name, subCategory.name) ? 'bg-[#6f0f55] text-white' : 'text-black hover:text-white hover:bg-[#6f0f55]'} focus:outline-none ${categoryIndex === filteredCategories.length - 1 && subCategoryIndex === category.subCategories.length - 1 ? 'rounded-b-2xl' : ''}`}
                                                                        style={{ fontFamily: 'Instrument Sans', fontWeight: 700, fontSize: '15px' }}
                                                                        onClick={() => handleClickSubCategory(category.name, subCategory.name)}
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
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Selected Interests Display */}
                    {selectedInterests.length > 0 && (
                        <div className="mt-6">
                            <h4 className="mb-2 font-semibold text-md">Selected Interests:</h4>
                            <div className="flex flex-wrap gap-2">
                                {selectedInterests.map((interest, index) => (
                                    <div key={index} className="bg-[#6f0f55] text-white px-3 py-1 rounded-full text-sm flex items-center">
                                        <span>{interest.subCategory}</span>
                                        <button
                                            className="ml-2 focus:outline-none"
                                            onClick={() => toggleSubCategorySelection(interest.category, interest.subCategory)}
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
                        <button type="button" onClick={handleBack}
                            className="back-btn">
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

export default CompanyInfo;
