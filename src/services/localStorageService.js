/**
 * General utility functions for interacting with localStorage safely.
 */

/**
 * Reads and parses an item from localStorage.
 * @param {string} key - The localStorage key.
 * @param {any} [defaultValue=null] - Default fallback value if key does not exist or parse fails.
 * @returns {any} The parsed value or defaultValue.
 */
export const getItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`[localStorageService] Error reading key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Serializes and stores an item in localStorage.
 * @param {string} key - The localStorage key.
 * @param {any} value - The value to store.
 */
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[localStorageService] Error setting key "${key}":`, error);
  }
};

/**
 * Removes an item from localStorage.
 * @param {string} key - The localStorage key.
 */
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`[localStorageService] Error removing key "${key}":`, error);
  }
};

/**
 * Clears all items from localStorage.
 */
export const clearStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error(`[localStorageService] Error clearing storage:`, error);
  }
};

/**
 * Factory helper to create a dedicated domain storage service for a specific key.
 * @param {string} key - LocalStorage key
 * @param {any} [defaultValue=[]] - Default value if key is not found
 */
export const createStorageService = (key, defaultValue = []) => {
  return {
    get: () => getItem(key, defaultValue),
    save: (data) => setItem(key, data),
    clear: () => removeItem(key),
    clearAll: clearStorage,
  };
};
