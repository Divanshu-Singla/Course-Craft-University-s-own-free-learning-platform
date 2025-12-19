import React, { createContext, useContext, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const AdminContext = createContext();

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

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = Cookies.get('token');
      const response = await axios.get("/api/admin/stats", {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setTotalUsers(response.data.totalUsers);
      setTotalCourses(response.data.totalCourses);
      setTotalExams(response.data.totalExams);
      setBannedUsers(response.data.bannedUsers || []);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "Failed to fetch stats");
      throw error;
    }
  };

  const banUser = async (userId) => {
    try {
      const token = Cookies.get('token');
      await axios.put(`/api/admin/ban/${userId}`, {}, { 
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
      await axios.put(`/api/admin/unban/${userId}`, {}, { 
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


