import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
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
import CoverLetterGenerator from "./pages/CoverLetterGenerator";
import AITools from "./pages/AITools";
import Templates from "./pages/Templates";

const GOOGLE_CLIENT_ID = "613554214488-v5qr5lt1efch2dg6hvm1ppik5485pv09.apps.googleusercontent.com";

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
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
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
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
            <Route
              path="/cover-letter"
              element={
                <ProtectedRoute>
                  <CoverLetterGenerator />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai-tools"
              element={
                <ProtectedRoute>
                  <AITools />
                </ProtectedRoute>
              }
            />
            <Route
              path="/templates"
              element={
                <ProtectedRoute>
                  <Templates />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  </GoogleOAuthProvider>
  );
}

export default App;
