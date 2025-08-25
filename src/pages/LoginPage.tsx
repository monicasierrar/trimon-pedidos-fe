// src/pages/LoginPage.tsx
//import TestLogin from '../components/TestLogin'; // <-- Importa el botón de prueba
import LoginButton from '../components/LoginButton'; 
import { Box, Paper } from '@mui/material';

const LoginPage = () => {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Paper sx={{ padding: 4 }}>
        <LoginButton/> {/* <-- Usa el nuevo botón aquí */}
      </Paper>
    </Box>
  );
};

export default LoginPage;