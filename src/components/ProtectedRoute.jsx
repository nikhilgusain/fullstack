import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100vw',
        backgroundColor: 'var(--bg-primary)',
        gap: '1rem'
      }}>
        <div className="spinner" style={{ width: '40px', height: '40px', color: 'var(--color-primary)' }}></div>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Verifying JWT Token...</p>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
