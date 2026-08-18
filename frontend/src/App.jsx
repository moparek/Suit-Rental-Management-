import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import BookingManagement from "./pages/BookingManagement";
import StaffList from "./pages/StaffList";
import Register from "./pages/Register";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Landing from "./pages/Landing";
import PublicBooking from "./pages/PublicBooking";
import BookingSuccess from "./pages/BookingSuccess";
import CustomerLayout from "./pages/customer/CustomerLayout";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import CustomerBookings from "./pages/customer/CustomerBookings";
import CustomerProfile from "./pages/customer/CustomerProfile";
import CustomerBookSuit from "./pages/customer/CustomerBookSuit";

// Wraps protected pages with the sidebar/navbar/footer layout
function PrivatePage({ children }) {
  return (
    <ProtectedRoute allowedRoles={["admin", "staff", "manager"]}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

function AdminOnlyPage({ children }) {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}

function CustomerPage({ children }) {
  return (
    <ProtectedRoute allowedRoles={["customer"]}>
      <CustomerLayout>{children}</CustomerLayout>
    </ProtectedRoute>
  );
}
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/suit/:id" element={<PublicBooking />} />
        <Route path="/booking-success" element={<BookingSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer Routes */}
        <Route
          path="/customer-dashboard"
          element={
            <CustomerPage>
              <CustomerDashboard />
            </CustomerPage>
          }
        />
        <Route
          path="/customer-bookings"
          element={
            <CustomerPage>
              <CustomerBookings />
            </CustomerPage>
          }
        />
        <Route
          path="/customer-profile"
          element={
            <CustomerPage>
              <CustomerProfile />
            </CustomerPage>
          }
        />
        <Route
          path="/customer-book"
          element={
            <CustomerPage>
              <CustomerBookSuit />
            </CustomerPage>
          }
        />

        <Route
          path="/booking-management"
          element={
            <PrivatePage>
              <BookingManagement />
            </PrivatePage>
          }
        />
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
            <AdminOnlyPage>
              <StaffList />
            </AdminOnlyPage>
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
