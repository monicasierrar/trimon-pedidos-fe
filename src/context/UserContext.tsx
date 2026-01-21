import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { getUserInfo } from "../api/apiClient";

type UserInfo = any; // Replace with your actual user info type if available

interface UserContextType {
  user: UserInfo | null;
  setUser: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);


  // Track the current token to detect changes
  const tokenRef = useRef<string | null>(localStorage.getItem("session_token"));

  // Fetch user info initially and when token changes
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const data = await getUserInfo();
      setUser(data);
      setLoading(false);
    };

    fetchUser();

    // Listen for token changes (cross-tab)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "session_token" && e.newValue !== tokenRef.current) {
        tokenRef.current = e.newValue;
        fetchUser();
      }
    };
    window.addEventListener("storage", handleStorage);

    // Listen for custom event (same-tab)
    const handleCustom = (e: Event) => {
        console.log("Detected session_token update via custom event", e);
      const newToken = localStorage.getItem("session_token");
      if (newToken !== tokenRef.current) {
        tokenRef.current = newToken;
        fetchUser();
      }
    };
    window.addEventListener("session_token_updated", handleCustom);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("session_token_updated", handleCustom);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};