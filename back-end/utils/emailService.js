const nodemailer = require('nodemailer');
require('dotenv').config();

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD
  }
});

// Send contact form notification email
const sendContactNotification = async (contactData) => {
  const { name, email, message } = contactData;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Send to yourself
    subject: `New Contact Form Submission from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h2 style="color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px;">New Contact Form Submission</h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;"><strong style="color: #374151;">Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong style="color: #374151;">Email:</strong> ${email}</p>
          </div>
          
          <div style="margin: 20px 0; padding: 15px; background-color: #f9fafb; border-left: 4px solid #2563eb; border-radius: 5px;">
            <p style="margin: 0;"><strong style="color: #374151;">Message:</strong></p>
            <p style="margin: 10px 0; color: #4b5563; line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #6b7280; font-size: 14px;">This email was sent from CourseCraft Contact Form</p>
            <p style="color: #6b7280; font-size: 12px;">Reply directly to: ${email}</p>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Contact notification email sent successfully');
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send email', error };
  }
};

// Send auto-reply to user
const sendContactAutoReply = async (contactData) => {
  const { name, email } = contactData;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Thank you for contacting CourseCraft!',
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">CourseCraft</h1>
          </div>
          
          <h2 style="color: #1f2937;">Hello ${name}!</h2>
          
          <p style="color: #4b5563; line-height: 1.8; font-size: 16px;">
            Thank you for reaching out to us. We have received your message and our team will get back to you as soon as possible.
          </p>
          
          <div style="margin: 30px 0; padding: 20px; background-color: #eff6ff; border-radius: 8px; border-left: 4px solid #2563eb;">
            <p style="margin: 0; color: #1e40af; font-weight: 600;">Expected Response Time</p>
            <p style="margin: 10px 0 0 0; color: #4b5563;">We typically respond within 24-48 hours during business days.</p>
          </div>
          
          <p style="color: #4b5563; line-height: 1.8; font-size: 16px;">
            In the meantime, feel free to explore our courses and start your learning journey!
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="http://localhost:5173/courses" style="display: inline-block; padding: 12px 30px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">Browse Courses</a>
          </div>
          
          <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
            <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Best regards,</p>
            <p style="color: #2563eb; font-size: 16px; font-weight: 600; margin: 5px 0;">The CourseCraft Team</p>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
              This is an automated response. Please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Auto-reply email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Error sending auto-reply:', error);
    return { success: false, error };
  }
};

module.exports = {
  sendContactNotification,
  sendContactAutoReply
};
