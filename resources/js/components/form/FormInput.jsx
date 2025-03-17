import React from 'react';

const FormInput = ({
    id,
    name,
    label,
    placeholder,
    value,
    onChange,
    type = 'text',
    hideLabel = false,
    error,
    required = false
}) => {
    return (
        <div className="mb-4 form-group">
            {/* Only render the label if hideLabel is false and label exists */}
            {!hideLabel && label && (
                <label htmlFor={id} className="block mb-2 form-label custom-label">
                    {label}{required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}
            <input
                type={type}
                id={id}
                name={name}
                placeholder={placeholder}
                className={`form-input w-full ${error ? 'border-red-500' : 'border-gray-300'}`}
                value={value}
                onChange={onChange}
                style={{
                    width: '100%',
                    height: '40px',
                    borderRadius: '13px',
                    borderWidth: '1px',
                    padding: '0 16px',
                    outline: 'none',
                    transition: 'border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out'
                }}
            />
            <style jsx>{`
                input::placeholder {
                    font-family: 'Instrument Sans', sans-serif;
                    font-weight: 400;
                    font-size: 15px;
                    color: #BDBDBD;
                }

                input:focus {
                    border-color: #40033f;
                    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
                }

                .custom-label {
                    font-family: 'Instrument Sans', sans-serif;
                    font-weight: 700;
                    font-size: 16px;
                    line-height: 1.2;
                    color: #333333;
                    margin-bottom: 8px;
                }

                .form-input {
                    font-family: 'Instrument Sans', sans-serif;
                    font-size: 15px;
                }
            `}</style>
            {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default FormInput;
