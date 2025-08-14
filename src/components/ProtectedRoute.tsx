// src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const sessionToken = localStorage.getItem('accessToken');

  if (!sessionToken) {
    // ✅ CORRECCIÓN: Si no hay token, redirigimos a la página de login.
    return <Navigate to="/login" />;
  }

  // Si hay token, el usuario puede ver el contenido.
  return children;
};