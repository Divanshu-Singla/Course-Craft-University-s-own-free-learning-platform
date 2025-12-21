import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AdminContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalExams, setTotalExams] = useState(0);
  const [bannedUsers, setBannedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAdminStats = useCallback(async () => {
    try {
      console.log("Fetching admin stats from frontend...");
      setLoading(true);
      setError(null);
      const token = Cookies.get('token');
      console.log("Token:", token ? "Present" : "Missing");
      
      const response = await axios.get(`${API_BASE_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      
      console.log("Stats received:", response.data);
      setTotalUsers(response.data.totalUsers || 0);
      setTotalCourses(response.data.totalCourses || 0);
      setTotalExams(response.data.totalExams || 0);
      setBannedUsers(response.data.bannedUsers || []);
      console.log("State updated with:", {
        totalUsers: response.data.totalUsers,
        totalCourses: response.data.totalCourses,
        totalExams: response.data.totalExams
      });
      setLoading(false);
      return response.data;
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      console.error("Error response:", error.response?.data);
      setLoading(false);
      setError(error.response?.data?.message || "Failed to fetch stats");
      throw error;
    }
  }, []);

  const banUser = async (userId) => {
    try {
      const token = Cookies.get('token');
      await axios.put(`${API_BASE_URL}/admin/ban/${userId}`, {}, { 
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true 
      });
      if (!bannedUsers.includes(userId)) {
        setBannedUsers([...bannedUsers, userId]);
      }
      return userId;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to ban user");
      throw error;
    }
  };

  const unbanUser = async (userId) => {
    try {
      const token = Cookies.get('token');
      await axios.put(`${API_BASE_URL}/admin/unban/${userId}`, {}, { 
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true 
      });
      setBannedUsers(bannedUsers.filter((id) => id !== userId));
      return userId;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to unban user");
      throw error;
    }
  };

  const value = {
    totalUsers,
    totalCourses,
    totalExams,
    bannedUsers,
    loading,
    error,
    fetchAdminStats,
    banUser,
    unbanUser,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};


