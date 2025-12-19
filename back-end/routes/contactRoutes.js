const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { sendContactNotification, sendContactAutoReply } = require('../utils/emailService');

// Submit contact form
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Save to database first (most important)
    const newContact = new Contact({ name, email, message });
    await newContact.save();

    // Try to send emails (non-blocking, won't fail the request if email fails)
    try {
      await sendContactNotification({ name, email, message });
      await sendContactAutoReply({ name, email });
      console.log('✅ Emails sent successfully');
    } catch (emailError) {
      console.error('⚠️ Email sending failed (but message was saved):', emailError.message);
      // Continue - don't fail the request if email fails
    }

    res.status(201).json({ 
      message: 'Message sent successfully! We will get back to you soon.' 
    });
  } catch (error) {
    console.error('❌ Error processing contact form:', error);
    res.status(500).json({ 
      message: 'Server error. Please try again later.' 
    });
  }
});

module.exports = router;