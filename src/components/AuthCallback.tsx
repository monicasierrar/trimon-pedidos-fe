import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUserInfo } from "../api/apiClient";

const AuthCallback = () => {
  const navigate = useNavigate();

  const { search } = useLocation();

  const params = useMemo(() => new URLSearchParams(search), [search]);

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = params.get("access_token");
      const expiresIn = params.get("expires_in");
      const refreshToken = params.get("refresh_token");

      if (accessToken && expiresIn && refreshToken) {
        localStorage.setItem("session_token", accessToken);
        localStorage.setItem("expiresIn", expiresIn);
        localStorage.setItem("refresh_token", refreshToken);
        const userInfo = await getUserInfo(accessToken);
        if (userInfo.error) {
          navigate("/login?error=" + encodeURI(userInfo.error));
        } else {
          localStorage.setItem("user_name", `${userInfo.displayName}`);
          navigate("/");
        }
      } else {
        navigate("/login");
      }
    };

    fetchData();
  }, [params, navigate]);

  return <div>Loading...</div>;
};

export default AuthCallback;
