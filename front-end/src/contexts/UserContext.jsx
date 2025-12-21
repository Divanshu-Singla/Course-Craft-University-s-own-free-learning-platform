import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

const API_URL = `${import.meta.env.VITE_API_URL || '/api'}/users`;

export const UserProvider = ({ children }) => {
  const storedUser = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  const storedToken = Cookies.get("token") || null;

  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(storedUser);
  const [token] = useState(storedToken);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getToken = () => Cookies.get("token");

  const fetchAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) throw new Error("No authentication token found.");

      const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "Failed to fetch users.");
      throw error;
    }
  }, []);

  const fetchUserById = useCallback(async (_id) => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) throw new Error("No authentication token found.");

      const response = await axios.get(`${API_URL}/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const userData = {
        ...response.data,
        isBanned: response.data.isBanned || false,
      };
      setUser(userData);
      setLoading(false);
      return userData;
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "Failed to fetch user.");
      throw error;
    }
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) {
        setCurrentUser(null);
        setLoading(false);
        return null;
      }

      const response = await axios.get(`${API_URL}/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCurrentUser(response.data);
      Cookies.set("user", JSON.stringify(response.data), { expires: 7, sameSite: 'Lax', path: '/' });
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "Failed to fetch current user.");
      throw error;
    }
  }, []);

  const updateUser = useCallback(async ({ id, updates, profilePicture }) => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) throw new Error("No authentication token found.");

      let formData;
      const headers = { Authorization: `Bearer ${token}` };

      if (profilePicture) {
        formData = new FormData();
        for (const key in updates) {
          formData.append(key, updates[key]);
        }
        formData.append("profilePicture", profilePicture);
        headers["Content-Type"] = "multipart/form-data";
      }

      const response = await axios.put(
        `${API_URL}/${id}`,
        profilePicture ? formData : updates,
        { headers }
      );

      const updatedUser = response.data.user;
      setCurrentUser(updatedUser);
      Cookies.set("user", JSON.stringify(updatedUser), { expires: 7, sameSite: 'Lax', path: '/' });
      setLoading(false);
      return updatedUser;
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "Failed to update user.");
      throw error;
    }
  }, []);

  const deleteUser = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      if (!token) throw new Error("No authentication token found.");

      const response = await axios.delete(`${API_URL}/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local state immediately by filtering out the deleted user
      setUsers(prevUsers => prevUsers.filter(u => u._id !== userId));
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "Failed to delete user.");
      throw error;
    }
  }, []);

  const value = {
    users,
    user,
    currentUser,
    token,
    loading,
    error,
    fetchAllUsers,
    fetchUserById,
    fetchCurrentUser,
    updateUser,
    deleteUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};


