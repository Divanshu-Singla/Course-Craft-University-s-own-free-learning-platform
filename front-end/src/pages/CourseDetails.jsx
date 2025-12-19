import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCourse } from "../contexts/CourseContext";
import { useAuth } from "../contexts/AuthContext";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { selectedCourse, loading, error, enrolledCourses, fetchCourseById, enrollCourse, getEnrolledCourses } = useCourse();
  const { token } = useAuth();
  const [showLessons, setShowLessons] = useState(false);
  const [expandedSyllabusIndex, setExpandedSyllabusIndex] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

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

  if (loading) return <p className="text-center text-lg">Loading course details...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!selectedCourse) return <p className="text-center">Course not found.</p>;

  const handleToggleLessons = () => {
    setShowLessons(!showLessons);
    // Auto-select first lesson when opening
    if (!showLessons && selectedCourse?.lessons?.length > 0) {
      setSelectedLesson(selectedCourse.lessons[0]);
    }
  };

  const toggleSyllabus = (index) => {
    setExpandedSyllabusIndex(expandedSyllabusIndex === index ? null : index);
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
      // ✅ Immediately update enrolled courses without needing a refresh
      getEnrolledCourses();
    } catch (err) {
      console.error("Enrollment failed:", err);
    }
  };


  return (
    <div className="max-w-full mx-auto mt-2 text-white">
      {/* <button
      onClick={() => navigate(-1)}
      className="mb-2 mx-6 px-4 py-1 bg-gray-800 text-white hover:bg-gray-700 rounded transition"
    >
      ← Back
    </button> */}

      {/* Header Section */}
      <div className="grid grid-cols-1 text-white md:grid-cols-5 gap-5 p-6 bg-white shadow-lg border border-gray-200 bg-gradient-to-r from-blue-700 to-blue-500
">
        {/* Course Information */}
        <div className="col-span-1 md:col-span-3 mt-2 md:mt-0">
          <h1 className="text-2xl md:text-3xl font-bold ">
            {selectedCourse.title}
          </h1>
          <p className="text-gray-300 mt-2 text-sm md:text-base">
            {selectedCourse.description}
          </p>

          {/* Additional Details */}
          <div className="flex items-center gap-4 text-sm mt-3">
            <p>
              <strong>Category:</strong> {selectedCourse.category}
            </p>
            <p>
              <strong>Certification:</strong>{" "}
              {selectedCourse.certificationAvailable ? "Yes" : "No"}
            </p>
            <p>
              <strong>Duration: </strong>{selectedCourse.duration} Hrs
            </p>
            <p> <strong>Level: </strong> {selectedCourse.level || "Beginner"}</p>
          </div>

          {/* Prerequisites */}
          {selectedCourse.prerequisites && (
            <p className="text-sm mt-3">
              <strong>Prerequisites:</strong> {selectedCourse.prerequisites}
            </p>
          )}

          {/* Pricing and Enrollment */}
          <div className="mt-4">
            <div className="text-lg font-bold text-white">₹{selectedCourse.price || "449"}</div>
            {isAlreadyEnrolled ? (
              <button className="bg-white text-blue-700 px-5 py-2 mt-2 font-bold border-2 border-white hover:bg-blue-500 hover:text-white cursor-not-allowed">
                Already Enrolled
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={loading}
                className="bg-white text-blue-700 px-5 py-2 mt-2 font-bold border-2 border-white hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                {loading ? "Enrolling..." : "Enroll Now"}
              </button>
            )}
          </div>
        </div>


        {/* Course Thumbnail on the Right Side */}
        <div className="col-span-1 md:col-span-2 relative w-full h-52 md:h-60 bg-gray-300 rounded-lg overflow-hidden shadow-lg">
          <img
            src={selectedCourse.thumbnail || "https://via.placeholder.com/800x400"}
            alt={selectedCourse.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>


      {/* Show Lessons Button */}
      <div className="mt-6 mx-6">

        <button
          onClick={handleToggleLessons}
          className="bg-blue-600 text-white font-bold px-4 py-2 hover:bg-blue-700 transition-all"
        >
          {showLessons ? "Hide Lessons" : "Show Lessons"}
        </button>

        {showLessons && (
          <div className="mt-8 text-black">
            <h2 className="text-3xl font-bold mb-6">Course Lessons</h2>

            {selectedCourse?.lessons?.length > 0 ? (
              <div className="flex gap-6 min-h-[600px]">
                {/* Left Sidebar - Lessons List */}
                <div className="w-1/3 bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-4">
                    <h3 className="text-xl font-bold">Lessons ({selectedCourse.lessons.length})</h3>
                  </div>
                  <div className="overflow-y-auto max-h-[550px]">
                    {selectedCourse.lessons.map((lesson, index) => {
                      const isSample = index === 0;
                      const canAccess = isAlreadyEnrolled || isSample;
                      const isSelected = selectedLesson?._id === lesson._id;

                      return (
                        <div
                          key={lesson._id}
                          onClick={() => setSelectedLesson(lesson)}
                          className={`p-4 border-b border-gray-200 cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'bg-blue-50 border-l-4 border-l-blue-600' 
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                              isSelected 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-600'
                            }`}>
                              {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 truncate">
                                {lesson.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1">
                                {lesson.videoUrl && (
                                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                                    📹 Video
                                  </span>
                                )}
                                {lesson.imageUrl && (
                                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                                    🖼️ Image
                                  </span>
                                )}
                                {isSample && !isAlreadyEnrolled && (
                                  <span className="text-xs bg-yellow-300 text-black px-2 py-0.5 rounded font-semibold">
                                    Sample
                                  </span>
                                )}
                                {!canAccess && (
                                  <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                                    🔒 Locked
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Side - Selected Lesson Content */}
                <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
                  {selectedLesson ? (
                    <>
                      {/* Lesson Header */}
                      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white p-6">
                        <h3 className="text-2xl font-bold mb-2">{selectedLesson.title}</h3>
                        {selectedLesson.description && (
                          <p className="text-blue-100">{selectedLesson.description}</p>
                        )}
                      </div>

                      {/* Lesson Media Content */}
                      <div className="p-6">
                        {(() => {
                          const lessonIndex = selectedCourse.lessons.findIndex(l => l._id === selectedLesson._id);
                          const isSample = lessonIndex === 0;
                          const canAccess = isAlreadyEnrolled || isSample;

                          if (!canAccess) {
                            return (
                              <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg">
                                <div className="text-center p-8">
                                  <div className="text-6xl mb-4">🔒</div>
                                  <h4 className="text-2xl font-bold text-gray-800 mb-2">
                                    This lesson is locked
                                  </h4>
                                  <p className="text-gray-600 mb-6">
                                    Enroll in this course to unlock all lessons
                                  </p>
                                  <button
                                    onClick={handleEnroll}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all font-semibold"
                                  >
                                    Enroll Now - ₹{selectedCourse.price || "449"}
                                  </button>
                                </div>
                              </div>
                            );
                          }

                          if (selectedLesson.videoUrl) {
                            return (
                              <div className="bg-black rounded-lg overflow-hidden">
                                <video
                                  src={selectedLesson.videoUrl}
                                  controls
                                  className="w-full h-auto max-h-[500px]"
                                  controlsList="nodownload"
                                />
                              </div>
                            );
                          }

                          if (selectedLesson.imageUrl) {
                            return (
                              <div className="flex justify-center bg-gray-50 rounded-lg p-4">
                                <img
                                  src={selectedLesson.imageUrl}
                                  alt={selectedLesson.title}
                                  className="max-w-full h-auto max-h-[500px] rounded-lg shadow-md object-contain"
                                />
                              </div>
                            );
                          }

                          return (
                            <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
                              <div className="text-center text-gray-500">
                                <div className="text-5xl mb-3">📄</div>
                                <p className="text-lg">No media available for this lesson</p>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <div className="text-6xl mb-4">👈</div>
                        <p className="text-xl">Select a lesson from the list to view content</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-lg text-center text-gray-500 bg-gray-100 py-8 rounded-lg">
                🚫 No lessons available for this course.
              </p>
            )}
          </div>
        )}



      </div>

      {/* Syllabus Section */}
      <div className="mt-8 mx-6">
        <h3 className="text-3xl font-bold mb-5 text-gray-900">Syllabus</h3>
        <div className="space-y-4">
          {selectedCourse.syllabus && selectedCourse.syllabus.length > 0 ? (
            selectedCourse.syllabus.map((module, index) => (
              <div
                key={index}
                className="border border-gray-300 p-5 m-5 rounded-lg bg-gray-50 hover:shadow-md transition-all duration-300"
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