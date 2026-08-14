const express = require('express');
const router = express.Router();
const Price = require('../models/Price');

// ✅ সব প্রাইস দেখুন
router.get('/', async (req, res) => {
  try {
    const prices = await Price.find().sort({ category: 1 });
    res.json({ success: true, prices });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ একটি প্রাইস আপডেট করুন
router.put('/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { pricePerKg, minKg, maxKg, description, isActive } = req.body;
    
    const price = await Price.findOneAndUpdate(
      { category },
      { 
        pricePerKg, 
        minKg, 
        maxKg, 
        description, 
        isActive,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!price) {
      return res.status(404).json({ success: false, error: 'Price not found' });
    }
    
    res.json({ success: true, price });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;