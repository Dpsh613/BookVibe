import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if logged in on app load
  useEffect(() => {
    const savedUser = localStorage.getItem("bookvibe_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  },[]);


   
  const login = async (email, password) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, { email, password });
    localStorage.setItem("bookvibe_user", JSON.stringify(res.data));
    setUser(res.data);
  };

  const register = async (name, email, password) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, { name, email, password });
    localStorage.setItem("bookvibe_user", JSON.stringify(res.data));
    setUser(res.data);
  };

  const logout = () => {
    localStorage.removeItem("bookvibe_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};