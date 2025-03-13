import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CompanyInfo = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    const handleNext = () => {
        navigate('/exhibitors');
    };

    const handleBack = () => {
        navigate('/company');
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

    const handleClickSubCategory = (subCategoryIndex) => {
        // Toggle the display of items for the selected subcategory
        setOpenSubCategoryIndex(openSubCategoryIndex === subCategoryIndex ? null : subCategoryIndex);
    };

    return (
        <div className="form-container">
            {/* Form Content */}
            <div className="p-10 py-16 bg-white">
                {/* Step Indicator */}
                <div className="mb-8">
                    <h2 className="step-indicator">STEP 2</h2>
                    <div className="flex">
                        <svg width="326" height="34" viewBox="0 0 400 40">
                            <polygon points="240,0 340,0 360,20 340,40 240,40 260,20" fill="#9c0c40" />
                            <polygon points="120,0 220,0 240,20 220,40 120,40 140,20" fill="#6f0f55" />
                            <polygon points="0,0 100,0 120,20 100,40 0,40" fill="#40033f" />
                        </svg>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold">Kindly select your interest for business matching :</h3>
                            <p className="text-sm text-gray-600">You may select more than one interest.</p>
                        </div>
                    </div>

                    <div className="relative border border-gray-300 rounded-2xl">
                        <input
                            type="text"
                            placeholder="Type Here to Search"
                            className="w-full px-4 py-3 text-gray-700 bg-white border-0 shadow-2xl rounded-t-2xl focus:outline-none"
                            value={searchTerm}
                            onChange={handleSearchChange} // Update search term
                        />

                        {/* Main Dropdown */}
                        <div className="relative left-0 w-full bg-white shadow-2xl rounded-b-2xl">
                            <div className=" max-h-60">
                                {searchTerm === '' ? (
                                    // Show all categories if search term is empty
                                    categories.map((category, categoryIndex) => (
                                        <div key={categoryIndex} className="relative">
                                            <div className="w-full">
                                                <button
                                                    className="flex items-center justify-between w-full px-4 py-2 text-left text-black border-t-[1px] border-[#D9D9D9] focus:outline-none"
                                                    onClick={() =>
                                                        setOpenCategoryIndex(openCategoryIndex === categoryIndex ? null : categoryIndex)
                                                    }
                                                >
                                                    <span>{category.name}</span>
                                                    {category.subCategories.length > 0 && (
                                                        <svg className={`w-4 h-4 transform ${openCategoryIndex === categoryIndex ? 'rotate-270' : 'rotate-0'}`} fill="none" stroke="#6f0f55" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>

                                            {/* Subcategory Dropdown */}
                                            {openCategoryIndex === categoryIndex && category.subCategories.length > 0 && (
                                                <div className="">
                                                    {category.subCategories.map((subCategory, subCategoryIndex) => (
                                                        <div key={subCategoryIndex}>
                                                            <button
                                                                className="flex border-t-[1px] border-[#D9D9D9] items-center justify-between w-full px-[10%] py-2 text-left text-black hover:text-white hover:bg-[#6f0f55] focus:outline-none"
                                                                onClick={() => handleClickSubCategory(subCategoryIndex)}
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
                                                        className="flex items-center justify-between w-full px-4 py-2 text-left text-purple-700 hover:bg-purple-50 focus:outline-none"
                                                        onClick={() =>
                                                            setOpenCategoryIndex(openCategoryIndex === categoryIndex ? null : categoryIndex)
                                                        }
                                                    >
                                                        <span>{category.name}</span>
                                                        {category.subCategories.length > 0 && (
                                                            <svg className={`w-4 h-4 transform ${openCategoryIndex === categoryIndex ? 'rotate-270' : 'rotate-0'}`} fill="none" stroke="#6f0f55" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Subcategory Dropdown */}
                                                {openCategoryIndex === categoryIndex && category.subCategories.length > 0 && (
                                                    <div className="pl-4 ml-4">
                                                        {category.subCategories.map((subCategory, subCategoryIndex) => (
                                                            <div key={subCategoryIndex}>
                                                                <button
                                                                    className="flex items-center justify-between w-full px-4 py-2 text-left text-purple-700 hover:bg-purple-50 focus:outline-none"
                                                                    onClick={() => handleClickSubCategory(subCategoryIndex)}
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

                    {/* Required Fields Note */}
                    <div className="mt-6 text-sm text-red-600">*All fields are required to fill</div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-end gap-4 mt-6">
                        <button type="button" onClick={handleBack}
                            className="px-6 py-2 text-purple-900 border border-purple-900 rounded-full hover:bg-purple-50 focus:outline-none">
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
