import React from 'react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const AboutUsPage = () => {
  return (
    <motion.div
      className="max-w-7xl mx-auto px-4 py-12"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Hero Section */}
      <motion.div
        className="text-center mb-16"
        variants={itemVariants}
      >
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
          About Course-Craft
        </h1>
        <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto">
          Course-Craft is a <span className="font-semibold text-blue-600">university-driven digital learning platform</span> designed to make education accessible, flexible, and continuous for every student.
        </p>
      </motion.div>

      {/* Main Description */}
      <motion.section
        className="mb-16 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12 shadow-lg"
        variants={itemVariants}
      >
        <p className="text-lg text-gray-700 leading-relaxed mb-6">
          In today's fast-paced academic environment, <span className="font-semibold text-gray-900">missing a lecture should never mean missing learning</span>. Course-Craft bridges this gap by providing a centralized platform where professors and teachers can upload video lectures, notes, and course materials, allowing students to access them anytime, anywhere.
        </p>
        <p className="text-lg text-gray-700 leading-relaxed">
          Whether a student is absent due to health, events, or personal reasons—or simply wants to revise a topic—Course-Craft ensures that <span className="font-semibold text-blue-600">learning never stops</span>. All academic resources are available in one integrated platform, making studying more organized, efficient, and stress-free.
        </p>
      </motion.section>

      {/* Mission & Vision Grid */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        {/* Mission */}
        <motion.section
          className="bg-white rounded-2xl p-8 shadow-xl border-t-4 border-blue-600 hover:shadow-2xl transition-shadow duration-300"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">
            To empower students with <span className="font-semibold text-blue-600">uninterrupted access to quality education</span> by creating a reliable, university-owned learning platform that supports both teaching and self-paced learning.
          </p>
        </motion.section>

        {/* Vision */}
        <motion.section
          className="bg-white rounded-2xl p-8 shadow-xl border-t-4 border-purple-600 hover:shadow-2xl transition-shadow duration-300"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">Our Vision</h2>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">
            To build a <span className="font-semibold text-purple-600">smart, inclusive, and student-centric</span> digital learning ecosystem that enhances classroom education and promotes academic success.
          </p>
        </motion.section>
      </div>

      {/* Why Course-Craft Section */}
      <motion.section
        className="mb-16"
        variants={itemVariants}
      >
        <h2 className="text-4xl font-bold text-center mb-10 text-gray-800">
          Why <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Course-Craft</span>?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-l-4 border-blue-500"
            variants={itemVariants}
          >
            <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-800 mb-2 text-lg">Centralized Access</h3>
            <p className="text-gray-600 text-sm">Access all lectures and study materials in one place</p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-l-4 border-green-500"
            variants={itemVariants}
          >
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-800 mb-2 text-lg">Easy Revision</h3>
            <p className="text-gray-600 text-sm">Catch up on missed classes and revise anytime</p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-l-4 border-purple-500"
            variants={itemVariants}
          >
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-800 mb-2 text-lg">Secure Content</h3>
            <p className="text-gray-600 text-sm">University-controlled and protected resources</p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-l-4 border-pink-500"
            variants={itemVariants}
          >
            <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-800 mb-2 text-lg">User-Friendly</h3>
            <p className="text-gray-600 text-sm">Simple, intuitive, and student-friendly interface</p>
          </motion.div>
        </div>
      </motion.section>

    </motion.div>
  );
};

export default AboutUsPage;
