import axios from "axios";
import {
  mockSuits,
  mockCustomers,
  mockRentals,
  mockStaff,
  mockStats,
  mockBookings,
} from "./mockData";

// Change this to match your backend server
const BASE_URL = "http://localhost:5000/api";

// When logged in with the demo account, every call below resolves with local
// mock data instead of hitting the network — lets you preview the whole app
// with no backend running. Remove isDemoMode() checks once real API is live.
const isDemoMode = () => localStorage.getItem("token") === "demo-token";
const mockResponse = (data) => Promise.resolve({ data });
const withId = (list, id) => list.find((item) => item._id === id);

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
};

// ---------- Suits ----------
export const suitAPI = {
  getAll: (params) =>
    isDemoMode()
      ? mockResponse({ suits: mockSuits })
      : api.get("/suits", { params }),
  getOne: (id) =>
    isDemoMode()
      ? mockResponse(withId(mockSuits, id) || {})
      : api.get(`/suits/${id}`),
  create: (data) =>
    isDemoMode()
      ? mockResponse({ ...data, _id: `s${Date.now()}` })
      : api.post("/suits", data),
  update: (id, data) =>
    isDemoMode()
      ? mockResponse({ ...data, _id: id })
      : api.put(`/suits/${id}`, data),
  delete: (id) =>
    isDemoMode() ? mockResponse({ success: true }) : api.delete(`/suits/${id}`),
};

// ---------- Customers ----------
export const customerAPI = {
  getAll: (params) =>
    isDemoMode()
      ? mockResponse({ customers: mockCustomers })
      : api.get("/customers", { params }),
  getOne: (id) =>
    isDemoMode()
      ? mockResponse(withId(mockCustomers, id) || {})
      : api.get(`/customers/${id}`),
  create: (data) =>
    isDemoMode()
      ? mockResponse({ ...data, _id: `c${Date.now()}` })
      : api.post("/customers", data),
  update: (id, data) =>
    isDemoMode()
      ? mockResponse({ ...data, _id: id })
      : api.put(`/customers/${id}`, data),
  delete: (id) =>
    isDemoMode()
      ? mockResponse({ success: true })
      : api.delete(`/customers/${id}`),
};

// ---------- Rentals ----------
export const rentalAPI = {
  getAll: (params) =>
    isDemoMode()
      ? mockResponse({ rentals: mockRentals })
      : api.get("/rentals", { params }),
  getOne: (id) =>
    isDemoMode()
      ? mockResponse(withId(mockRentals, id) || {})
      : api.get(`/rentals/${id}`),
  create: (data) =>
    isDemoMode()
      ? mockResponse({ ...data, _id: `r${Date.now()}` })
      : api.post("/rentals", data),
  update: (id, data) =>
    isDemoMode()
      ? mockResponse({ ...data, _id: id })
      : api.put(`/rentals/${id}`, data),
  delete: (id) =>
    isDemoMode()
      ? mockResponse({ success: true })
      : api.delete(`/rentals/${id}`),
};

// ---------- Staff ----------
export const staffAPI = {
  getAll: (params) =>
    isDemoMode()
      ? mockResponse({ staff: mockStaff })
      : api.get("/staff", { params }),
  getOne: (id) =>
    isDemoMode()
      ? mockResponse(withId(mockStaff, id) || {})
      : api.get(`/staff/${id}`),
  create: (data) =>
    isDemoMode()
      ? mockResponse({ ...data, _id: `st${Date.now()}` })
      : api.post("/staff", data),
  update: (id, data) =>
    isDemoMode()
      ? mockResponse({ ...data, _id: id })
      : api.put(`/staff/${id}`, data),
  delete: (id) =>
    isDemoMode() ? mockResponse({ success: true }) : api.delete(`/staff/${id}`),
};

// ---------- Bookings (internal — staff records a phone/walk-in booking) ----------
export const bookingAPI = {
  getAll: (params) =>
    isDemoMode()
      ? mockResponse({ bookings: mockBookings })
      : api.get("/bookings", { params }),
  getOne: (id) =>
    isDemoMode()
      ? mockResponse(withId(mockBookings, id) || {})
      : api.get(`/bookings/${id}`),
  create: (data) =>
    isDemoMode()
      ? mockResponse({ ...data, _id: `bk${Date.now()}` })
      : api.post("/bookings", data),
  update: (id, data) =>
    isDemoMode()
      ? mockResponse({ ...data, _id: id })
      : api.put(`/bookings/${id}`, data),
  delete: (id) =>
    isDemoMode()
      ? mockResponse({ success: true })
      : api.delete(`/bookings/${id}`),
};

// ---------- Dashboard ----------
export const dashboardAPI = {
  getStats: () =>
    isDemoMode() ? mockResponse(mockStats) : api.get("/dashboard/stats"),
};

export default api;
