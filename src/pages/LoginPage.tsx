// src/pages/LoginPage.tsx
import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import logo from '../assets/logo.png';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    // try {
    //   await signInWithPopup(auth, googleProvider);
    //   navigate('/');
    // } catch (error) {
    //   console.error("Error durante el login con Google", error);
    // }
    console.log("login")

  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
    >
      <img src={logo} alt="Logo Corporativo" style={{ width: 150, marginBottom: '2rem' }} />
      <Typography variant="h5" gutterBottom>
        Iniciar Sesión
      </Typography>
      <Button
        variant="contained"
        startIcon={<GoogleIcon />}
        onClick={handleGoogleLogin}
      >
        Autenticarse con Google
      </Button>
    </Box>
  );
};

export default LoginPage;