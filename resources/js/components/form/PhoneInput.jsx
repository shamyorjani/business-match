import React, { useState, useEffect } from 'react';

const PhoneInput = ({
  label,
  id,
  name,
  placeholder,
  value,
  onChange,
  error,
  countryCode = '+60',
  required = false
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch real country data from a public API
    fetch('https://restcountries.com/v3.1/all?fields=name,flags,idd')
      .then(response => response.json())
      .then(data => {
        // Process and filter countries with phone codes
        const processedCountries = data
          .filter(country => country.idd && country.idd.root && country.idd.suffixes)
          .map(country => {
            const suffix = country.idd.suffixes[0] || '';
            return {
              code: `${country.idd.root}${suffix}`,
              flag: country.flags.svg,
              name: country.name.common,
              flagEmoji: getFlagEmoji(country.name.common)
            };
          })
          .sort((a, b) => a.name.localeCompare(b.name));

        setCountries(processedCountries);

        // Find the selected country based on provided country code
        const foundCountry = processedCountries.find(country => country.code === countryCode);
        setSelectedCountry(foundCountry || (processedCountries.length > 0 ? processedCountries[0] : null));
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching country data:', error);
        setIsLoading(false);
      });
  }, [countryCode]);

  // Convert country name to flag emoji
  function getFlagEmoji(countryName) {
    const countryToEmojiMap = {
      'Malaysia': '🇲🇾',
      'Singapore': '🇸🇬',
      'Indonesia': '🇮🇩',
      'Thailand': '🇹🇭',
      'Philippines': '🇵🇭',
      'Vietnam': '🇻🇳',
      'Myanmar': '🇲🇲',
      'Brunei': '🇧🇳',
      'Cambodia': '🇰🇭',
      'Laos': '🇱🇦',
      // Fallback for common countries
      'United States': '🇺🇸',
      'United Kingdom': '🇬🇧',
      'China': '🇨🇳',
      'Japan': '🇯🇵',
      'India': '🇮🇳',
      'Australia': '🇦🇺',
      'Canada': '🇨🇦',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Italy': '🇮🇹'
    };

    // Return the emoji if found, otherwise return a generic world emoji
    return countryToEmojiMap[countryName] || '🌐';
  }

  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setIsDropdownOpen(false);
  };

  // Handle input change to only allow numeric input
  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    // Only allow digits, no text
    if (/^\d*$/.test(inputValue)) {
      onChange(e);
    }
  };

  return (
    <div className="mb-4 form-group">
      <label htmlFor={id} className="block mb-2 form-label custom-label">
        {label}{required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="flex">
        <div className="relative">
          <button
            type="button"
            className="flex items-center h-10 px-3 border border-gray-300 rounded-l-2xl bg-gray-50"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <span className="ml-1 text-sm">Loading...</span>
              </div>
            ) : selectedCountry && (
              <>
                <div className="flex items-center justify-center w-5 h-3 mr-1 overflow-hidden">
                  <span className="text-xs">{selectedCountry.flagEmoji}</span>
                </div>
                <span className="text-sm font-medium">{selectedCountry.code}</span>
              </>
            )}
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {isDropdownOpen && !isLoading && (
            <div className="absolute left-0 z-10 w-56 mt-1 overflow-y-auto bg-white border border-gray-300 rounded-md shadow-lg max-h-60">
              {countries.map((country) => (
                <div
                  key={country.code}
                  className="flex items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleCountryChange(country)}
                >
                  <div className="flex items-center justify-center w-5 h-3 mr-2 overflow-hidden">
                    <span className="text-xs">{country.flagEmoji}</span>
                  </div>
                  <span className="text-sm truncate">{country.name}</span>
                  <span className="ml-auto text-xs text-gray-500">{country.code}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          type="tel"
          id={id}
          name={name}
          placeholder={placeholder}
          className={`form-input w-full rounded-r ${error ? 'border-red-500' : 'border-gray-300'}`}
          value={value}
          onChange={handleInputChange}
          pattern="[0-9]*"
          inputMode="numeric"
          style={{
            height: '40px',
            borderRadius: '0 13px 13px 0',
            borderWidth: '1px',
            padding: '0 16px',
            outline: 'none',
            transition: 'border-color 0.2s ease-in-out'
          }}
          onKeyPress={(e) => {
            // Prevent non-numeric characters from being entered
            if (!/[0-9]/.test(e.key)) {
              e.preventDefault();
            }
          }}
        />
      </div>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
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
        }

        .form-input {
          font-family: 'Instrument Sans', sans-serif;
          font-size: 15px;
        }
      `}</style>
    </div>
  );
};

export default PhoneInput;
