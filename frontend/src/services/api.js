import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: BASE_URL,
});

// Attach JWT token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If token expires / invalid, log the user out automatically
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// ---------- Auth ----------
export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

// ---------- Suits ----------
export const suitAPI = {
  getAll: (params) => api.get("/suits", { params }),
  getAvailable: () => api.get("/suits/available"),
  getOne: (id) => api.get(`/suits/${id}`),
  create: (data) => api.post("/suits", data),
  update: (id, data) => api.put(`/suits/${id}`, data),
  delete: (id) => api.delete(`/suits/${id}`),
};

// ---------- Customers ----------
export const customerAPI = {
  getAll: (params) => api.get("/customers", { params }),
  getOne: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post("/customers", data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

export const rentalAPI = {
  getAll: (params) => api.get("/rentals", { params }),
  getMyBookings: () => api.get("/rentals/my-bookings"),
  getOne: (id) => api.get(`/rentals/${id}`),
  create: (data) => api.post("/rentals", data),
  createBooking: (data) => api.post("/rentals/book", data),
  update: (id, data) => api.put(`/rentals/${id}`, data),
  delete: (id) => api.delete(`/rentals/${id}`),
};

// ---------- Staff / Users ----------
export const staffAPI = {
  getAll: (params) => api.get("/users", { params }),
  getOne: (id) => api.get(`/users/${id}`),
  create: (data) => api.post("/users", data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
};

// ---------- Bookings ----------
export const bookingAPI = {
  getAll: (params) => api.get("/bookings", { params }),
  getOne: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post("/bookings", data),
  update: (id, data) => api.put(`/bookings/${id}`, data),
  delete: (id) => api.delete(`/bookings/${id}`),
};

// ---------- Dashboard ----------
export const dashboardAPI = {
  getStats: (params) => api.get("/dashboard/stats", { params }),
};

// ---------- Reports ----------
export const reportAPI = {
  getRevenue: () => api.get("/reports/revenue"),
  getRentals: () => api.get("/reports/rentals"),
  getCustomers: () => api.get("/reports/customers"),
  getSuits: () => api.get("/reports/suits"),
};

export default api;
