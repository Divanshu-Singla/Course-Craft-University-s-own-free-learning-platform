import React, { useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [message, setMessage] = useState({ text: '', type: '' }); // For success/error messages

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/contact', formData);
      console.log(response.data);

      // Show success message
      setMessage({ text: 'Message sent successfully!', type: 'success' });

      // Clear the form
      setFormData({ name: '', email: '', message: '' });

      // Clear the message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting form:', error);

      // Show error message
      setMessage({ text: 'Failed to send message. Please try again.', type: 'error' });

      // Clear the message after 3 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 3000);
    }
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Title Section */}
      <motion.div className="text-center mb-16">
      <motion.h1
        className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        variants={itemVariants}
      >
        Get in Touch
      </motion.h1>
      <motion.p
        className="text-lg text-gray-700 max-w-2xl mx-auto"
        variants={itemVariants}
      >
        Have a question or feedback? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
      </motion.p>
      </motion.div>

      {/* Success/Error Message */}
      {message.text && (
        <motion.div
          className={`p-4 mb-6 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
          variants={itemVariants}
        >
          {message.text}
        </motion.div>
      )}

      {/* Contact Form */}
      <motion.section
        className="mb-16"
        variants={itemVariants}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <h2 className="text-2xl font-bold text-white">Send a Message</h2>
            <p className="text-blue-100 text-sm mt-1">Fill out the form below and we'll get back to you shortly</p>
          </div>
        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="name">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Write your message here..."
              rows="6"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3.5 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Send Message
          </button>
        </form>
        </div>
      </motion.section>

      {/* Contact Information */}
      <motion.section
        className="mb-16"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Address */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border-t-4 border-blue-500"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
                <span className="text-white text-2xl">📍</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Address</h3>
            </div>
            <p className="text-gray-600 leading-relaxed ml-16">Chitkara University, Rajpura, Punjab</p>
          </motion.div>

          {/* Phone */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border-t-4 border-purple-500"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
                <span className="text-white text-2xl">📞</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Phone</h3>
            </div>
            <p className="text-gray-600 ml-16">+91 999 999 999</p>
          </motion.div>

          {/* Email */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border-t-4 border-pink-500"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center mr-4 shadow-md">
                <span className="text-white text-2xl">✉️</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900">Email</h3>
            </div>
            <p className="text-gray-600 ml-16">coursecraft@gmail.com</p>
          </motion.div>
        </div>
      </motion.section>

      {/* Map */}
      <motion.section
        className="mb-12"
        variants={itemVariants}
      >
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">Find Us</h2>
        <div className="bg-white p-4 rounded-2xl shadow-2xl overflow-hidden">
          <iframe
            title="Google Maps Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3437.175193239825!2d76.65738931512283!3d30.516321481707595!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fc32344a6e2d7%3A0x81b346dee91799ca!2sChitkara%20University!5e0!3m2!1sen!2sin!4v1734607200000!5m2!1sen!2sin"
            width="100%"
            height="450"
            className="rounded-xl"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </motion.section>
      </div>
    </motion.div>
  );
};

export default ContactPage;