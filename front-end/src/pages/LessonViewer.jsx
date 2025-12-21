import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourse } from "../contexts/CourseContext";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import Cookies from "js-cookie";

const LessonViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCourse, fetchCourseById } = useCourse();
  const { token } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [courseProgress, setCourseProgress] = useState({ completedLessons: [], progressPercentage: 0 });
  
  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    if (id) {
      fetchCourseById(id).then(() => {
        // Auto-select first lesson
        if (selectedCourse?.lessons?.length > 0) {
          setSelectedLesson(selectedCourse.lessons[0]);
        }
      }).catch(err => {
        console.error("Failed to fetch course:", err);
      });
    }
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (token && id) {
      fetchProgress();
    }
  }, [token, id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProgress = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(`${API_URL}/users/progress/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourseProgress(response.data.progress);
    } catch (error) {
      console.error("Error fetching progress:", error);
    }
  };

  const markLessonComplete = async (lessonId) => {
    try {
      const token = Cookies.get("token");
      await axios.post(
        `${API_URL}/users/progress/lesson-complete`,
        { courseId: id, lessonId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchProgress();
    } catch (error) {
      console.error("Error marking lesson complete:", error);
    }
  };

  if (!selectedCourse) return <p className="text-center mt-10">Loading...</p>;

  const isLessonCompleted = selectedLesson && courseProgress.completedLessons?.includes(selectedLesson._id);

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Header with Course Name and Progress */}
      <div className="bg-white shadow-md sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/CourseDetails/${id}`)}
              className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2"
            >
              ← Back to Course
            </button>
            <h1 className="text-lg md:text-xl font-bold text-gray-800 flex-1 text-center">
              {selectedCourse.title}
            </h1>
            <div className="w-24"></div>
          </div>
          
          {/* Thinner Progress Bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                style={{ width: `${courseProgress.progressPercentage || 0}%` }}
                className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-300"
              />
            </div>
            <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">
              {courseProgress.totalCompleted || 0} / {selectedCourse.lessons?.length || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex max-w-7xl mx-auto mt-4 gap-4 px-4">
        {/* Left Sidebar - Lesson List */}
        <div className="w-80 bg-white rounded-lg shadow-lg p-4 max-h-[calc(100vh-180px)] overflow-y-auto sticky top-24">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Course Content</h2>
          <div className="space-y-2">
            {selectedCourse.lessons?.map((lesson, index) => {
              const isCompleted = courseProgress.completedLessons?.includes(lesson._id);
              const isSelected = selectedLesson?._id === lesson._id;
              const isSample = lesson.isSampleLesson;
              
              return (
                <div
                  key={lesson._id}
                  onClick={() => setSelectedLesson(lesson)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-800"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {isCompleted && (
                      <span className={`text-lg ${isSelected ? "text-white" : "text-green-600"}`}>
                        ✓
                      </span>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold ${isSelected ? "text-white" : "text-gray-500"}`}>
                          Lesson {index + 1}
                        </span>
                        {isSample && (
                          <span className="text-xs bg-yellow-400 text-black px-2 py-0.5 rounded font-semibold">
                            Free
                          </span>
                        )}
                      </div>
                      <h3 className={`font-semibold text-sm ${isSelected ? "text-white" : "text-gray-800"}`}>
                        {lesson.title}
                      </h3>
                      {isCompleted && (
                        <span className={`text-xs ${isSelected ? "text-white" : "text-green-600"} font-semibold`}>
                          ✓ Done
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side - Lesson Content */}
        <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
          {selectedLesson ? (
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2 text-gray-800">{selectedLesson.title}</h2>
              <p className="text-gray-600 mb-6">{selectedLesson.description}</p>

              {/* Video Content */}
              {selectedLesson.videoUrl && (
                <div className="mb-6">
                  <div className="bg-black rounded-lg overflow-hidden">
                    <video
                      src={selectedLesson.videoUrl}
                      controls
                      className="w-full h-auto max-h-[500px]"
                      controlsList="nodownload"
                    />
                  </div>
                </div>
              )}

              {/* Image Content */}
              {selectedLesson.imageUrl && !selectedLesson.videoUrl && (
                <div className="mb-6">
                  <div className="flex justify-center bg-gray-50 rounded-lg p-4">
                    <img
                      src={selectedLesson.imageUrl}
                      alt={selectedLesson.title}
                      className="max-w-full h-auto max-h-[500px] rounded-lg shadow-md object-contain"
                    />
                  </div>
                </div>
              )}

              {/* No Media Available */}
              {!selectedLesson.videoUrl && !selectedLesson.imageUrl && (
                <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg mb-6">
                  <div className="text-center text-gray-500">
                    <div className="text-5xl mb-3">📄</div>
                    <p className="text-lg">No media available for this lesson</p>
                  </div>
                </div>
              )}

              {/* Mark as Complete Button */}
              {!isLessonCompleted && (
                <button
                  onClick={() => markLessonComplete(selectedLesson._id)}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-lg hover:from-green-700 hover:to-green-800 transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <span className="text-2xl">✓</span>
                  <span>Mark as Complete</span>
                </button>
              )}

              {/* Completed State */}
              {isLessonCompleted && (
                <div className="w-full bg-gradient-to-r from-green-100 to-green-50 border-2 border-green-600 text-green-800 px-6 py-4 rounded-lg text-center font-bold text-lg shadow-md flex items-center justify-center gap-2">
                  <span className="text-2xl">✓</span>
                  <span>Lesson Completed</span>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-96">
              <p className="text-gray-500 text-lg">Select a lesson to start learning</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonViewer;
