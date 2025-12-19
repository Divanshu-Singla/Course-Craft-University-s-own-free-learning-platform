import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { motion } from 'framer-motion';

const MyCertificates = ({ enrolledCourses }) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAllCertificates();
  }, [enrolledCourses]);

  const checkAllCertificates = async () => {
    if (!enrolledCourses || enrolledCourses.length === 0) {
      setLoading(false);
      return;
    }

    try {
      const token = Cookies.get('token');
      const certificateChecks = await Promise.all(
        enrolledCourses.map(async (course) => {
          try {
            const response = await axios.get(
              `http://localhost:5000/api/certificates/check/${course._id}`,
              {
                headers: { Authorization: `Bearer ${token}` }
              }
            );
            if (response.data.eligible) {
              return {
                courseId: course._id,
                courseName: course.title,
                thumbnail: course.thumbnail,
                eligible: true
              };
            }
            return null;
          } catch (error) {
            console.error(`Error checking certificate for ${course.title}:`, error);
            return null;
          }
        })
      );

      const completedCertificates = certificateChecks.filter(cert => cert !== null);
      setCertificates(completedCertificates);
      setLoading(false);
    } catch (error) {
      console.error('Error checking certificates:', error);
      setLoading(false);
    }
  };

  const downloadCertificate = async (courseId, courseName) => {
    try {
      const token = Cookies.get('token');
      const response = await axios.get(
        `http://localhost:5000/api/certificates/generate/${courseId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'text'
        }
      );
      
      // Create a blob from the HTML and download it
      const blob = new Blob([response.data], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${courseName.replace(/\s+/g, '_')}_Certificate.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert('Failed to download certificate. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading certificates...</p>
      </div>
    );
  }

  if (certificates.length === 0) {
    return (
      <div className="bg-gray-50 p-8 rounded-lg text-center">
        <svg
          className="w-16 h-16 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p className="text-gray-600 text-lg">No certificates earned yet</p>
        <p className="text-gray-500 text-sm mt-2">Complete courses to earn certificates!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <svg
          className="w-8 h-8 text-yellow-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <h3 className="text-2xl font-bold text-gray-800">
          My Certificates ({certificates.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert, index) => (
          <motion.div
            key={cert.courseId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white border-2 border-blue-200 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <div className="relative h-40 bg-gradient-to-br from-blue-600 to-purple-600">
              {cert.thumbnail ? (
                <img
                  src={cert.thumbnail}
                  alt={cert.courseName}
                  className="w-full h-full object-cover opacity-30"
                />
              ) : null}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-white opacity-80"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">
                {cert.courseName}
              </h4>
              <div className="flex items-center gap-2 text-sm text-green-600 mb-3">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold">Course Completed</span>
              </div>
              <button
                onClick={() => downloadCertificate(cert.courseId, cert.courseName)}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                📥 Download Certificate
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyCertificates;
