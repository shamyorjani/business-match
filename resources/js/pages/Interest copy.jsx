import React, { useState } from 'react';

const DropdownMenu = () => {
    const [openCategoryIndex, setOpenCategoryIndex] = useState(null); // Track which category is expanded
    const [openSubCategoryIndex, setOpenSubCategoryIndex] = useState(null); // Track which subcategory is expanded
    const [searchTerm, setSearchTerm] = useState(''); // Track the search term
    const [hoveredSubCategory, setHoveredSubCategory] = useState(null); // Track hovered subcategory to show items dropdown

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

    const handleHoverSubCategory = (subCategoryIndex) => {
        setHoveredSubCategory(subCategoryIndex); // Show items dropdown when hovering over a subcategory
    };

    const handleLeaveSubCategory = () => {
        setHoveredSubCategory(null); // Hide the items dropdown when mouse leaves
    };

    return (
        <div className="w-full max-w-screen-lg mx-auto">
            <div className="relative">
                {/* Search Input */}
                <input
                    type="text"
                    placeholder="Type Here to Search"
                    className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={searchTerm}
                    onChange={handleSearchChange} // Update search term
                />

                {/* Main Dropdown */}
                <div className="absolute left-0 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg">
                    <div className="max-h-60 overflow-y-auto">
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
                                            {openCategoryIndex === categoryIndex ? (
                                                <svg className="w-4 h-4 transform rotate-270" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            ) : (
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
                                                <div
                                                    key={subCategoryIndex}
                                                    onMouseEnter={() => handleHoverSubCategory(subCategoryIndex)}
                                                    onMouseLeave={handleLeaveSubCategory}
                                                >
                                                    <button
                                                        className="w-full px-4 py-2 text-left text-purple-700 hover:bg-purple-50 focus:outline-none flex justify-between items-center"
                                                        onClick={() =>
                                                            setOpenSubCategoryIndex(
                                                                openSubCategoryIndex === subCategoryIndex ? null : subCategoryIndex
                                                            )
                                                        }
                                                    >
                                                        <span>{subCategory.name}</span>
                                                    </button>

                                                    {/* Item Dropdown to the Right Side */}
                                                    {hoveredSubCategory === subCategoryIndex && (
                                                        <div className="absolute right-0 top-0 mt-0 ml-4 bg-white border border-gray-300 rounded-md shadow-lg w-64">
                                                            {subCategory.items.map((item, itemIndex) => (
                                                                <div key={itemIndex} className="px-4 py-1 text-sm text-gray-600 hover:bg-purple-50 cursor-pointer">
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
                                                {openCategoryIndex === categoryIndex ? (
                                                    <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                ) : (
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
                                                    <div
                                                        key={subCategoryIndex}
                                                        onMouseEnter={() => handleHoverSubCategory(subCategoryIndex)}
                                                        onMouseLeave={handleLeaveSubCategory}
                                                    >
                                                        <button
                                                            className="w-full px-4 py-2 text-left text-purple-700 hover:bg-purple-50 focus:outline-none flex justify-between items-center"
                                                            onClick={() =>
                                                                setOpenSubCategoryIndex(
                                                                    openSubCategoryIndex === subCategoryIndex ? null : subCategoryIndex
                                                                )
                                                            }
                                                        >
                                                            <span>{subCategory.name}</span>
                                                            {openSubCategoryIndex === subCategoryIndex ? (
                                                                <svg className="w-4 h-4 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            ) : (
                                                                <svg className="w-4 h-4 transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                                </svg>
                                                            )}
                                                        </button>

                                                        {/* Item Dropdown to the Right Side */}
                                                        {hoveredSubCategory === subCategoryIndex && (
                                                            <div className="absolute right-0 top-0 mt-0 ml-4 bg-white border border-gray-300 rounded-md shadow-lg w-64">
                                                                {subCategory.items.map((item, itemIndex) => (
                                                                    <div key={itemIndex} className="px-4 py-1 text-sm text-gray-600 hover:bg-purple-50 cursor-pointer">
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
        </div>
    );
};

export default DropdownMenu;
