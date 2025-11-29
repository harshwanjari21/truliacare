import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { authService } from './mocks/admin/apiService';

// Import pages
import Login from './pages/shared/Login/Login';
import Dashboard from './pages/admin/Dashboard/Dashboard';
import EventsList from './pages/admin/Events/EventsList';
import CreateEvent from './pages/admin/Events/CreateEvent';
import EditEvent from './pages/admin/Events/EditEvent';
import BookingsList from './pages/admin/Bookings/BookingsList';
import UsersList from './pages/admin/Users/UsersList';
// Profile component commented out - not needed for current version, reserved for future use
// import Profile from './pages/shared/Profile/Profile';
// Settings component removed - not needed

// Import layout
import AdminLayout from './components/admin/Layout/AdminLayout';
import ToastContainer from './components/admin/Toast/ToastContainer';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route component (redirect to dashboard if already authenticated)
const PublicRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          
          {/* Protected admin routes */}
          <Route 
            path="/*" 
            element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/events" element={<EventsList />} />
                    <Route path="/events/create" element={<CreateEvent />} />
                    <Route path="/events/edit/:id" element={<EditEvent />} />
                    <Route path="/bookings" element={<BookingsList />} />
                    <Route path="/users" element={<UsersList />} />
                    {/* Profile route commented out - not needed for current version, reserved for future use */}
                    {/* <Route path="/profile" element={<Profile />} /> */}
                    {/* Settings route removed - not needed */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
        
        {/* Global toast notifications */}
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
