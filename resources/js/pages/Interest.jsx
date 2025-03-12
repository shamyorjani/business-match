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
        console.log('Next button clicked');
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
                    name: 'Lip Makeup',
                    items: ['Lipstick', 'Lip Gloss', 'Lip Liner']
                }
            ]
        },
        {
            name: 'Cosmetics',
            subCategories: [
                {
                    name: 'Face Makeup',
                    items: ['Foundations', 'Concealers', 'Blush', 'Highlighters', 'Powders']
                },
                {
                    name: 'Eye Makeup',
                    items: ['Eyeshadows', 'Eyeliner', 'Mascara']
                },
                {
                    name: 'Lip Makeup',
                    items: ['Lipstick', 'Lip Gloss', 'Lip Liner']
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
                            <polygon points="240,0 340,0 360,20 340,40 240,40 260,20" fill="#E5E7EB" />
                            <polygon points="120,0 220,0 240,20 220,40 120,40 140,20" fill="#581C87" />
                            <polygon points="0,0 100,0 120,20 100,40 0,40" fill="#581C87" />
                        </svg>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold">Kindly select your interest for business matching :</h3>
                            <p className="text-sm text-gray-600">You may select more than one interest.</p>
                        </div>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Type Here to Search"
                            className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                            value={searchTerm}
                            onChange={handleSearchChange} // Update search term
                        />

                        {/* Main Dropdown */}
                        <div className="relative left-0 w-full mt-2 bg-white ">
                            <div className="max-h-60 border w-[500px] border-gray-300 rounded-md shadow-lg">
                                {searchTerm === '' ? (
                                    // Show all categories if search term is empty
                                    categories.map((category, categoryIndex) => (
                                        <div key={categoryIndex} className="relative">
                                            <div className="w-full">
                                                <button
                                                    className="w-full px-4 py-2 text-left text-purple-700 hover:bg-purple-50 focus:outline-none flex justify-between items-center"
                                                    onClick={() =>
                                                        setOpenCategoryIndex(openCategoryIndex === categoryIndex ? null : categoryIndex)
                                                    }
                                                >
                                                    <span>{category.name}</span>
                                                    {category.subCategories.length > 0 && (
                                                        <svg className="w-4 h-4 transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>

                                            {/* Subcategory Dropdown */}
                                            {openCategoryIndex === categoryIndex && category.subCategories.length > 0 && (
                                                <div className="ml-4 pl-4">
                                                    {category.subCategories.map((subCategory, subCategoryIndex) => (
                                                        <div key={subCategoryIndex}>
                                                            <button
                                                                className="w-full px-4 py-2 text-left text-purple-700 hover:bg-purple-50 focus:outline-none flex justify-between items-center"
                                                                onClick={() => handleClickSubCategory(subCategoryIndex)}
                                                            >
                                                                <span>{subCategory.name}</span>
                                                                {subCategory.items.length > 0 && (
                                                                    <svg className="w-4 h-4 transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                                    </svg>
                                                                )}
                                                            </button>

                                                            {/* Item Dropdown under the subcategory */}
                                                            {openSubCategoryIndex === subCategoryIndex && (
                                                                <div className="ml-8 pl-4 mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-64  absolute z-10 right-[-220px] bottom-[-60px]">
                                                                    {subCategory.items.map((item, itemIndex) => (
                                                                        <div
                                                                            key={itemIndex}
                                                                            className="px-4 py-2 text-sm text-gray-600 hover:bg-purple-50 cursor-pointer"
                                                                        >
                                                                            {item}
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
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
                                                        className="w-full px-4 py-2 text-left text-purple-700 hover:bg-purple-50 focus:outline-none flex justify-between items-center"
                                                        onClick={() =>
                                                            setOpenCategoryIndex(openCategoryIndex === categoryIndex ? null : categoryIndex)
                                                        }
                                                    >
                                                        <span>{category.name}</span>
                                                        {category.subCategories.length > 0 && (
                                                            <svg className="w-4 h-4 transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Subcategory Dropdown */}
                                                {openCategoryIndex === categoryIndex && category.subCategories.length > 0 && (
                                                    <div className="ml-4 pl-4">
                                                        {category.subCategories.map((subCategory, subCategoryIndex) => (
                                                            <div key={subCategoryIndex}>
                                                                <button
                                                                    className="w-full px-4 py-2 text-left text-purple-700 hover:bg-purple-50 focus:outline-none flex justify-between items-center"
                                                                    onClick={() => handleClickSubCategory(subCategoryIndex)}
                                                                >
                                                                    <span>{subCategory.name}</span>
                                                                    {subCategory.items.length > 0 && (
                                                                        <svg className="w-4 h-4 transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                                        </svg>
                                                                    )}
                                                                </button>

                                                                {/* Item Dropdown under the subcategory */}
                                                                {openSubCategoryIndex === subCategoryIndex && (
                                                                    <div className="ml-8 pl-4 mt-2 bg-white border border-gray-300 rounded-md shadow-lg w-64">
                                                                        {subCategory.items.map((item, itemIndex) => (
                                                                            <div
                                                                                key={itemIndex}
                                                                                className="px-4 py-1 text-sm text-gray-600 hover:bg-purple-50 cursor-pointer"
                                                                            >
                                                                                {item}
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                )}
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
                    <div className="mt-6 text-red-600 text-sm">*All fields are required to fill</div>

                    {/* Navigation Buttons */}
                    <div className="mt-6 flex justify-end gap-4">
                        <button type="button" onClick={handleBack}
                            className="px-6 py-2 border border-purple-900 text-purple-900 rounded-full hover:bg-purple-50 focus:outline-none">
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
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/shamyorjani/business-match.git
git push -u origin main
