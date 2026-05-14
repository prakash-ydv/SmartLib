import { DEPARTMENTS } from "../constants/catalog";

const configuredServerUrl = import.meta.env.VITE_SERVER_URL?.trim();
const VITE_SERVER_URL = configuredServerUrl || "/api";

const clearAuthState = () => {
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("adminData");
  localStorage.removeItem("token");
  localStorage.removeItem("adminToken");
};

const buildQuery = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      query.set(key, String(value));
    }
  });

  const serialized = query.toString();
  return serialized ? `?${serialized}` : "";
};

const apiCall = async (endpoint, options = {}) => {
  const headers = {
    ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  const response = await fetch(`${VITE_SERVER_URL}${endpoint}`, {
    method: options.method || "GET",
    headers,
    body:
      options.body instanceof FormData
        ? options.body
        : options.body
          ? JSON.stringify(options.body)
          : undefined,
    credentials: "include",
  });

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json()
    : { message: await response.text() };

  if (!response.ok) {
    if (response.status === 401) clearAuthState();
    throw new Error(data.message || data.error || "Request failed");
  }

  return data;
};

export const adminLogin = async (email, password) => {
  const data = await apiCall("/admin/login", {
    method: "POST",
    body: { email: email.trim().toLowerCase(), password },
  });

  if (data.status === "success") {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("adminData", JSON.stringify(data.data || null));
  }

  return data;
};

export const adminLogout = async () => {
  try {
    await apiCall("/admin/logout", { method: "POST" });
  } finally {
    clearAuthState();
  }
};

export const checkAuth = async () => {
  try {
    const data = await apiCall("/admin/me", {
      headers: {
        "Cache-Control": "no-store",
      },
    });

    if (data.status === "success") {
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("adminData", JSON.stringify(data.data || null));
      return true;
    }
  } catch {
    clearAuthState();
  }

  return false;
};

export const isAuthenticated = () =>
  localStorage.getItem("isAuthenticated") === "true";

export const addBook = async (bookData) =>
  apiCall("/add/one", {
    method: "POST",
    body: bookData,
  });

export const uploadBulkBooks = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiCall("/add/bulk/upload", {
    method: "POST",
    body: formData,
  });
};

export const updateBook = async (bookId, updateData) =>
  apiCall(`/update/book/${bookId}`, {
    method: "PATCH",
    body: updateData,
  });

export const searchBookByTitle = async (title) =>
  apiCall(`/search/book${buildQuery({ title })}`);

export const getAllBooks = async (page = 1, limit = 20, filters = {}) =>
  apiCall(
    `/search/all-books${buildQuery({
      page,
      limit,
      q: filters.q,
      department: filters.department,
      availability: filters.availability,
    })}`,
  );

export const getUnavailableBooks = async (page = 1, limit = 20, filters = {}) =>
  getAllBooks(page, limit, { ...filters, availability: "unavailable" });

export const getBooksWithoutImage = async (page = 1, limit = 20, filters = {}) =>
  apiCall(
    `/search/without-image${buildQuery({
      page,
      limit,
      q: filters.q,
      department: filters.department,
    })}`,
  );

export const getMostViewedBooks = async (page = 1, limit = 20, filters = {}) =>
  apiCall(
    `/search/most-viewed${buildQuery({
      page,
      limit,
      q: filters.q,
      department: filters.department,
      availability: filters.availability,
    })}`,
  );

export const incrementBookViews = async (bookId) =>
  apiCall(`/update/book/views/${bookId}`, {
    method: "PATCH",
  });

export const deleteBook = async (bookId) =>
  apiCall(`/delete/${bookId}`, {
    method: "DELETE",
  });

export const getDashboardStats = async () => apiCall("/dashboard/stats");

export const toggleBookAvailability = async (bookId, currentStatus) =>
  apiCall(`/feature/change-visiblity/${bookId}`, {
    method: "PATCH",
    body: { isAvailable: !currentStatus },
  });

export const uploadBookImage = async (file, bookId) => {
  const formData = new FormData();
  formData.append("file", file);
  if (bookId) formData.append("bookId", bookId);

  return apiCall("/upload/image", {
    method: "POST",
    body: formData,
  });
};

export { DEPARTMENTS };
