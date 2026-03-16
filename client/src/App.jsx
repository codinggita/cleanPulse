import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import CitizenDashboard from './pages/citizen/Dashboard';
import SubmitReport from './pages/citizen/SubmitReport';
import MyReports from './pages/citizen/MyReports';
import CitizenProfile from './pages/citizen/Profile';
import CollectorDashboard from './pages/collector/Dashboard';
import CollectorPickups from './pages/collector/Pickups';
import AdminDashboard from './pages/admin/Dashboard';
import AdminReports from './pages/admin/Reports';
import AdminUsers from './pages/admin/Users';
import ProtectedRoute from './components/ProtectedRoute';

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
                path="/citizen/report" 
                element={
                  <ProtectedRoute role="citizen">
                    <SubmitReport />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/citizen/my-reports" 
                element={
                  <ProtectedRoute role="citizen">
                    <MyReports />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/citizen/profile" 
                element={
                  <ProtectedRoute role="citizen">
                    <CitizenProfile />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/citizen/edit-report/:id" 
                element={
                  <ProtectedRoute role="citizen">
                    <SubmitReport isEdit={true} />
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
                path="/collector/pickups" 
                element={
                  <ProtectedRoute role="collector">
                    <CollectorPickups />
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

              <Route 
                path="/admin/reports" 
                element={
                  <ProtectedRoute role="admin">
                    <AdminReports />
                  </ProtectedRoute>
                } 
              />

              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute role="admin">
                    <AdminUsers />
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
