import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Welcome from './pages/Welcome'
import Register from './pages/Register'
import Login from './pages/Login'
import './index.css'
import AdminPanel from './pages/AdminPanel'
import PilotPanel from './pages/PilotPanel'
import AdminMonitor from './pages/AdminMonitor'
import PilotMonitor from './pages/PilotMonitor'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/pilot-panel" element={<PilotPanel />} />
        <Route path="/admin-monitor" element={<AdminMonitor />} />
        <Route path="/pilot-monitor" element={<PilotMonitor />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
