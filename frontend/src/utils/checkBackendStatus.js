import axios from 'axios';

/**
 * Checks if the backend server is running
 * @param {string} url - The backend URL to check
 * @returns {Promise<boolean>} - True if the server is running, false otherwise
 */
export const checkBackendStatus = async (url) => {
  try {
    // Try to make a simple request to the backend
    await axios.get(`${url}/api/v1/health`, { timeout: 5000 });
    return true;
  } catch (error) {
    console.error('Backend server check failed:', error);
    return false;
  }
};

/**
 * Gets a user-friendly message about the backend status
 * @param {string} url - The backend URL to check
 * @returns {Promise<string>} - A message about the backend status
 */
export const getBackendStatusMessage = async (url) => {
  const isRunning = await checkBackendStatus(url);
  
  if (isRunning) {
    return `Backend server is running at ${url}`;
  } else {
    return `Backend server is not running at ${url}. Please start the server.`;
  }
};
