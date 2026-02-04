// src/api/axios.js

const API_BASE_URL = 'http://localhost:5000';

// ------------------------------------------------------------------
// 🌐 MAIN API CALL FUNCTION
// ------------------------------------------------------------------
const apiCall = async (endpoint, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    method: options.method || 'GET',
    headers: headers,
    ...(options.body && { body: JSON.stringify(options.body) }),
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        console.error("❌ Unauthorized! Token missing or expired.");
      }
      throw new Error(data.message || data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ------------------------------------------------------------------
// 🔑 AUTHENTICATION FUNCTIONS
// ------------------------------------------------------------------

export const adminLogin = async (email, password) => {
  console.log("🔑 Logging in...");

  try {
    const data = await apiCall('/admin/login', {
      method: 'POST',
      body: { email, password },
    });

    if (data.status === 'success') {
      console.log("✅ Login Success!");

      // Backend cookie me token bhejta hai
      // Browser automatically handle karega

      localStorage.setItem('isAdminLoggedIn', 'true');
      localStorage.setItem('adminData', JSON.stringify(data.data || data));
    }

    return data;
  } catch (error) {
    console.error("❌ Login failed:", error);
    throw error;
  }
};

export const adminLogout = () => {
  // Sab kuch saaf karo
  localStorage.removeItem('isAdminLoggedIn');
  localStorage.removeItem('adminData');

  window.location.reload(); // Page refresh to reset state
};

export const isAuthenticated = () => {
  return localStorage.getItem('isAdminLoggedIn') === 'true';
};

// ------------------------------------------------------------------
// 📚 BOOK FUNCTIONS
// ------------------------------------------------------------------

export const addBook = async (bookData) => {
  console.log("📚 Adding book...");
  return await apiCall('/add/one', {
    method: 'POST',
    body: bookData,
  });
};

export const updateBook = async (bookId, updateData) => {
  console.log("✏️ Updating book...");

  return await apiCall(`/update/book/${bookId}`, {
    method: 'PATCH',
    body: updateData,
  });
};

export const searchBookByTitle = async (title) => {
  return await apiCall(`/search/book?title=${encodeURIComponent(title)}`);
};

/**
 * 📚 Get ALL books
 * ✅ WORKAROUND: Multiple searches to get max data
 */
export const getAllBooks = async (page = 1, limit = 20) => {
  console.log(`🔍 Fetching books: page ${page}, limit ${limit}`);

  return await apiCall(`/search/all-books?page=${page}&limit=${limit}`);
};

export const incrementBookViews = async (bookId) => {
  return await apiCall(`/update/book/views/${bookId}`, {
    method: 'PATCH',
  });
};

export const deleteBook = async (bookId) => {
  console.log(`🗑️ API: Deleting book ${bookId}...`);
  return await apiCall(`/delete/${bookId}`, {
    method: 'DELETE'
  });
};

export const getDashboardStats = async () => {
  return await apiCall('/dashboard/stats');
};

export const toggleBookAvailability = async (bookId) => {
  console.warn('⚠️ Toggle API not implemented');
  return Promise.resolve({
    status: 'success',
    message: 'Toggled (frontend only)'
  });
};

export const DEPARTMENTS = [
  "CSE", "IT", "ECE", "EEE", "MECH", "CIVIL",
  "MBA", "MCA", "BBA", "BCA", "B.COM", "B.SC",
  "B.PHARM", "B.ARCH", "B.DES", "B.ED", "B.LLB",
  "B.PT", "B.HM", "B.MS", "B.AS", "B.FA", "B.FT"
];