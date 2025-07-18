// src/App.tsx

import { Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import PedidosPage from './pages/PedidosPage';
import HistorialPage from './pages/HistorialPage'; // <-- 1. Importa la nueva página
import LogTransaccionesPage from './pages/LogTransaccionesPage'; // <-- 1. Importa la nueva página
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <PedidosPage />
          </ProtectedRoute>
        }
      />
      {/* 2. Añade la nueva ruta protegida */}
      <Route
        path="/historial"
        element={
          <ProtectedRoute>
            <HistorialPage />
          </ProtectedRoute>
        }
      />
      {/* 2. Añade la nueva ruta protegida */}
      <Route
        path="/log-transacciones"
        element={
          <ProtectedRoute>
            <LogTransaccionesPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;