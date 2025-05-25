import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Register from "./pages/Register";
import Login from "./pages/Login";
// import Admin from "./pages/AdminPanel";
import AdminPanel from "./pages/AdminPanel";
import PilotPanel from "./pages/PilotPanel";
// import AdminMonitor from "./pages/AdminMonitor";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import AdminMonitor from "./pages/AdminMonitor";
import PilotMonitor from "./pages/PilotMonitor";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Welcome />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Public Routes */}
            <Route path="/" element={<Welcome />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route
              path="/home"
              element={
                <ProtectedRoute requiredRole="user">
                  <PilotPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/home/:droneId"
              element={
                <ProtectedRoute requiredRole="user">
                  <PilotMonitor />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="police">
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin-monitor"
              element={
                <ProtectedRoute requiredRole="police">
                  <AdminMonitor />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
