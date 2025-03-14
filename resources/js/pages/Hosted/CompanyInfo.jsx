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
const [uploadedFiles, setUploadedFiles] = useState([]);

const handleChange = (e) => {
const { name, value } = e.target;
setFormData(prevState => ({
...prevState,
[name]: value
}));
};

const handleFileUpload = (e) => {
const files = Array.from(e.target.files);
// Validate files (optional)
const validFiles = files.filter(file => {
const fileType = file.type;
const fileSize = file.size / 1024; // size in KB
const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];

return validTypes.includes(fileType) && fileSize <= 2000; }); setUploadedFiles(prev=> [...prev, ...validFiles]);
    };

    const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic here
    console.log(formData);
    console.log(uploadedFiles);
    };



    const handleNext = () => {
    navigate("/hosted/thank-you");
    };



    const handleBack = () => {
    navigate('/hosted/registration');
    };

    return (
    <div className="form-container">
        {/* Form Content */}
        <div className="form-content">
            {/* Step Indicator */}
            <div className="step-container">
                <h2 className="step-indicator">STEP 2</h2>
                <div className="step-progress">
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
                        <div className="two-column-grid">
                            <div>
                                <label htmlFor="website" className="form-label">Company Website:</label>
                                <input type="text" id="website" name="website" placeholder="E.g. www.xyz.com"
                                    className="form-input" value={formData.website} onChange={handleChange} />
                            </div>
                            <div>
                                <label htmlFor="phoneNumber" className="form-label">Phone Number:</label>
                                <div className="phone-input-container">
                                    <div className="phone-prefix">
                                        <div className="flag-container">
                                            {/* Malaysia flag - simplified version */}
                                            <div className="malaysia-flag">
                                                <div className="flag-top"></div>
                                                <div className="flag-emblem"></div>
                                            </div>
                                        </div>
                                        <span className="country-code">+60</span>
                                    </div>
                                    <input type="tel" id="phoneNumber" name="phoneNumber"
                                        placeholder="E.g. 123456789"
                                        className="phone-input" value={formData.phoneNumber} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="address-section">
                            <label htmlFor="addressLine1" className="form-label">Company Address:</label>
                            <div className="address-inputs">
                                <input type="text" id="addressLine1" name="addressLine1" placeholder="Address Line 1"
                                    className="form-input" value={formData.addressLine1} onChange={handleChange} />
                                <input type="text" id="addressLine2" name="addressLine2" placeholder="Address Line 2"
                                    className="form-input" value={formData.addressLine2} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="two-column-grid address-details">
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
                                <div className="country-dropdown">
                                    <button type="button"
                                        className="country-selector"
                                        onClick={() => setShowCountryDropdown(!showCountryDropdown)}>
                                        <div className="country-flag-name">
                                            <div className="flag-container">
                                                {/* Malaysia flag - simplified version */}
                                                <div className="malaysia-flag">
                                                    <div className="flag-top"></div>
                                                    <div className="flag-emblem"></div>
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
                                            <div className="dropdown-content">
                                                <button type="button"
                                                    className="country-option"
                                                    onClick={() => {
                                                        setFormData(prevState => ({
                                                            ...prevState,
                                                            country: 'Malaysia'
                                                        }));
                                                        setShowCountryDropdown(false);
                                                    }}>
                                                    <div className="flag-container">
                                                        {/* Malaysia flag - simplified version */}
                                                        <div className="malaysia-flag">
                                                            <div className="flag-top"></div>
                                                            <div className="flag-emblem"></div>
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

                {/* Documents Submission Section */}
                <div className="documents-section">
                    <label className="documents-label">Documents Submission:</label>
                    <p className="documents-format-info">(in PDF, JPG, or PNG format, less than 2000kb per file)</p>

                    <ol className="documents-list">
                        <li>Softcopy of Business Card</li>
                        <li>Softcopy of Company / Business Registration Certificate</li>
                        <li>Softcopy of Passport</li>
                    </ol>

                    <div className="upload-container">
                        <button type="button"
                            className="upload-button"
                            onClick={() => document.getElementById('fileUpload').click()}>
                            <span>Click Here to Upload</span>
                            <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12"></path>
                            </svg>
                        </button>
                        <input id="fileUpload" type="file" multiple className="hidden"
                            onChange={handleFileUpload} />
                    </div>

                    {/* Display uploaded files */}
                    {uploadedFiles.length > 0 && (
                        <div className="uploaded-files">
                            <p className="uploaded-files-title">Uploaded Files:</p>
                            <ul className="file-list">
                                {uploadedFiles.map((file, index) => (
                                    <li key={index} className="file-item">
                                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Required Fields Note */}
                <div className="required-fields-note">*All fields are required to fill</div>

                {/* Navigation Buttons */}
                <div className="navigation-buttons">
                    <button type="button" onClick={handleBack}
                        className="back-button">
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
