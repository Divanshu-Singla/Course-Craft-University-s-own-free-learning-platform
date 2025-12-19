const { generateCertificateHTML } = require('../utils/certificateTemplate');
const Course = require('../models/Course');
const User = require('../models/User');

// Generate and download certificate
const generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Fetch course details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // Check enrollment
    const isEnrolled = user.enrolledCourses.some(
      enrolledCourseId => enrolledCourseId.toString() === courseId
    );
    
    if (!isEnrolled) {
      return res.status(404).json({ message: 'You are not enrolled in this course' });
    }

    // Check course progress
    const courseProgressData = user.courseProgress.find(
      progress => progress.courseId.toString() === courseId
    );

    if (!courseProgressData || courseProgressData.progressPercentage < 100) {
      const currentProgress = courseProgressData ? courseProgressData.progressPercentage : 0;
      return res.status(400).json({ 
        message: 'Course not completed yet. Complete all lessons to get certificate.',
        progress: currentProgress 
      });
    }

    // Generate certificate HTML
    const studentName = user.fullName || user.username;
    const courseTitle = course.title;
    const certificateHTML = generateCertificateHTML(studentName, courseTitle);

    // Send HTML response
    res.setHeader('Content-Type', 'text/html');
    res.send(certificateHTML);

  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).json({ message: 'Failed to generate certificate', error: error.message });
  }
};

// Check if user is eligible for certificate
const checkCertificateEligibility = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.json({ eligible: false, message: 'User not found' });
    }

    // Check enrollment
    const isEnrolled = user.enrolledCourses.some(
      enrolledCourseId => enrolledCourseId.toString() === courseId
    );
    
    if (!isEnrolled) {
      return res.json({ eligible: false, message: 'Not enrolled', progress: 0 });
    }

    // Get course progress
    const courseProgressData = user.courseProgress.find(
      progress => progress.courseId.toString() === courseId
    );

    const progress = courseProgressData ? courseProgressData.progressPercentage : 0;
    const eligible = progress >= 100;

    res.json({ 
      eligible, 
      progress,
      message: eligible ? 'Certificate available!' : 'Complete all lessons to unlock certificate'
    });

  } catch (error) {
    console.error('Error checking certificate eligibility:', error);
    res.status(500).json({ message: 'Failed to check eligibility', error: error.message });
  }
};

module.exports = {
  generateCertificate,
  checkCertificateEligibility
};
