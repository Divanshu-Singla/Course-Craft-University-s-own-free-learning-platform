import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourse } from "../contexts/CourseContext";
import { useAuth } from "../contexts/AuthContext";
import CourseProgressBar from "../components/CourseProgressBar";
import CertificateButton from "../components/CertificateButton";
import axios from "axios";
import Cookies from "js-cookie";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCourse, loading, error, enrolledCourses, fetchCourseById, enrollCourse, getEnrolledCourses } = useCourse();
  const { token } = useAuth();
  const [expandedSyllabusIndex, setExpandedSyllabusIndex] = useState(null);
  const [courseProgress, setCourseProgress] = useState({ completedLessons: [], progressPercentage: 0 });

  useEffect(() => {
    if (id) {
      fetchCourseById(id).catch(err => {
        console.error("Failed to fetch course:", err);
      });
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (token) {
      getEnrolledCourses().catch(err => {
        console.error("Failed to fetch enrolled courses:", err);
      });
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const isEnrolled = enrolledCourses?.some(course => course._id === id);
    if (token && id && isEnrolled) {
      fetchProgress();
    }
  }, [token, id, enrolledCourses]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProgress = async () => {
    try {
      const token = Cookies.get("token");
      const API_URL = import.meta.env.VITE_API_URL || '/api';
      const response = await axios.get(`${API_URL}/users/progress/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourseProgress(response.data.progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  if (loading) return <p className="text-center text-lg">Loading course details...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!selectedCourse) return <p className="text-center">Course not found.</p>;

  const toggleSyllabus = (index) => {
    setExpandedSyllabusIndex(expandedSyllabusIndex === index ? null : index);
  };

  const handleContinueLearning = () => {
    navigate(`/learn/${id}`);
  };

  const isAlreadyEnrolled = enrolledCourses?.some(course => course._id === selectedCourse._id);

  const handleEnroll = async () => {
    if (!token) {
      alert("Please login to enroll.");
      return;
    }

    if (isAlreadyEnrolled) {
      alert("You are already enrolled in this course.");
      return;
    }

    try {
      await enrollCourse(selectedCourse._id);
      getEnrolledCourses();
    } catch (err) {
      console.error("Enrollment failed:", err);
    }
  };

  return (
    <div className="max-w-full mx-auto mt-2 text-white mb-10">
      {/* Header Section */}
      <div className="grid grid-cols-1 text-white md:grid-cols-5 gap-5 p-6 bg-white shadow-lg border border-gray-200 bg-gradient-to-r from-blue-700 to-blue-500">
        {/* Course Information */}
        <div className="col-span-1 md:col-span-3 mt-2 md:mt-0">
          <h1 className="text-2xl md:text-3xl font-bold">
            {selectedCourse.title}
          </h1>
          <p className="text-gray-300 mt-2 text-sm md:text-base">
            {selectedCourse.description}
          </p>

          {/* Additional Details */}
          <div className="flex items-center gap-4 text-sm mt-3 flex-wrap">
            <p>
              <strong>Category:</strong> {selectedCourse.category}
            </p>
            <p>
              <strong>Certification:</strong>{" "}
              {selectedCourse.certificationAvailable ? "Yes" : "No"}
            </p>
            <p>
              <strong>Duration:</strong> {selectedCourse.duration} Hrs
            </p>
            <p>
              <strong>Level:</strong> {selectedCourse.level || "Beginner"}
            </p>
          </div>

          {/* Prerequisites */}
          {selectedCourse.prerequisites && (
            <p className="text-sm mt-3">
              <strong>Prerequisites:</strong> {selectedCourse.prerequisites}
            </p>
          )}

          {/* Enrollment */}
          <div className="mt-4">
            {isAlreadyEnrolled ? (
              <>
                <button 
                  onClick={handleContinueLearning}
                  className="bg-white text-blue-700 px-6 py-3 mt-2 font-bold border-2 border-white hover:bg-blue-500 hover:text-white transition-all duration-300 rounded-lg shadow-lg"
                >
                  Continue Learning →
                </button>
                <div className="mt-3 bg-white bg-opacity-20 px-3 py-2 rounded-lg">
                  <div className="flex justify-between items-center text-sm mb-1.5 text-gray-900">
                    <span className="font-semibold">Course Progress</span>
                    <span className="font-bold">
                      {courseProgress.totalCompleted || 0} / {selectedCourse.lessons?.length || 0} Lessons
                    </span>
                  </div>
                  <CourseProgressBar 
                    progressPercentage={courseProgress.progressPercentage || 0}
                    completedLessons={courseProgress.totalCompleted || 0}
                    totalLessons={selectedCourse.lessons?.length || 0}
                  />
                </div>
              </>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={loading}
                className="bg-white text-blue-700 px-6 py-3 mt-2 font-bold border-2 border-white hover:bg-blue-500 hover:text-white transition-all duration-300 rounded-lg shadow-lg"
              >
                {loading ? "Enrolling..." : "Enroll Now"}
              </button>
            )}
          </div>
        </div>

        {/* Course Thumbnail */}
        <div className="col-span-1 md:col-span-2 relative w-full h-52 md:h-60 bg-gray-300 rounded-lg overflow-hidden shadow-lg">
          <img
            src={selectedCourse.thumbnail || "https://via.placeholder.com/800x400"}
            alt={selectedCourse.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Certificate Section */}
      {isAlreadyEnrolled && (
        <div className="mt-8 mx-6">
          <CertificateButton courseId={id} courseName={selectedCourse.title} />
        </div>
      )}

      {/* Course Content Overview */}
      <div className="mt-8 mx-6">
        <h3 className="text-3xl font-bold mb-5 text-gray-900">What You'll Learn</h3>
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selectedCourse?.lessons?.length > 0 ? (
              selectedCourse.lessons.map((lesson, index) => (
                <div key={lesson._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                    {lesson.description && (
                      <p className="text-sm text-gray-600 mt-1">{lesson.description}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 col-span-2">No lessons available yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* Syllabus Section */}
      <div className="mt-8 mx-6 mb-8">
        <h3 className="text-3xl font-bold mb-5 text-gray-900">Course Syllabus</h3>
        <div className="space-y-4">
          {selectedCourse.syllabus && selectedCourse.syllabus.length > 0 ? (
            selectedCourse.syllabus.map((module, index) => (
              <div
                key={index}
                className="border border-gray-300 p-5 rounded-lg bg-white hover:shadow-md transition-all duration-300"
              >
                <button
                  onClick={() => toggleSyllabus(index)}
                  className="w-full text-left font-semibold text-lg flex justify-between items-center focus:outline-none"
                >
                  <span className="text-gray-900">{module.title}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600 text-sm">Module Details</span>
                    <span className="text-gray-600">
                      {expandedSyllabusIndex === index ? "▲" : "▼"}
                    </span>
                  </div>
                </button>
                {expandedSyllabusIndex === index && (
                  <div className="mt-3 text-gray-700 transition-all duration-300">
                    <p className="mt-2 bg-gray-100 p-4 rounded-lg">
                      {module.description}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-700 text-lg">No syllabus available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
