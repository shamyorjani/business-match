/**
 * Utility functions for managing exhibitor selections
 */

/**
 * Save exhibitor selections for specific subcategories
 * @param {string[]} exhibitors - Array of selected exhibitor names
 * @param {string[]} subcategories - Array of subcategory names
 */
export const saveExhibitorSelections = (exhibitors, subcategories) => {
  if (!exhibitors || !subcategories || exhibitors.length === 0 || subcategories.length === 0) {
    return;
  }

  try {
    // Create a key based on sorted subcategories
    const subcategoriesKey = [...subcategories].sort().join(',');

    // Get current selections map or initialize empty
    const allSelections = localStorage.getItem('exhibitorSelectionsByCategory') || '{}';
    const selectionsMap = JSON.parse(allSelections);

    // Update this subcategories key
    selectionsMap[subcategoriesKey] = exhibitors;

    // Save back to localStorage
    localStorage.setItem('exhibitorSelectionsByCategory', JSON.stringify(selectionsMap));

    // Also still save to the original key for backward compatibility
    localStorage.setItem('selectedExhibitors', JSON.stringify(exhibitors));
  } catch (error) {
    console.error('Error saving exhibitor selections:', error);
  }
};

/**
 * Load exhibitor selections for specific subcategories
 * @param {string[]} subcategories - Array of subcategory names
 * @return {string[]} - Array of selected exhibitor names
 */
export const loadExhibitorSelections = (subcategories) => {
  if (!subcategories || subcategories.length === 0) {
    return [];
  }

  try {
    // Create a key based on sorted subcategories
    const subcategoriesKey = [...subcategories].sort().join(',');

    // Get selections for these subcategories
    const allSelections = localStorage.getItem('exhibitorSelectionsByCategory');
    if (allSelections) {
      const selectionsMap = JSON.parse(allSelections);
      if (selectionsMap[subcategoriesKey]) {
        return selectionsMap[subcategoriesKey];
      }
    }

    return [];
  } catch (error) {
    console.error('Error loading exhibitor selections:', error);
    return [];
  }
};

/**
 * Clear exhibitor selections for specific subcategories only
 * @param {string[]} subcategories - Array of subcategory names
 */
export const clearSubcategorySelections = (subcategories) => {
  if (!subcategories || subcategories.length === 0) {
    return;
  }

  try {
    // Create a key based on sorted subcategories
    const subcategoriesKey = [...subcategories].sort().join(',');

    // Get current selections
    const allSelections = localStorage.getItem('exhibitorSelectionsByCategory');
    if (allSelections) {
      const selectionsMap = JSON.parse(allSelections);
      // Remove the specific key
      if (selectionsMap[subcategoriesKey]) {
        delete selectionsMap[subcategoriesKey];
        // Save the updated map
        localStorage.setItem('exhibitorSelectionsByCategory', JSON.stringify(selectionsMap));
      }
    }
  } catch (error) {
    console.error('Error clearing subcategory selections:', error);
  }
};

/**
 * Clear all exhibitor selections from local storage
 */
export const clearAllExhibitorSelections = () => {
  localStorage.removeItem('exhibitorSelectionsByCategory');
  localStorage.removeItem('selectedExhibitors');
};
