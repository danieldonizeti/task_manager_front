import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, []);

  async function fetchUser() {
    try {
      const { data } = await api.get("/api/users/me/");
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

async function login(email, password) {
    // Limpa tokens antigos antes de tentar logar
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    
    const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login/`,
        { email, password }
    );
    localStorage.setItem("access_token", data.access);
    localStorage.setItem("refresh_token", data.refresh);
    await fetchUser();
}

  async function logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  }

  async function register(first_name, last_name, email, password) {
    await api.post("/api/users/", {
      first_name,
      last_name,
      email,
      password,
    });
  }

  return (
   <AuthContext.Provider value={{ user, loading, login, logout, register, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}