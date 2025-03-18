import React, { useState, useEffect } from 'react';
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
    companyPhone: '', // Changed from phoneNumber to companyPhone
    region: '',
    country: 'Malaysia'
});
const [showCountryDropdown, setShowCountryDropdown] = useState(false);
const [errors, setErrors] = useState({});

useEffect(() => {
    // Load data from previous step
    const savedData = JSON.parse(localStorage.getItem('businessRegistration') || '{}');
    const savedCompanyData = JSON.parse(localStorage.getItem('companyInfoData') || '{}');

    // Keep personal and company phone numbers separate
    const companyPhoneToUse = savedCompanyData.companyPhone || ''; // Only use company phone from company data

    // Set form data with company specific fields
    setFormData(prevState => ({
        ...prevState,
        website: savedCompanyData.website || savedData.website || '',
        addressLine1: savedCompanyData.addressLine1 || savedData.addressLine1 || '',
        addressLine2: savedCompanyData.addressLine2 || savedData.addressLine2 || '',
        city: savedCompanyData.city || savedData.city || '',
        postalCode: savedCompanyData.postalCode || savedData.postalCode || '',
        region: savedCompanyData.region || savedData.region || '',
        country: savedCompanyData.country || savedData.country || 'Malaysia',
        companyPhone: companyPhoneToUse // Use only company phone, not personal phone
    }));
}, []);

const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
        ...prevState,
        [name]: value
    }));
    // Clear error when field is edited
    if (errors[name]) {
        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: ''
        }));
    }
};

const validateForm = () => {
    const newErrors = {};

    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address Line 1 is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!formData.region.trim()) newErrors.region = 'Region is required';
    if (!formData.companyPhone.trim()) newErrors.companyPhone = 'Company phone number is required'; // Changed field name

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
        // Get existing data and merge with new data
        const existingData = JSON.parse(localStorage.getItem('businessRegistration') || '{}');

        // Create updated data that preserves the original phoneNumber
        const updatedData = {
            ...existingData,
            website: formData.website,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            city: formData.city,
            postalCode: formData.postalCode,
            region: formData.region,
            country: formData.country,
            companyPhone: formData.companyPhone // Store company phone separately
            // Note: We're NOT including phoneNumber here to avoid overwriting personal phone
        };

        // Save to localStorage - both to the main storage and a separate key for this page
        localStorage.setItem('businessRegistration', JSON.stringify(updatedData));
        localStorage.setItem('companyInfoData', JSON.stringify(formData));

        // Navigate to next page
        handleNext();
    } else {
        // Focus on first error field
        const firstErrorField = Object.keys(errors)[0];
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

const handleNext = () => {
    navigate("/business/interest");
};

const handleBack = () => {
    // Save current form data before navigating back
    localStorage.setItem('companyInfoData', JSON.stringify(formData));
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
                                error={errors.website}
                            />
                        </div>
                        <div>
                            <label htmlFor="companyPhone" className="form-label">Company Phone Number</label>
                            <PhoneInput
                                id="companyPhone"
                                name="companyPhone"
                                placeholder="E.g. 123456789"
                                value={formData.companyPhone}
                                onChange={handleChange}
                                countryCode="+60"
                                country="Malaysia"
                                error={errors.companyPhone}
                            />
                            {errors.companyPhone && <p className="mt-1 text-sm text-red-600">{errors.companyPhone}</p>}
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
                                    error={errors.addressLine1}
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
                                error={errors.city}
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
                                error={errors.region}
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
                                error={errors.postalCode}
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
                <button type="submit" className="primary-btn">
                    Next
                </button>
            </div>
        </form>
    </div>
</div>
);
};

export default CompanyInfo;
