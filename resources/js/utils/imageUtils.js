/**
 * Get image URL for a company logo
 * @param {string} companyName - The name of the company
 * @return {string|null} - The image URL or null if not found
 */
export const getCompanyLogo = (companyName) => {
  if (!companyName) return null;

  try {
    // Create a URL-friendly version of the company name
    const formattedName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    // Check if the image exists (this is a simplification - actual implementation would depend on your setup)
    const imagePath = `/images/companies/${formattedName}.png`;

    // Return the image path
    return imagePath;
  } catch (error) {
    console.error('Error getting company logo:', error);
    return null;
  }
};

/**
 * Get image URL for a product
 * @param {string} companyName - The name of the company
 * @param {string} productName - The name of the product
 * @return {string|null} - The image URL or null if not found
 */
export const getProductImage = (companyName, productName) => {
  if (!companyName || !productName) return null;

  try {
    // Create URL-friendly versions of the names
    const formattedCompany = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const formattedProduct = productName.toLowerCase().replace(/[^a-z0-9]/g, '-');

    // Check if the image exists
    const imagePath = `/images/companies/${formattedCompany}/${formattedProduct}.png`;

    // Return the image path
    return imagePath;
  } catch (error) {
    console.error('Error getting product image:', error);
    return null;
  }
};
