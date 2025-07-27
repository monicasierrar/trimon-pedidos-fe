
// src/components/LoginButton.js

import Button from '@mui/material/Button';

const LoginButton = () => {
  const handleLogin = () => {
    const ZOHO_CLIENT_ID = import.meta.env.VITE_ZOHO_CLIENT_ID;
    const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
    const SCOPES = 'aaaserver.profile.READ,ZohoMail.accounts.READ';

    const zohoAuthUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=${SCOPES}&client_id=${ZOHO_CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${REDIRECT_URI}`;

    window.location.href = zohoAuthUrl;
  };

  // El return debe estar aquí, fuera de la función handleLogin
  return (
    <Button color="inherit" onClick={handleLogin}>
      Login with Zoho
    </Button>
  );
};

export default LoginButton;