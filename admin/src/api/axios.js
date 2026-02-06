// src/api/axios.js
const VITE_SERVER_URL = '/api';

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
    credentials: 'include', // ✅ Send cookies with request
  };

  try {
    const response = await fetch(`${VITE_SERVER_URL}${endpoint}`, config);
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
      // Token is set in cookie by server
    }

    return data;
  } catch (error) {
    console.error("❌ Login failed:", error);
    throw error;
  }
};

export const adminLogout = async () => {
  try {
    await apiCall('/admin/logout', { method: 'POST' });
  } catch (error) {
    console.error("Logout failed", error);
  }
  window.location.replace('/login');
};

export const checkAuth = async () => {
  try {
    const data = await apiCall('/admin/me', {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
    return data.status === 'success';
  } catch (error) {
    return false;
  }
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

export const getUnavailableBooks = async (page = 1, limit = 20) => {
  console.log(`🔍 Fetching unavailable books: page ${page}, limit ${limit}`);
  return await apiCall(`/search/unavailable-books?page=${page}&limit=${limit}`);
};

export const getBooksWithoutImage = async (page = 1, limit = 20) => {
  console.log(`🔍 Fetching books without image: page ${page}, limit ${limit}`);
  return await apiCall(`/search/without-image?page=${page}&limit=${limit}`);
};

export const getMostViewedBooks = async (page = 1, limit = 20) => {
  console.log(`🔍 Fetching most viewed books: page ${page}, limit ${limit}`);
  return await apiCall(`/search/most-viewed?page=${page}&limit=${limit}`);
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

export const toggleBookAvailability = async (bookId, currentStatus) => {
  console.log(`🔄 Toggling availability for ${bookId} to ${!currentStatus}`);
  return await apiCall(`/feature/change-visiblity/${bookId}`, {
    method: 'PATCH',
    body: { isAvailable: !currentStatus },
  });
};

export const DEPARTMENTS = [
  "CSE", "IT", "ECE", "EEE", "MECH", "CIVIL",
  "MBA", "MCA", "BBA", "BCA", "B.COM", "B.SC",
  "B.PHARM", "B.ARCH", "B.DES", "B.ED", "B.LLB",
  "B.PT", "B.HM", "B.MS", "B.AS", "B.FA", "B.FT", "AGRICULTURE"
];