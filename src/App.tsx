// src/App.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Container, Chip, Box } from '@mui/material';

import LoginPage from './pages/LoginPage';
import PedidosPage from './pages/PedidosPage';
import HistorialPage from './pages/HistorialPage';
import LogTransaccionesPage from './pages/LogTransaccionesPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import AuthCallback from './components/AuthCallback';
import { USE_AUTH } from './config'; // 🚩 bandera global

// ✅ MainLayout con indicador visual más notorio
const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <>
    <AppBar position="static">
      <Toolbar>
        {/* Título a la izquierda */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Panel de Pedidos
        </Typography>

        {/* 🚩 Indicador visual (ahora con colores sólidos y relleno) */}
        <Box>
          <Chip
            label={USE_AUTH ? '🔒 Autenticación ACTIVADA' : '⚠️ Autenticación DESACTIVADA'}
            color={USE_AUTH ? 'success' : 'error'}
            sx={{ fontWeight: 'bold', px: 1.5 }}
          />
        </Box>
      </Toolbar>
    </AppBar>

    {/* Contenido de la página */}
    <Container sx={{ mt: 4 }}>
      {children}
    </Container>
  </>
);

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallback />} />

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
