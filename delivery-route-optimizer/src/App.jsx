import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RiderRegistration from './RiderRegistration'
import AdminApproval from './AdminApproval'
import RiderDashboard from './RiderDashboard'
import Sidebar from './Sidebar'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen w-screen overflow-hidden bg-surface">
        <Sidebar />
        <div className="flex-1 h-full overflow-y-auto relative">
          <Routes>
            <Route path="/" element={<RiderRegistration />} />
            <Route path="/approval" element={<AdminApproval />} />
            <Route path="/dashboard" element={<RiderDashboard />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
