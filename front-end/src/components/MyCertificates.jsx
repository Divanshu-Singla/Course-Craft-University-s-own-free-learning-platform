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
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <svg
          className="w-6 h-6 text-yellow-500"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        <h3 className="text-xl font-bold text-gray-800">
          My Certificates ({certificates.length})
        </h3>
      </div>

      <div className="space-y-3">
        {certificates.map((cert, index) => (
          <motion.div
            key={cert.courseId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3"
          >
            <div className="flex items-center gap-3">
              <svg
                className="w-6 h-6 text-yellow-500 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <div className="flex-grow min-w-0">
                <h4 className="font-semibold text-gray-900 text-sm truncate">
                  {cert.courseName}
                </h4>
                <p className="text-xs text-green-600">Course Completed</p>
              </div>
              <button
                onClick={() => downloadCertificate(cert.courseId, cert.courseName)}
                className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex-shrink-0"
              >
                Download
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyCertificates;
