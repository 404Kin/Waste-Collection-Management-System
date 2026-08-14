const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// ✅ নতুন মেসেজ পাঠান
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message, userId } = req.body;
    
    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, subject and message are required'
      });
    }

    const contact = new Contact({
      name,
      email,
      phone: phone || '',
      subject,
      message,
      userId: userId || '',
      status: 'pending'
    });

    await contact.save();
    
    
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully!',
      data: contact
    });
  } catch (error) {
    console.error('❌ Contact Error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


router.get('/', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      count: messages.length,
      messages
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }
    res.json({
      success: true,
      message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Status updated successfully',
      data: message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const message = await Contact.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found'
      });
    }
    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;