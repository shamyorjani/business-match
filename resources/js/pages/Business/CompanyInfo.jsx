import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../components/form/FormInput';
import PhoneInput from '../../components/form/PhoneInput';

// Create a wrapper component directly in this file
const CustomFormInput = (props) => {
    if (props.hideLabel) {
        const { hideLabel, label, ...restProps } = props;
        return <FormInput {...restProps} className="w-full" />;
    }
    return <FormInput {...props} className="w-full" />;
};

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
    navigate("/business/interest");
};

const handleBack = () => {
    navigate('/business/registration');
};

return (
<div className="form-container">
    {/* Header */}
    {/* <div className="header">
        <h1 className="header-title">Business Matching Registration and Form Submission</h1>
    </div> */}

    {/* Form Content */}
    <div className="form-white-container">
        {/* Step Indicator */}
        <div className="mb-8">
            <h2 className="step-indicator">STEP 2</h2>
            <div className="flex">
                <svg width="326" height="34" viewBox="0 0 400 40">
                    <polygon points="240,0 340,0 360,20 340,40 240,40 260,20" fill="#E5E7EB" />
                    <polygon points="120,0 220,0 240,20 220,40 120,40 140,20" fill="#6f0f55" />
                    <polygon points="0,0 100,0 120,20 100,40 0,40" fill="#40033f" />
                </svg>
            </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
            <div className="form-grid">
                {/* Left Column */}
                <div>
                    <div className="form-grid-2">
                        <div>
                            <FormInput
                                id="website"
                                name="website"
                                label="Company Website"
                                placeholder="E.g. www.xyz.com"
                                value={formData.website}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                            <PhoneInput
                                id="phoneNumber"
                                name="phoneNumber"
                                placeholder="E.g. 123456789"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                countryCode="+60"
                                country="Malaysia"
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block mb-2 form-label custom-label">Company Address</label>
                        <div className="flex flex-col w-full">
                            <div className="w-full">
                                <FormInput
                                    id="addressLine1"
                                    name="addressLine1"
                                    placeholder="Address Line 1"
                                    value={formData.addressLine1}
                                    onChange={handleChange}
                                    hideLabel={true}
                                    style={{maxWidth: '435px'}}
                                />
                            </div>
                            <div className="w-full mt-4">
                                <FormInput
                                    id="addressLine2"
                                    name="addressLine2"
                                    placeholder="Address Line 2"
                                    value={formData.addressLine2}
                                    onChange={handleChange}
                                    hideLabel={true}
                                    style={{maxWidth: '435px'}}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 form-grid-2 md:gap-x-[120px]">
                        <div>
                            <CustomFormInput
                                id="city"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                hideLabel={true}
                            />
                        </div>
                        <div>
                            <CustomFormInput
                                id="region"
                                name="region"
                                placeholder="Region"
                                value={formData.region}
                                onChange={handleChange}
                                hideLabel={true}
                            />
                        </div>
                        <div>
                            <CustomFormInput
                                id="postalCode"
                                name="postalCode"
                                placeholder="Postal/ Zip Code"
                                value={formData.postalCode}
                                onChange={handleChange}
                                hideLabel={true}
                            />
                        </div>

                        <div>
                            <div className="country-dropdown">
                                <button type="button"
                                    className="country-dropdown-button"
                                    onClick={()=> setShowCountryDropdown(!showCountryDropdown)}>
                                    <div className="flex items-center">
                                        <div className="country-flag-container">
                                            <div className="malaysia-flag">
                                                <div className="malaysia-flag-stripe"></div>
                                                <div className="malaysia-flag-emblem">
                                                    <div className="malaysia-flag-star"></div>
                                                </div>
                                            </div>
                                        </div>
                                        <span>{formData.country}</span>
                                    </div>
                                    <svg className="dropdown-arrow" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                            d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                {showCountryDropdown && (
                                <div className="country-dropdown-menu">
                                    <div className="py-1">
                                        <button type="button"
                                            className="country-dropdown-item"
                                            onClick={()=> {
                                                setFormData(prevState => ({
                                                    ...prevState,
                                                    country: 'Malaysia'
                                                }));
                                                setShowCountryDropdown(false);
                                            }}>
                                            <div className="country-flag-container">
                                                <div className="malaysia-flag">
                                                    <div className="malaysia-flag-stripe"></div>
                                                    <div className="malaysia-flag-emblem">
                                                        <div className="malaysia-flag-star"></div>
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
            </div>

            {/* Required Fields Note */}
            <div className="required-note">*All fields are required to fill</div>

            {/* Navigation Buttons */}
            <div className="form-actions">
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

export default CompanyInfo;
