import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Background from './components/layout/Background';
import Header from './components/layout/Header';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import DocumentUploadForm from './components/documents/DocumentUploadForm';
import DocumentList from './components/documents/DocumentList';
import AdminViewAllDocument from './components/documents/AdminViewAllDocument';
import ProtectedRoute from './components/ProtectedRoute';

const AppContent: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="relative">
      <Background />
      {user && <Header />}
      
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/upload" element={
          <ProtectedRoute>
            <DocumentUploadForm />
          </ProtectedRoute>
        } />
        
        <Route path="/documents" element={
          <ProtectedRoute>
            <DocumentList />
          </ProtectedRoute>
        } />
        
        {/* Admin Only Routes */}
        <Route path="/admin/documents" element={
          <ProtectedRoute adminOnly>
            <AdminViewAllDocument />
          </ProtectedRoute>
        } />
        
        {/* Default Route */}
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;