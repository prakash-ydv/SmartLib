const configuredServerUrl = import.meta.env.VITE_SERVER_URL?.trim();
const VITE_SERVER_URL = configuredServerUrl || '/api';
const VERIFY_AUTH_ENDPOINT = import.meta.env.VITE_VERIFY_AUTH_ENDPOINT === 'true';

const getAuthToken = () =>
  localStorage.getItem('token') || localStorage.getItem('adminToken') || '';

const clearAuthToken = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('adminToken');
};

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
    credentials: 'include',
  };

  try {
    const response = await fetch(`${VITE_SERVER_URL}${endpoint}`, config);

    // ✅ Special handling for /admin/me 404
    if (!response.ok && response.status === 404 && endpoint === '/admin/me') {
      throw new Error('AUTH_ENDPOINT_NOT_FOUND');
    }

    // Check if response is JSON before parsing
    const contentType = response.headers.get('content-type');
    const isJson = contentType && contentType.includes('application/json');

    if (!isJson) {
      if (endpoint !== '/admin/me') {
        console.error(`❌ API Error: Expected JSON but got ${contentType}`);
      }
      throw new Error('Server returned an invalid response');
    }

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        console.error("❌ Unauthorized! Token missing or expired.");
        // ✅ Clear auth on 401
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('adminData');
      }
      if (response.status === 404 && endpoint !== '/admin/me') {
        console.error(`❌ Endpoint not found: ${endpoint}`);
      }
      throw new Error(data.message || data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    if (endpoint !== '/admin/me' || !error.message?.includes('AUTH_ENDPOINT_NOT_FOUND')) {
      console.error('API Error:', error);
    }
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

      // ✅ Store auth in localStorage
      localStorage.setItem('isAuthenticated', 'true');
      if (data.admin) {
        localStorage.setItem('adminData', JSON.stringify(data.admin));
      }
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

  // ✅ Clear localStorage
  localStorage.removeItem('isAuthenticated');
  localStorage.removeItem('adminData');

  window.location.replace('/login');
};

// ✅ FIXED: Use localStorage as primary, API as fallback
export const checkAuth = async () => {
  // First check localStorage
  const isAuthStored = localStorage.getItem('isAuthenticated') === 'true';

  if (!isAuthStored) {
    return false;
  }

  // Default behavior: trust localStorage unless explicitly enabled
  if (!VERIFY_AUTH_ENDPOINT) {
    return true;
  }

  // Try API verification (optional, won't fail if endpoint missing)
  try {
    const data = await apiCall('/admin/me', {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });

    if (data.status === 'success') {
      return true;
    }
  } catch (error) {
    // ✅ API failed, but localStorage says authenticated, so trust it
    console.log("📝 Using localStorage auth (API unavailable)");
  }

  // Trust localStorage
  return isAuthStored;
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

// ✅ Bulk upload function
export const uploadBulkBooks = async (file) => {
  console.log("📤 Uploading bulk books...");

  const token = getAuthToken();
  const formData = new FormData();
  formData.append('file', file);

  try {
    const headers = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const endpoints = ['/add/bulk/upload', '/add/bulk/excel'];
    let lastError = null;

    for (const endpoint of endpoints) {
      const response = await fetch(`${VITE_SERVER_URL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
        credentials: 'include',
      });

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const data = isJson ? await response.json() : { message: await response.text() };

      if (response.ok) {
        return data;
      }

      if (response.status === 404) {
        lastError = new Error(`Endpoint not found: ${endpoint}`);
        continue;
      }

      if (response.status === 401) {
        clearAuthToken();
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('adminData');
      }

      const reportErrors = data?.report?.errors;
      if (Array.isArray(reportErrors) && reportErrors.length > 0) {
        console.warn('⚠️ Upload had some issues:', reportErrors);
        if (data.report?.inserted > 0 || data.report?.updated > 0) {
          return data;
        }
      }

      const reportMessage = data.message || data.error || `Upload failed at ${endpoint}`;
      throw new Error(reportMessage);
    }

    throw lastError || new Error('Bulk upload endpoint not found on backend');
  } catch (error) {
    console.error('❌ Bulk upload error:', error);
    throw error;
  }
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

// ✅ FIX: Use backend's existing endpoints
export const getAllBooks = async (page = 1, limit = 20) => {
  console.log(`🔍 Fetching all books: page ${page}, limit ${limit}`);
  return await apiCall(`/search/all-books?page=${page}&limit=${limit}`);
};

export const getUnavailableBooks = async (page = 1, limit = 20) => {
  console.log(`🔍 Fetching unavailable books: page ${page}, limit ${limit}`);
  return await apiCall(`/search/unavailable-books?page=${page}&limit=${limit}`);
};

// ✅ FIX: Backend uses 'image' field, not 'cover_url'
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