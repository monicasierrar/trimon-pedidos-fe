// src/components/TestLogin.jsx
import Button from '@mui/material/Button';

const TestLogin = () => {
  const handleLogin = () => {
    // 👇 Valores escritos directamente para la prueba
    const ZOHO_CLIENT_ID = "1000.YDX393WYYABTM7B0VFM2THUAZLAJVE";
    const REDIRECT_URI = "https://d3571srsk1pdk5.cloudfront.net/auth/callback"; // 🚨 REEMPLAZA ESTO

    const SCOPES = 'aaaserver.profile.READ,ZohoMail.accounts.READ';
    const zohoAuthUrl = `https://accounts.zoho.com/oauth/v2/auth?scope=${SCOPES}&client_id=${ZOHO_CLIENT_ID}&response_type=code&access_type=offline&redirect_uri=${REDIRECT_URI}`;

    window.location.href = zohoAuthUrl;
  };

  return (
    <Button variant="contained" color="error" onClick={handleLogin}>
      Test Login Definitivo
    </Button>
  );
};

export default TestLogin;