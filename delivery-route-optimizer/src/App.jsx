import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import RiderRegistration from './RiderRegistration'
import RiderApproval from './RiderApproval'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RiderRegistration />} />
        <Route path="/approval" element={<RiderApproval />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
