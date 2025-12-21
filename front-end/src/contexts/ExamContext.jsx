import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const ExamContext = createContext();

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
};

const API_BASE_URL = `${import.meta.env.VITE_API_URL || '/api'}/exams`;

const isTokenValid = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

const getToken = () => {
  const token = Cookies.get("token");
  return token && isTokenValid(token) ? token.trim() : null;
};

export const ExamProvider = ({ children }) => {
  const [exams, setExams] = useState([]);
  const [enrolledExams, setEnrolledExams] = useState([]);
  const [results, setResults] = useState([]);
  const [createdExams, setCreatedExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [certificateUrl, setCertificateUrl] = useState(null);

  const fetchExams = useCallback(async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token");

      const response = await axios.get(`${API_BASE_URL}/all`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setExams(response.data);
      setStatus("succeeded");
      return response.data;
    } catch (error) {
      setError(error.response?.data || "Failed to fetch exams");
      setStatus("failed");
      throw error;
    }
  }, []);

  const createExam = async (examData) => {
    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token");

      const response = await axios.post(`${API_BASE_URL}/create`, examData, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setExams([...exams, response.data]);
      setStatus("succeeded");
      return response.data;
    } catch (error) {
      setError(error.response?.data || "Failed to create exam");
      setStatus("failed");
      throw error;
    }
  };

  const addQuestions = async ({ examId, questions }) => {
    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token");

      const response = await axios.post(
        `${API_BASE_URL}/add-questions`,
        { examId, questions },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      const updatedExam = exams.find((exam) => exam._id === examId);
      if (updatedExam) {
        updatedExam.questions = [...updatedExam.questions, ...questions];
        setExams(exams.map(exam => exam._id === examId ? updatedExam : exam));
      }
      return response.data;
    } catch (error) {
      setError(error.response?.data || "Failed to add questions");
      throw error;
    }
  };

  const deleteExam = async (examId) => {
    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token");

      await axios.delete(`${API_BASE_URL}/${examId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setExams(exams.filter(exam => exam._id !== examId));
      return { examId, message: "Exam deleted successfully" };
    } catch (error) {
      setError(error.response?.data || "Failed to delete exam");
      throw error;
    }
  };

  const deleteQuestion = async (questionId) => {
    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token");

      await axios.delete(`${API_BASE_URL}/questions/${questionId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setExams(exams.map(exam => ({
        ...exam,
        questions: exam.questions?.filter(q => q._id !== questionId) || []
      })));
      return { questionId, message: "Question deleted successfully" };
    } catch (error) {
      setError(error.response?.data || "Failed to delete question");
      throw error;
    }
  };

  const fetchExamQuestions = async (examId) => {
    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token");

      const response = await axios.get(`${API_BASE_URL}/${examId}/questions`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      const exam = exams.find((e) => e._id === examId);
      if (exam) {
        exam.questions = response.data;
        setExams(exams.map(e => e._id === examId ? exam : e));
      }
      setStatus("succeeded");
      return { examId, questions: response.data };
    } catch (error) {
      setError(error.response?.data || "Failed to fetch questions");
      setStatus("failed");
      throw error;
    }
  };

  const enrollExam = async (examId) => {
    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token");

      await axios.post(
        `${API_BASE_URL}/enroll/${examId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setStatus("succeeded");
    } catch (error) {
      setError(error.response?.data || "Failed to enroll in exam");
      setStatus("failed");
      throw error;
    }
  };

  const fetchEnrolledExams = async () => {
    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token");

      const response = await axios.get(`${API_BASE_URL}/enrolledExam`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setEnrolledExams(response.data.enrolledExams);
      setStatus("succeeded");
      return response.data.enrolledExams;
    } catch (error) {
      setError(error.response?.data || "Failed to fetch enrolled exams");
      setStatus("failed");
      throw error;
    }
  };

  const submitResult = async (resultData) => {
    try {
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token");

      const response = await axios.post(
        `${API_BASE_URL}/submit-result`,
        resultData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setStatus("succeeded");
      return response.data;
    } catch (error) {
      setError(error.response?.data || "Failed to submit result");
      setStatus("failed");
      throw error;
    }
  };

  const fetchResults = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) throw new Error("Unauthorized - Please log in to view results.");

      const response = await axios.get(`${API_BASE_URL}/submitted-results`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setResults(response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      setError(error.response?.data?.message || "Failed to fetch results");
      throw error;
    }
  }, []);

  const fetchCreatedExams = async () => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token");

      const response = await axios.get(`${API_BASE_URL}/created-exams`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (!response.data || response.data.length === 0) {
        throw new Error("No exams found.");
      }

      setExams(response.data);
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      setError(error.response?.data || "Failed to fetch created exams");
      throw error;
    }
  };

  const generateCertificate = async (examId) => {
    try {
      setStatus("loading");
      setCertificateUrl(null);
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token found");

      const response = await axios.get(`${API_BASE_URL}/${examId}/certificate`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (!response.data.success) throw new Error(response.data.message);

      window.open(response.data.certificateUrl, "_blank");
      setStatus("succeeded");
      setCertificateUrl(response.data.certificateUrl);
      return { success: true, message: "Certificate opened successfully." };
    } catch (error) {
      setStatus("failed");
      setError(error.response?.data || "Failed to generate certificate");
      throw error;
    }
  };

  const updateExam = async ({ examId, updatedData }) => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token");

      const response = await axios.put(
        `${API_BASE_URL}/update-exam/${examId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setExams(exams.map(exam => exam._id === examId ? response.data : exam));
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      setError(error.response?.data || "Failed to update exam");
      throw error;
    }
  };

  const updateQuestion = async ({ questionId, updatedData }) => {
    try {
      setLoading(true);
      const token = getToken();
      if (!token) throw new Error("Unauthorized - No token");

      const response = await axios.put(
        `${API_BASE_URL}/update-question/${questionId}`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setLoading(false);
      return response.data;
    } catch (error) {
      setLoading(false);
      setError(error.response?.data || "Failed to update question");
      throw error;
    }
  };

  const value = {
    exams,
    enrolledExams,
    results,
    createdExams,
    loading,
    status,
    error,
    certificateUrl,
    fetchExams,
    createExam,
    addQuestions,
    deleteExam,
    deleteQuestion,
    fetchExamQuestions,
    enrollExam,
    fetchEnrolledExams,
    submitResult,
    fetchResults,
    fetchCreatedExams,
    generateCertificate,
    updateExam,
    updateQuestion,
  };

  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
};


