const express = require('express');
const router = express.Router();
const { generateCertificate, checkCertificateEligibility } = require('../controllers/certificateController');
const protect = require('../middlewares/authMiddleware');

// Check certificate eligibility
router.get('/check/:courseId', protect(), checkCertificateEligibility);

// Generate and view certificate
router.get('/generate/:courseId', protect(), generateCertificate);

module.exports = router;
