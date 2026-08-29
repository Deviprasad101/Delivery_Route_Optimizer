import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import RiderRegistration from './RiderRegistration'
import AdminApproval from './AdminApproval'
import RiderDashboard from './RiderDashboard'
import AdminDashboard from './AdminDashboard'
import TripCompleted from './TripCompleted'
import Sidebar from './Sidebar'
import './App.css'

const AppContent = () => {
  const location = useLocation();
  const hideSidebarRoutes = ['/admin-dashboard', '/trip-completed'];
  const showSidebar = !hideSidebarRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-surface">
      {showSidebar && <Sidebar />}
      <div className={`flex-1 h-full overflow-y-auto relative ${showSidebar ? '' : 'flex flex-col'}`}>
        <Routes>
          <Route path="/" element={<RiderRegistration />} />
          <Route path="/approval" element={<AdminApproval />} />
          <Route path="/dashboard" element={<RiderDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/trip-completed" element={<TripCompleted />} />
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

