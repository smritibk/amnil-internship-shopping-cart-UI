import { useState, useEffect } from "react";
import { createContext } from "react";
import api from "../services/api";
import { useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        return;
      }

      try {
        const res = await api.get("/me");
        setUser(res.data.user);
      } catch (error) {
        console.error("Auth check failed:", error);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  const login = async (credentials) => {
    const response = await api.post("/user/login", credentials);

    localStorage.setItem("accessToken", response.data.accessToken);

    const res = await api.get("/me");
    setUser(res.data.user)
    return res.data;
  };

  const logout = async () => {
		await api.post("/user/logout");
		localStorage.removeItem("accessToken");
		setUser(null);
	};

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
