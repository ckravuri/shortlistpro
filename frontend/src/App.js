import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ResumeBuilder from "./pages/ResumeBuilder";
import STARBuilder from "./pages/STARBuilder";
import HeadshotGenerator from "./pages/HeadshotGenerator";
import JobAdGenerator from "./pages/JobAdGenerator";
import AdminDashboard from "./pages/AdminDashboard";
import Pricing from "./pages/Pricing";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import AuthCallback from "./components/AuthCallback";

// Wrapper to handle OAuth callback
function DashboardRoute() {
  const location = useLocation();
  // If URL has session_id, show AuthCallback
  if (location.hash?.includes('session_id=')) {
    return <AuthCallback />;
  }
  // Otherwise show protected dashboard
  return (
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route
              path="/dashboard"
              element={<DashboardRoute />}
            />
            <Route
              path="/resume/:resumeId"
              element={
                <ProtectedRoute>
                  <ResumeBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/star-builder"
              element={
                <ProtectedRoute>
                  <STARBuilder />
                </ProtectedRoute>
              }
            />
            <Route
              path="/headshot-generator"
              element={
                <ProtectedRoute>
                  <HeadshotGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/job-ad-generator"
              element={
                <ProtectedRoute>
                  <JobAdGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
