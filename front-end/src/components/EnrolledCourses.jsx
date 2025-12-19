import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import CourseProgressBar from "./CourseProgressBar";
import axios from "axios";
import Cookies from "js-cookie";

const EnrolledCourses = ({ enrolledCourses }) => {
  const [progressData, setProgressData] = useState({});
  const coursesPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(enrolledCourses.length / coursesPerPage);
  const currentCourses = enrolledCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  useEffect(() => {
    const fetchAllProgress = async () => {
      const token = Cookies.get("token");
      if (!token) return;

      const progressPromises = enrolledCourses.map(async (course) => {
        try {
          const response = await axios.get(`http://localhost:5000/api/users/progress/${course._id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log(`Progress for ${course.title}:`, response.data.progress);
          return { courseId: course._id, progress: response.data.progress };
        } catch (error) {
          console.error(`Error fetching progress for course ${course._id}:`, error);
          return { courseId: course._id, progress: { progressPercentage: 0, totalCompleted: 0, completedLessons: [] } };
        }
      });

      const results = await Promise.all(progressPromises);
      const progressMap = {};
      results.forEach(({ courseId, progress }) => {
        progressMap[courseId] = progress;
      });
      setProgressData(progressMap);
    };

    if (enrolledCourses.length > 0) {
      fetchAllProgress();
    }
  }, [enrolledCourses]);

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl shadow-lg">
      <h3 className="text-2xl font-bold text-blue-800 mb-4">📚 My Enrolled Courses</h3>

      {currentCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentCourses.map((course) => {
            const progress = progressData[course._id] || { progressPercentage: 0, totalCompleted: 0, completedLessons: [] };
            const totalLessons = course.lessons?.length || 0;
            const completedCount = progress.completedLessons?.length || progress.totalCompleted || 0;

            return (
              <div
                key={course._id}
                className="flex flex-col justify-between p-5 bg-white rounded-xl border border-blue-200 shadow-md hover:shadow-xl transition"
              >
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-1">{course.title}</h4>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-3">{course.description}</p>

                  <div className="mt-3">
                    <div className="flex justify-between items-center text-sm text-gray-700 mb-2">
                      <span className="font-medium">Progress:</span>
                      <span className="font-bold text-blue-600">
                        {Math.round(progress.progressPercentage || 0)}%
                      </span>
                    </div>
                    <CourseProgressBar 
                      progressPercentage={progress.progressPercentage || 0}
                      completedLessons={completedCount}
                      totalLessons={totalLessons}
                    />
                  </div>
                </div>
              
                <Link
                  to={`/CourseDetails/${course._id}`}
                  className="mt-4 self-start px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
                >
                  Go to Course
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">You haven't enrolled in any courses yet.</p>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 text-sm rounded-md ${
              currentPage === 1
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Prev
          </button>
          <span className="font-semibold text-gray-800">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 text-sm rounded-md ${
              currentPage === totalPages
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default EnrolledCourses;
