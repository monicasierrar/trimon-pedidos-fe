import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const AuthCallback = () => {
  const navigate = useNavigate();

  const { search } = useLocation();

  const params = useMemo(() => new URLSearchParams(search), [search]);

  const { setUser } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = params.get("access_token");
      const expiresIn = params.get("expires_in");
      const refreshToken = params.get("refresh_token");

      if (accessToken && expiresIn && refreshToken) {
        localStorage.setItem("session_token", accessToken);
        localStorage.setItem("refresh_token", refreshToken);
        navigate("/");
      } else {
        navigate("/login");
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, navigate, setUser]);

  return <div>Loading...</div>;
};

export default AuthCallback;
