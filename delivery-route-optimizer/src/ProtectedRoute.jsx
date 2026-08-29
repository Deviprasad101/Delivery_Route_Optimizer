import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userRole = sessionStorage.getItem('userRole');

  if (!userRole) {
    // Not logged in
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Logged in but doesn't have permission for this specific route
    // Redirect them to their appropriate dashboard/landing based on role
    if (userRole === 'admin') return <Navigate to="/admin-dashboard" replace />;
    if (userRole === 'rider') return <Navigate to="/dashboard" replace />;
    if (userRole === 'customer') return <Navigate to="/customer-dashboard" replace />; 
  }

  return children;
};

export default ProtectedRoute;
