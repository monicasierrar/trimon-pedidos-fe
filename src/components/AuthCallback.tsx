import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserInfo } from '../api/apiClient';

const AuthCallback = () => {
  const navigate = useNavigate();

  const { search } = useLocation();

  const params = new URLSearchParams(search);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = params.get("access_token");
      const expiresIn = params.get("expires_in");

      if (accessToken && expiresIn) {
        localStorage.setItem("session_token", accessToken);
        localStorage.setItem("expiresIn", expiresIn);
        const userInfo = await getUserInfo(accessToken);
        localStorage.setItem("user_name", `${userInfo.displayName}`)
        navigate("/");
      } else {
        navigate("/login");
      }
    };

    fetchData();
  }, [params, navigate]);

  return <div>Loading...</div>;
};

export default AuthCallback;