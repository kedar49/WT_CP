/**
 * API Service for Sudoku App
 * Provides functions to interact with the PHP backend
 */

// API base URL - update this to match your backend location
const API_BASE_URL = 'http://localhost/sudoku/api';

/**
 * Fetch all puzzles from the backend
 * @param {string} difficulty - Optional filter by difficulty level
 * @returns {Promise<Array>} Array of puzzle objects
 */
export const listPuzzles = async (difficulty = null) => {
  try {
    const url = difficulty 
      ? `${API_BASE_URL}/read.php?difficulty=${encodeURIComponent(difficulty)}` 
      : `${API_BASE_URL}/read.php`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching puzzles:', error);
    throw error;
  }
};

/**
 * Create a new puzzle
 * @param {Object} puzzleData - Object containing puzzle data
 * @param {string} puzzleData.puzzle_data - JSON string of puzzle board data
 * @param {string} puzzleData.solution_data - JSON string of puzzle solution data
 * @param {string} puzzleData.difficulty - Difficulty level of the puzzle
 * @returns {Promise<Object>} Response from the server
 */
export const createPuzzle = async (puzzleData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/create.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(puzzleData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating puzzle:', error);
    throw error;
  }
};

/**
 * Update an existing puzzle
 * @param {Object} puzzleData - Object containing puzzle data
 * @param {number} puzzleData.id - ID of the puzzle to update
 * @param {string} [puzzleData.puzzle_data] - JSON string of puzzle board data
 * @param {string} [puzzleData.difficulty] - Difficulty level of the puzzle
 * @returns {Promise<Object>} Response from the server
 */
export const updatePuzzle = async (puzzleData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/update.php`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(puzzleData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error updating puzzle:', error);
    throw error;
  }
};

/**
 * Delete a puzzle by ID
 * @param {number} id - ID of the puzzle to delete
 * @returns {Promise<Object>} Response from the server
 */
export const deletePuzzle = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/delete.php?id=${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error deleting puzzle:', error);
    throw error;
  }
};

/**
 * User login
 * @param {Object} credentials - User login credentials
 * @param {string} credentials.username - Username or email
 * @param {string} credentials.password - User password
 * @returns {Promise<Object>} User data and auth token
 */
export const login = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/login.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @param {string} userData.username - Username
 * @param {string} userData.email - Email address
 * @param {string} userData.password - Password
 * @returns {Promise<Object>} Registration result
 */
export const register = async (userData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/register.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

/**
 * Get user progress
 * @param {number} userId - User ID
 * @returns {Promise<Array>} User progress data
 */
export const getUserProgress = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/progress.php?user_id=${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user progress:', error);
    throw error;
  }
}; 