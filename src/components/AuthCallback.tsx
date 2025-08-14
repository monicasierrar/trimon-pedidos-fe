import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { exchangeCodeForTokens } from './AuthCallback.funcs';


const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    

    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get('code');

    if (code) {
      exchangeCodeForTokens(code).then(result => result ? '/' : '/login').then(path => navigate(path));
    } else {
      console.error('No authorization code found in URL.');
      navigate('/login');
    }
  }, [location, navigate]);

  return <div>Loading...</div>;
};

export default AuthCallback;