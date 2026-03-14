import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import CitizenDashboard from './pages/citizen/Dashboard';
import CollectorDashboard from './pages/collector/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Basic Placeholder Dashboards
const AdminDashboard = () => <div className="pt-24 px-8 text-center animate-fade-in"><h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1><p className="text-slate-600 mt-4 text-xl">Coming soon: Analytics & Users</p></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              
              <Route 
                path="/citizen/dashboard" 
                element={
                  <ProtectedRoute role="citizen">
                    <CitizenDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/collector/dashboard" 
                element={
                  <ProtectedRoute role="collector">
                    <CollectorDashboard />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute role="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />

              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
