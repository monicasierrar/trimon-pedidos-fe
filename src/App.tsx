// src/App.tsx

import React from 'react'; // <-- AJUSTE: Añadido import de React
import { Routes, Route } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container } from '@mui/material'; // <-- AJUSTE: Imports de Material-UI para el layout

// --- Tus imports originales ---
import LoginPage from './pages/LoginPage';
import PedidosPage from './pages/PedidosPage';
import HistorialPage from './pages/HistorialPage';
import LogTransaccionesPage from './pages/LogTransaccionesPage';
import { ProtectedRoute } from './components/ProtectedRoute';

// --- AJUSTE: Nuevos imports para el flujo de Zoho ---
import AuthCallback from './components/AuthCallback'; // Para manejar la redirección de Zoho

/**
 * AJUSTE: Se crea un componente de Layout para no repetir el AppBar en cada página.
 * Este layout envuelve todas las rutas protegidas.
 */
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Panel de Pedidos
        </Typography>
        {/* Aquí puedes añadir un botón de logout en el futuro */}
      </Toolbar>
    </AppBar>
    <Container sx={{ mt: 4 }}>
      {children}
    </Container>
  </>
);

function App() {
  return (
    <Routes>
      {/* --- AJUSTE: La ruta de login ahora renderiza el botón de Zoho --- */}
      {/* En lugar de una página completa, podrías redirigir o mostrar solo el botón */}
      <Route path="/login" element={<LoginPage />} />

      {/* --- AJUSTE: Ruta para el callback de autenticación de Zoho --- */}
      <Route path="/auth/callback" element={<AuthCallback />} />

      {/* --- AJUSTE: Rutas protegidas ahora usan el MainLayout --- */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <MainLayout>
              <PedidosPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/historial"
        element={
          <ProtectedRoute>
            <MainLayout>
              <HistorialPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/log-transacciones"
        element={
          <ProtectedRoute>
            <MainLayout>
              <LogTransaccionesPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;