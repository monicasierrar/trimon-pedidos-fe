// src/components/AuthCallback.tsx

import  { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, CircularProgress, Typography } from '@mui/material';

const AuthCallback = () => {
  const [message, setMessage] = useState('Autenticando...');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Extrae el código de la URL que nos envía Zoho
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');

    if (code) {
      // 2. Envía el código a tu webhook de n8n para validarlo
      const n8nWebhookUrl = 'TU_WEBHOOK_URL_DE_N8N'; // 🚨 ¡IMPORTANTE: Reemplaza esto!
      
      axios.post(n8nWebhookUrl, { code })
        .then(response => {
          console.log("Response from api " + response)
          // 3. Si la validación es exitosa, guarda la información y redirige
          // Aquí guardarías el token de sesión, por ejemplo, en localStorage
          // localStorage.setItem('userToken', response.data.token);

          // Redirige al usuario al panel principal
          navigate('/');
        })
        .catch(error => {
          console.error('Error de autenticación:', error);
          setMessage('Falló la autenticación. Por favor, intenta de nuevo.');
          // Opcional: redirigir de vuelta al login después de unos segundos
          setTimeout(() => navigate('/login'), 3000);
        });
    } else {
      setMessage('No se encontró el código de autorización.');
      setTimeout(() => navigate('/login'), 3000);
    }
  }, [location, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      minHeight="80vh"
    >
      <CircularProgress />
      <Typography variant="h6" sx={{ mt: 2 }}>
        {message}
      </Typography>
    </Box>
  );
};

export default AuthCallback;