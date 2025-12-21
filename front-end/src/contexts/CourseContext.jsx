import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const CourseContext = createContext();

export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};

const API_URL = `${import.meta.env.VITE_API_URL || '/api'}/courses`;

export const CourseProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [trainerCourses, setTrainerCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [pendingCourses, setPendingCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(null);
  const [enrollmentError, setEnrollmentError] = useState(null);
  const [error, setError] = useState(null);

  const getToken = () => Cookies.get("token");

  const fetchAllCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/all-approved`);
      setCourses(response.data.courses || response.data || []);
      setLoading(false);
      return response.data.courses || response.data || [];
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch courses";
      setError(errorMessage);
      console.error("Error fetching courses:", error);
      return [];
    }
  }, []);

  const getPendingCourses = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token");
      const response = await axios.get(`${API_URL}/pending`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPendingCourses(response.data.courses);
      return response.data.courses;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch pending courses");
      throw error;
    }
  }, []);

  const fetchTrainerCourses = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token");
      const response = await axios.get(`${API_URL}/trainer`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrainerCourses(response.data.courses);
      return response.data.courses;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch trainer courses");
      throw error;
    }
  }, []);

  const fetchCourseById = useCallback(async (courseId) => {
    try {
      setLoading(true);
      setError(null);
      const token = getToken();
      const config = token ? {
        headers: { Authorization: `Bearer ${token}` },
      } : {};
      const response = await axios.get(`${API_URL}/${courseId}`, config);
      setSelectedCourse(response.data.course || response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      const errorMessage = error.response?.data?.message || error.message || "Failed to fetch course";
      setError(errorMessage);
      console.error("Error fetching course:", error);
      throw error;
    }
  }, []);

  const createCourse = async (courseData) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token");
      const response = await axios.post(`${API_URL}/create-course`, courseData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrainerCourses([...trainerCourses, response.data]);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to create course");
      throw error;
    }
  };

  const updateCourseApproval = async ({ courseId, status, rejectionReason }) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token");
      const response = await axios.put(
        `${API_URL}/approval/${courseId}`,
        { status, rejectionReason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedCourse = response.data.course;
      setCourses(courses.map(course => course._id === updatedCourse._id ? updatedCourse : course));
      return updatedCourse;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update course approval");
      throw error;
    }
  };

  const enrollCourse = async (courseId) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token");
      const response = await axios.post(
        `${API_URL}/enroll/${courseId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnrolledCourses([...enrolledCourses, response.data.enrolledCourses]);
      setEnrollmentSuccess(true);
      return response.data;
    } catch (error) {
      setEnrollmentError(error.response?.data?.message || "Error enrolling in course");
      throw error;
    }
  };

  const getEnrolledCourses = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token");
      const response = await axios.get(`${API_URL}/enrolled`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEnrolledCourses(response.data.enrolledCourses);
      return response.data.enrolledCourses;
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching enrolled courses");
      throw error;
    }
  }, []);

  const updateCourse = async ({ courseId, updatedData }) => {
    try {
      if (!courseId || !updatedData) {
        throw new Error("Course ID and updated data are required");
      }

      setLoading(true);
      const token = getToken();
      if (!token) throw new Error("No token");

      let formData = new FormData();
      let isFormDataUsed = false;

      if (updatedData.lessons) {
        formData.append("lessons", JSON.stringify(updatedData.lessons));
        isFormDataUsed = true;
      }
      if (updatedData.syllabus) {
        formData.append("syllabus", JSON.stringify(updatedData.syllabus));
        isFormDataUsed = true;
      }

      Object.keys(updatedData).forEach((key) => {
        if (key !== "lessons" && key !== "syllabus" && updatedData[key] !== undefined) {
          formData.append(key, updatedData[key]);
          isFormDataUsed = true;
        }
      });

      if (updatedData.thumbnail instanceof File) {
        formData.append("thumbnail", updatedData.thumbnail);
        isFormDataUsed = true;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          ...(isFormDataUsed ? { "Content-Type": "multipart/form-data" } : {}),
        },
      };

      const response = await axios.patch(
        `${API_URL}/${courseId}`,
        isFormDataUsed ? formData : updatedData,
        config
      );

      const updatedCourse = response.data.course;
      setCourses(courses.map(course => course._id === updatedCourse._id ? updatedCourse : course));
      setTrainerCourses(trainerCourses.map(course => course._id === updatedCourse._id ? updatedCourse : course));
      if (selectedCourse && selectedCourse._id === updatedCourse._id) {
        setSelectedCourse(updatedCourse);
      }
      setLoading(false);
      setError(null);
      return updatedCourse;
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || error.response?.data?.errors?.join(", ") || "Failed to update course");
      throw error;
    }
  };

  const deleteCourse = async (courseId) => {
    try {
      const token = getToken();
      if (!token) throw new Error("No token");
      await axios.delete(`${API_URL}/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTrainerCourses(trainerCourses.filter(course => course._id !== courseId));
      return courseId;
    } catch (error) {
      setError(error.response?.data?.message || "Failed to delete course");
      throw error;
    }
  };

  const resetCourseState = () => {
    setSelectedCourse(null);
    setEnrollmentSuccess(null);
    setEnrollmentError(null);
    setError(null);
  };

  const value = {
    courses,
    trainerCourses,
    enrolledCourses,
    pendingCourses,
    selectedCourse,
    loading,
    enrollmentSuccess,
    enrollmentError,
    error,
    fetchAllCourses,
    getPendingCourses,
    fetchTrainerCourses,
    fetchCourseById,
    createCourse,
    updateCourseApproval,
    enrollCourse,
    getEnrolledCourses,
    updateCourse,
    deleteCourse,
    resetCourseState,
  };

  return <CourseContext.Provider value={value}>{children}</CourseContext.Provider>;
};

