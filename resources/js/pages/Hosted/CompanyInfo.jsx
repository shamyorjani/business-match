import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
    companyPhone: '',
    region: '',
    country: 'Malaysia'
});
const [documents, setDocuments] = useState([]);
const [showCountryDropdown, setShowCountryDropdown] = useState(false);
const [errors, setErrors] = useState({});
const [isLoading, setIsLoading] = useState(false);
const [countries, setCountries] = useState([]);
const [searchTerm, setSearchTerm] = useState('');

useEffect(() => {
    // Load data from previous step
    const savedData = JSON.parse(localStorage.getItem('hostedRegistration') || '{}');
    const savedCompanyData = JSON.parse(localStorage.getItem('hostedCompanyData') || '{}');

    // Keep personal and company phone numbers separate
    const companyPhoneToUse = savedCompanyData.companyPhone || '';

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
        companyPhone: companyPhoneToUse
    }));

    // Fetch countries data
    fetch('https://restcountries.com/v3.1/all')
        .then(response => response.json())
        .then(data => {
            // Sort countries by name
            const sortedCountries = data.sort((a, b) =>
                a.name.common.localeCompare(b.name.common)
            );
            setCountries(sortedCountries);
        })
        .catch(error => {
            console.error('Error fetching countries:', error);
            // Fallback to a simple array with Malaysia
            setCountries([{
                name: { common: 'Malaysia' },
                flags: { png: 'https://flagcdn.com/w320/my.png' },
                cca2: 'MY'
            }]);
        });
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

const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setDocuments(files);

    // Clear error when files are uploaded
    if (errors.documents) {
        setErrors(prevErrors => ({
            ...prevErrors,
            documents: ''
        }));
    }
};

const handleCountrySearch = (e) => {
    setSearchTerm(e.target.value);
};

// Filter countries based on search term
const filteredCountries = searchTerm
    ? countries.filter(country =>
        country.name.common.toLowerCase().includes(searchTerm.toLowerCase()))
    : countries;

const validateForm = () => {
    const newErrors = {};

    if (!formData.addressLine1.trim()) newErrors.addressLine1 = 'Address Line 1 is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!formData.region.trim()) newErrors.region = 'Region is required';
    if (!formData.companyPhone.trim()) newErrors.companyPhone = 'Company phone number is required';
    if (documents.length === 0) newErrors.documents = 'Please upload required documents';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};

const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
        setIsLoading(true);

        try {
            // Get registration data from localStorage
            const registrationData = JSON.parse(localStorage.getItem('hostedRegistration') || '{}');

            // Create form data for file uploads
            const formDataToSend = new FormData();

            // Add registration data
            formDataToSend.append('registration', JSON.stringify({
                ...registrationData,
                registration_type: 'hosted'
            }));

            // Add company info data
            formDataToSend.append('companyInfo', JSON.stringify(formData));

            // Add files
            documents.forEach((file, index) => {
                formDataToSend.append(`documents[${index}]`, file);
            });

            // Save to localStorage before submitting
            localStorage.setItem('hostedCompanyData', JSON.stringify(formData));

            // Submit to API
            const response = await axios.post('/api/hosted-registration', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                // Clear form data from localStorage after successful submission
                localStorage.removeItem('hostedRegistration');
                localStorage.removeItem('hostedCompanyData');

                // Navigate to thank you page
                navigate('/hosted/thank-you');
            } else {
                throw new Error(response.data.message || 'Failed to submit registration');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('An error occurred during submission. Please try again.');
        } finally {
            setIsLoading(false);
        }
    } else {
        // Focus on first error field
        const firstErrorField = Object.keys(errors)[0];
        const errorElement = document.getElementById(firstErrorField);
        if (errorElement) errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

const handleBack = () => {
    // Save current form data before navigating back
    localStorage.setItem('hostedCompanyData', JSON.stringify(formData));
    navigate('/hosted/registration');
};

return (
<div className="form-container">
    {/* Header */}
    <div className="header">
        <h1 className="header-title">Hosted Buyer Program and Form Submission</h1>
    </div>

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
                                        {formData.country && countries.length > 0 && (
                                            <div className="mr-2 country-flag-container">
                                                {countries.find(c => c.name.common === formData.country) ? (
                                                    <img
                                                        src={countries.find(c => c.name.common === formData.country)?.flags.png}
                                                        alt={`${formData.country} flag`}
                                                        className="object-cover w-6 h-4"
                                                    />
                                                ) : (
                                                    <div className="w-6 h-4 bg-gray-200"></div>
                                                )}
                                            </div>
                                        )}
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
                                    <div className="px-3 py-2">
                                        <input
                                            type="text"
                                            placeholder="Search country..."
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                            value={searchTerm}
                                            onChange={handleCountrySearch}
                                        />
                                    </div>
                                    <div className="py-1 overflow-y-auto max-h-60">
                                        {filteredCountries.length > 0 ? (
                                            filteredCountries.map((country) => (
                                                <button
                                                    key={country.cca2}
                                                    type="button"
                                                    className="country-dropdown-item"
                                                    onClick={() => {
                                                        setFormData(prevState => ({
                                                            ...prevState,
                                                            country: country.name.common
                                                        }));
                                                        setShowCountryDropdown(false);
                                                        setSearchTerm('');
                                                    }}
                                                >
                                                    <div className="mr-2 country-flag-container">
                                                        <img
                                                            src={country.flags.png}
                                                            alt={`${country.name.common} flag`}
                                                            className="object-cover w-6 h-4"
                                                        />
                                                    </div>
                                                    <span>{country.name.common}</span>
                                                </button>
                                            ))
                                        ) : (
                                            <div className="px-4 py-2 text-sm text-gray-500">No countries found</div>
                                        )}
                                    </div>
                                </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6">
                        <label className="block mb-1 text-sm font-medium text-gray-700">Documents Submission:</label>
                        <p className="mb-2 text-xs text-gray-500">(in PDF, JPG, or PNG format, less than 2000kb per file)</p>

                        <ol className="pl-5 mb-4 text-sm list-decimal">
                            <li>Softcopy of Business Card</li>
                            <li>Softcopy of Company / Business Registration Certificate</li>
                            <li>Softcopy of Passport</li>
                        </ol>

                        <div className="mt-2">
                            <button
                                type="button"
                                className="flex items-center px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none"
                                onClick={() => document.getElementById('fileUpload').click()}
                            >
                                <span>Click Here to Upload</span>
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"></path>
                                </svg>
                            </button>
                            <input
                                id="fileUpload"
                                type="file"
                                multiple
                                className="hidden"
                                onChange={handleFileUpload}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            {documents.length > 0 && (
                                <div className="mt-2">
                                    <p className="text-sm text-gray-700">Selected files ({documents.length}):</p>
                                    <ul className="pl-5 mt-1 text-xs text-gray-600 list-disc">
                                        {documents.map((file, index) => (
                                            <li key={index}>{file.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {errors.documents && <p className="mt-1 text-sm text-red-600">{errors.documents}</p>}
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
                <button type="submit" className="primary-btn" disabled={isLoading}>
                    {isLoading ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </form>
    </div>
</div>
);
};

export default CompanyInfo;
