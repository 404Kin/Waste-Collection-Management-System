// backend/utils/sendEmail.js
const nodemailer = require('nodemailer');

const sendEmail = async ({ name, email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: email,
      to: 'admin@wastecollect.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `
    });
    
    return true;
  } catch (error) {
    console.error('Email error:', error);
    return false;
  }
};