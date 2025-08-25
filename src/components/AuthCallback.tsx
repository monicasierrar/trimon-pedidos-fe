import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const exchangeCodeForTokens = async (code:string) => {
      try {
        const clientId = import.meta.env.VITE_ZOHO_CLIENT_ID;
        const redirectUri = import.meta.env.VITE_ZOHO_REDIRECT_URI;
        const tokenUrl = import.meta.env.VITE_ZOHO_TOKEN_URL;

        const params = new URLSearchParams();
        params.append('grant_type', 'authorization_code');
        params.append('client_id', clientId);
        params.append('redirect_uri', redirectUri);
        params.append('code', code);

        const response = await axios.post(tokenUrl, params, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });

        const { access_token, refresh_token, expires_in } = response.data;

        // Store tokens in local storage
        localStorage.setItem('accessToken', access_token);
        localStorage.setItem('refreshToken', refresh_token);
        localStorage.setItem('expiresAt', `${Date.now() + expires_in * 1000}`);

        console.log('Tokens stored successfully:', { access_token, refresh_token, expires_in });

        // Redirect the user to the main app page
        navigate('/');
      } catch (error: unknown) {
        // Check if the error is an AxiosError
        if (axios.isAxiosError(error)) {
          // It's an Axios error, you can safely access its properties
          console.error('Axios Error:', error.message);

          // You can also check if there's a response from the server
          if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
          }
        } else {
          // It's a different kind of error (e.g., network error, a different promise rejection)
          console.error('An unexpected error occurred:', error);
        }
      }
    };

    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');

    if (code) {
      exchangeCodeForTokens(code);
    } else {
      console.error('No authorization code found in URL.');
      navigate('/login');
    }
  }, [location, navigate]);

  return <div>Loading...</div>;
};

export default AuthCallback;