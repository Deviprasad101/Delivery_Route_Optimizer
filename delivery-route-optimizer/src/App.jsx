import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import RiderRegistration from './RiderRegistration'
import AdminApproval from './AdminApproval'
import RiderDashboard from './RiderDashboard'
import AdminDashboard from './AdminDashboard'
import TripCompleted from './TripCompleted'
import AdminLogin from './AdminLogin'
import CustomerLogin from './CustomerLogin'
import RiderLogin from './RiderLogin'
import Portal from './Portal'
import ProtectedRoute from './ProtectedRoute'
import Sidebar from './Sidebar'
import CustomerDashboard from './CustomerDashboard'
import CustomerTripStatus from './CustomerTripStatus'
import './App.css'

const AppContent = () => {
  const location = useLocation();
  const hideSidebarRoutes = ['/', '/admin-dashboard', '/trip-completed', '/admin-login', '/customer-login', '/rider-login', '/customer-dashboard', '/customer-trip'];
  const showSidebar = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface">
      {showSidebar && <Sidebar />}
      <div className={`flex-1 h-full overflow-y-auto relative ${showSidebar ? '' : 'flex flex-col'}`}>
        <Routes>
          <Route path="/" element={<Portal />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/customer-login" element={<CustomerLogin />} />
          <Route path="/rider-login" element={<RiderLogin />} />
          
          <Route path="/registration" element={
            <ProtectedRoute allowedRoles={['rider']}>
              <RiderRegistration />
            </ProtectedRoute>
          } />
          <Route path="/approval" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminApproval />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['rider']}>
              <RiderDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/trip-completed" element={
            <ProtectedRoute allowedRoles={['rider']}>
              <TripCompleted />
            </ProtectedRoute>
          } />
          <Route path="/customer-dashboard" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/customer-trip" element={
            <ProtectedRoute allowedRoles={['customer']}>
              <CustomerTripStatus />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App

