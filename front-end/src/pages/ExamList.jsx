import React, { useEffect, useState } from "react";
import { useExam } from "../contexts/ExamContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const ExamList = () => {
  const navigate = useNavigate();
  const { exams, status, error, fetchExams, enrollExam } = useExam();
  const { user } = useAuth();

  const [selectedType, setSelectedType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const examsPerPage = 6;

  useEffect(() => {
    if (status === "idle") {
      fetchExams();
    }
  }, [status, fetchExams]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset page on new search
  };

  const handleEnroll = async (examId, isEnrolled) => {
    if (isEnrolled) {
      navigate(`/exam/start/${examId}`);
    } else {
      try {
        await enrollExam(examId);
        toast.success("Successfully enrolled in the exam!");
        navigate(`/exam/start/${examId}`);
      } catch (err) {
        toast.error(err.message || "Failed to enroll.");
      }
    }
  };

  // Filter exams
  const filteredExams = exams.filter((exam) => {
    const matchType = selectedType === "All" || exam.type === selectedType;
    const matchSearch = exam.title.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  // Pagination logic
  const indexOfLast = currentPage * examsPerPage;
  const indexOfFirst = indexOfLast - examsPerPage;
  const currentExams = filteredExams.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredExams.length / examsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <motion.div
          className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 0.8, ease: "easeInOut", repeat: Infinity }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500 text-lg font-semibold">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.h2
        className="text-3xl font-bold text-gray-800 mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Explore Available Exams
      </motion.h2>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search exams by title..."
          className="w-full sm:w-2/3 lg:w-1/2 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filter Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mb-10">
        {["All", "Beginner", "Moderate", "Advanced"].map((type) => (
          <button
            key={type}
            onClick={() => {
              setSelectedType(type);
              setCurrentPage(1);
            }}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
              selectedType === type
                ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105"
                : "bg-white text-gray-700 border-2 border-gray-300 hover:border-blue-400 hover:shadow-md"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Exam Cards */}
      {currentExams.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">No exams found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentExams.map((exam) => {
            const difficultyColors = {
              Beginner: "bg-green-100 text-green-700 border-green-300",
              Moderate: "bg-yellow-100 text-yellow-700 border-yellow-300",
              Advanced: "bg-red-100 text-red-700 border-red-300"
            };
            const difficultyColor = difficultyColors[exam.type] || "bg-blue-100 text-blue-700 border-blue-300";

            return (
              <motion.div
                key={exam._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {exam.title}
                  </h3>
                </div>

                {/* Card Body */}
                <div className="p-6">
                  <div className="space-y-2 mb-5">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Subject:</span>
                      <span className="text-gray-900 font-medium">{exam.subject}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Category:</span>
                      <span className="text-gray-900 font-medium">{exam.category}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Duration:</span>
                      <span className="text-gray-900 font-medium">{exam.timeLimit} min</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Questions:</span>
                      <span className="text-gray-900 font-medium">{exam.numQuestions}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Total Marks:</span>
                      <span className="text-gray-900 font-medium">{exam.totalMarks}</span>
                    </div>
                  </div>

                  {/* Difficulty Badge */}
                  <div className="mb-4">
                    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${difficultyColor}`}>
                      {exam.type}
                    </span>
                  </div>

                  {/* Action Button */}
                  {(user?.role === "examinee" ||
                    user?.role === "trainer" ||
                    user?.role === "learner" ||
                    user?.role === "admin") ? (
                    <button
                      onClick={() => navigate(`/exam/start/${exam._id}`)}
                      className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Start Exam
                    </button>
                  ) : (
                    <p className="text-sm text-gray-400 text-center">Not authorized</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex flex-col items-center space-y-4">
          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-md text-sm font-medium border transition ${currentPage === 1
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : " text-white bg-blue-600 hover:bg-blue-700"
                }`}
            >
              Prev
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-md text-sm font-medium border transition ${currentPage === totalPages
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "text-white bg-blue-600 hover:bg-blue-700"
                }`}
            >
              Next
            </button>
          </div>

          <p className="text-sm text-gray-600">
            Page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </p>
        </div>
      )}

    </div>
  );
};

export default ExamList;
