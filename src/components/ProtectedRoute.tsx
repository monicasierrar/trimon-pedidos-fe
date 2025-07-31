// src/components/ProtectedRoute.tsx
import React from 'react';
// Asumiendo que usas react-firebase-hooks para manejar el estado de auth de forma sencilla
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom'; // Asegúrate de que esta ruta a tu config de firebase sea correcta
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // useAuthState verifica el estado de autenticación con Firebase
  // const [user, loading, error] = useAuthState(auth);
  const user = {

  }
  const loading = false
  const error = null

  if (loading) {
    // Muestra un spinner mientras Firebase verifica la sesión
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    console.error("Error de autenticación:", error);
    return <Navigate to="/login" />;
  }

  if (!user) {
    // Si no hay usuario logueado, redirige a /login
    return <Navigate to="/login" />;
  }

  // Si el usuario está logueado, muestra el componente hijo (PedidosPage)
  return children;
};