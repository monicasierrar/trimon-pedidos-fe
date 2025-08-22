
// src/components/LoginButton.js

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import logo from '../assets/logo.png';

const LoginButton = () => {
  const handleLogin = () => {
    const ZOHO_CLIENT_ID = import.meta.env.VITE_ZOHO_CLIENT_ID;
    const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
    const SCOPES = 'aaaserver.profile.READ,ZohoMail.accounts.READ';

    console.log("Enviando Client ID:", ZOHO_CLIENT_ID);
    console.log("Enviando Redirect URI:", REDIRECT_URI);

    const zohoAuthUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=${SCOPES}&client_id=${ZOHO_CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${REDIRECT_URI}`;

    window.location.href = zohoAuthUrl;
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      px={2}
      textAlign="center"
    >
      {/* Logo responsive */}
      <Box component="img"
        src={logo}
        alt="Logo"
        sx={{
          width: { xs: '150px', sm: '200px' },
          mb: 3
        }}
      />

      {/* Título de la app */}
      <Typography variant="h4" component="h1" gutterBottom>
        GoPedidos
      </Typography>

      {/* Botón de login */}
      <Button 
        variant="contained" 
        color="primary" 
        size="large"
        onClick={handleLogin}
        sx={{ mt: 2 }}
      >
        Iniciar sesión con Zoho
      </Button>
    </Box>
  );
};

export default LoginButton;
