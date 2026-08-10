import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SuitList from "./pages/SuitList";
import SuitForm from "./pages/SuitForm";
import CustomerList from "./pages/CustomerList";
import CustomerForm from "./pages/CustomerForm";
import RentalList from "./pages/RentalList";
import RentalForm from "./pages/RentalForm";
import BookingList from "./pages/BookingList";
import BookingForm from "./pages/BookingForm";
import StaffList from "./pages/StaffList";
import Register from "./pages/Register";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
// Wraps protected pages with the sidebar/navbar/footer layout
function PrivatePage({ children }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/bookings"
          element={
            <PrivatePage>
              <BookingList />
            </PrivatePage>
          }
        />
        <Route
          path="/bookings/add"
          element={
            <PrivatePage>
              <BookingForm />
            </PrivatePage>
          }
        />
        <Route
          path="/bookings/edit/:id"
          element={
            <PrivatePage>
              <BookingForm />
            </PrivatePage>
          }
        />

        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivatePage>
              <Dashboard />
            </PrivatePage>
          }
        />

        <Route
          path="/suits"
          element={
            <PrivatePage>
              <SuitList />
            </PrivatePage>
          }
        />
        <Route
          path="/suits/add"
          element={
            <PrivatePage>
              <SuitForm />
            </PrivatePage>
          }
        />
        <Route
          path="/suits/edit/:id"
          element={
            <PrivatePage>
              <SuitForm />
            </PrivatePage>
          }
        />
        <Route
          path="/customers"
          element={
            <PrivatePage>
              <CustomerList />
            </PrivatePage>
          }
        />
        <Route
          path="/customers/add"
          element={
            <PrivatePage>
              <CustomerForm />
            </PrivatePage>
          }
        />
        <Route
          path="/customers/edit/:id"
          element={
            <PrivatePage>
              <CustomerForm />
            </PrivatePage>
          }
        />
        <Route
          path="/rentals"
          element={
            <PrivatePage>
              <RentalList />
            </PrivatePage>
          }
        />
        <Route
          path="/rentals/add"
          element={
            <PrivatePage>
              <RentalForm />
            </PrivatePage>
          }
        />
        <Route
          path="/rentals/edit/:id"
          element={
            <PrivatePage>
              <RentalForm />
            </PrivatePage>
          }
        />
        <Route
          path="/staff"
          element={
            <PrivatePage>
              <StaffList />
            </PrivatePage>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivatePage>
              <Reports />
            </PrivatePage>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivatePage>
              <Profile />
            </PrivatePage>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
