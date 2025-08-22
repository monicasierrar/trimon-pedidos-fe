// src/components/ProtectedRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { USE_AUTH } from '../config'; // 🚩 Cambio: importamos la bandera

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // 🚩 Cambio: si USE_AUTH = false, devolvemos siempre el contenido sin validar
  if (!USE_AUTH) {
    return children;
  }

  // 🚩 Cambio: si USE_AUTH = true, mantenemos la lógica original
  const sessionToken = localStorage.getItem('session_token');

  if (!sessionToken) {
    return <Navigate to="/login" />;
  }

  return children;
};
