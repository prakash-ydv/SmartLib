// src/api/axios.js

const API_BASE_URL = 'https://smartlib-xgxi.onrender.com';

const apiCall = async (endpoint, options = {}) => {
  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...(options.body && { body: JSON.stringify(options.body) }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============================================
// 🔐 AUTH APIs
// ============================================

export const adminLogin = async (email, password) => {
  const data = await apiCall('/admin/login', {
    method: 'POST',
    body: { email, password },
  });
  
  if (data.status === 'success') {
    localStorage.setItem('isAdminLoggedIn', 'true');
    localStorage.setItem('adminData', JSON.stringify(data.data));
  }
  
  return data;
};

export const adminLogout = () => {
  localStorage.removeItem('isAdminLoggedIn');
  localStorage.removeItem('adminData');
};

export const isAuthenticated = () => {
  return localStorage.getItem('isAdminLoggedIn') === 'true';
};

// ============================================
// 📚 BOOK APIs
// ============================================

export const addBook = async (bookData) => {
  return await apiCall('/add/one', {
    method: 'POST',
    body: bookData,
  });
};

export const updateBook = async (bookId, updateData) => {
  return await apiCall(`/update/book/${bookId}`, {
    method: 'PATCH',
    body: updateData,
  });
};

export const getBooksByViews = async (page = 1, limit = 10) => {
  return await apiCall(`/search/search-by-views?page=${page}&limit=${limit}`);
};


export const incrementBookViews = async (bookId) => {
  return await apiCall(`/update/book/views/${bookId}`, {
    method: 'PATCH',
  });
};

export const searchBookByTitle = async (title) => {
  return await apiCall(`/search/book?title=${encodeURIComponent(title)}`);
};
// Replace getAllBooks() function
export const getAllBooks = async (limit = 1000) => {
  return await apiCall(`/search/search-by-views?page=1&limit=${limit}`);
};

// ============================================
// 📋 CONSTANTS
// ============================================

export const DEPARTMENTS = [
  "CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", 
  "MBA", "MCA", "BBA", "BCA", "B.COM", "B.SC", 
  "B.PHARM", "B.ARCH", "B.DES", "B.ED", "B.LLB", 
  "B.PT", "B.HM", "B.MS", "B.AS", "B.FA", "B.FT"
];