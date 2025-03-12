import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const CompanyInfo = () => {
const navigate = useNavigate();
const [formData, setFormData] = useState({
website: '',
addressLine1: '',
addressLine2: '',
city: '',
postalCode: '',
phoneNumber: '',
region: '',
country: 'Malaysia'
});
const [showCountryDropdown, setShowCountryDropdown] = useState(false);

const handleChange = (e) => {
const { name, value } = e.target;
setFormData(prevState => ({
...prevState,
[name]: value
}));
};

const handleSubmit = (e) => {
e.preventDefault();
// Form submission logic here
console.log(formData);
};



const handleNext = () => {
    navigate("/interest");
};



const handleBack = () => {
navigate('/');
};

return (
<div className="form-container">
    {/* Header */}
    {/* <div className="header">
        <h1 className="header-title">Business Matching Registration and Form Submission</h1>
    </div> */}

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
                {/* Left Column */}
                <div>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
                        <div>
                            <label htmlFor="website" className="form-label">Company Website:</label>
                            <input type="text" id="website" name="website" placeholder="E.g. www.xyz.com"
                                className="form-input" value={formData.website} onChange={handleChange} />
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="form-label">Phone Number:</label>
                            <div className="flex">
                                <div className="flex items-center bg-gray-50 border border-gray-200 rounded-l px-2">
                                    <div className="w-6 h-4 mr-1 flex items-center justify-center overflow-hidden">
                                        {/* Malaysia flag - simplified version */}
                                        <div className="w-full h-full relative bg-blue-600 flex flex-col">
                                            <div className="w-full h-1/2 bg-red-600"></div>
                                            <div
                                                className="absolute top-0 left-0 w-1/3 h-full bg-blue-900 flex items-center justify-center">
                                                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-sm">+60</span>
                                </div>
                                <input type="tel" id="phoneNumber" name="phoneNumber" placeholder="E.g. 123456789"
                                    className="flex-1 border border-gray-200 rounded-r p-2 focus:outline-none focus:border-purple-500"
                                    value={formData.phoneNumber} onChange={handleChange} />
                            </div>
                        </div>
                    </div>


                    <div className="mt-6">
                        <label htmlFor="addressLine1" className="form-label">Company Address:</label>
                        <div className="space-y-3">
                            <input type="text" id="addressLine1" name="addressLine1" placeholder="Address Line 1"
                                className="form-input" value={formData.addressLine1} onChange={handleChange} />
                            <input type="text" id="addressLine2" name="addressLine2" placeholder="Address Line 2"
                                className="form-input" value={formData.addressLine2} onChange={handleChange} />


                        </div>
                    </div>


                    <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-6'>
                        <div>
                            <input type="text" id="city" name="city" placeholder="City"
                                className="form-input" value={formData.city} onChange={handleChange} />
                        </div>
                        <div>

<input type="text" id="region" name="region" placeholder="Region"
    className="form-input" value={formData.region} onChange={handleChange} />
</div>
                        <div>

                            <input type="text" id="postalCode" name="postalCode" placeholder="Postal/ Zip Code"
                                className="form-input" value={formData.postalCode} onChange={handleChange} />

                        </div>



                        <div>
                            {/* <label htmlFor="country" className="form-label">Country:</label> */}
                            <div className="relative">
                                <button type="button"
                                    className="flex items-center justify-between w-full px-3 py-2 border border-gray-200 rounded bg-white focus:outline-none focus:border-purple-500"
                                    onClick={()=> setShowCountryDropdown(!showCountryDropdown)}
                                    >
                                    <div className="flex items-center">
                                        <div className="w-6 h-4 mr-2 flex items-center justify-center overflow-hidden">
                                            {/* Malaysia flag - simplified version */}
                                            <div className="w-full h-full relative bg-blue-600 flex flex-col">
                                                <div className="w-full h-1/2 bg-red-600"></div>
                                                <div
                                                    className="absolute top-0 left-0 w-1/3 h-full bg-blue-900 flex items-center justify-center">
                                                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <span>{formData.country}</span>
                                    </div>
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                {showCountryDropdown && (
                                <div
                                    className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg">
                                    <div className="py-1">
                                        <button type="button"
                                            className="flex items-center w-full px-3 py-2 hover:bg-gray-100"
                                            onClick={()=>
                                            {
                                            setFormData(prevState => ({
                                            ...prevState,
                                            country: 'Malaysia'
                                            }));
                                            setShowCountryDropdown(false);
                                            }}
                                            >
                                            <div
                                                className="w-6 h-4 mr-2 flex items-center justify-center overflow-hidden">
                                                {/* Malaysia flag - simplified version */}
                                                <div className="w-full h-full relative bg-blue-600 flex flex-col">
                                                    <div className="w-full h-1/2 bg-red-600"></div>
                                                    <div
                                                        className="absolute top-0 left-0 w-1/3 h-full bg-blue-900 flex items-center justify-center">
                                                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <span>Malaysia</span>
                                        </button>
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>





                    </div>





                </div>

                {/* Right Column */}
                <div>



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
