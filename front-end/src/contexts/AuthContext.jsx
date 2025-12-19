import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_URL = "/api/auth";

export const AuthProvider = ({ children }) => {
  const storedUser = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  const storedToken = Cookies.get("token") || null;

  const [user, setUser] = useState(storedUser);
  const [token, setToken] = useState(storedToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const cookieOptions = () => {
    const isDev = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    return { expires: 7, secure: !isDev, sameSite: 'Lax', path: '/' };
  };

  const registerUser = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_URL}/register`, userData);
      const { token: newToken, user: newUser } = response.data;

      Cookies.set("token", newToken, cookieOptions());
      Cookies.set("user", JSON.stringify(newUser), cookieOptions());

      setToken(newToken);
      setUser(newUser);
      setLoading(false);
      setSuccess(true);
      return { token: newToken, user: newUser };
    } catch (error) {
      setLoading(false);
      setError(error.response?.data || error.message);
      throw error;
    }
  };

  const loginUser = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_URL}/login`, userData);
      const { token: newToken, user: newUser } = response.data;

      Cookies.set("token", newToken, cookieOptions());
      Cookies.set("user", JSON.stringify(newUser), cookieOptions());

      setToken(newToken);
      setUser(newUser);
      setLoading(false);
      setSuccess(true);
      return { token: newToken, user: newUser };
    } catch (error) {
      setLoading(false);
      setError(error.response?.data || error.message);
      throw error;
    }
  };

  const logoutUser = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
    setToken(null);
    setSuccess(false);
  };

  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_URL}/change-password`, passwordData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      setSuccess(true);
      return response.data;
    } catch (error) {
      setLoading(false);
      setError(error.response?.data || error.message);
      throw error;
    }
  };

  const resetAuthState = () => {
    setSuccess(false);
    setError(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    success,
    registerUser,
    loginUser,
    logoutUser,
    changePassword,
    resetAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};


