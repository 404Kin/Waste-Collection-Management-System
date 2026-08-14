const express = require('express');
const router = express.Router();
const RecyclingCenter = require('../models/RecyclingCenter');

// ✅ Get All Recycling Centers
router.get('/', async (req, res) => {
  try {
    const centers = await RecyclingCenter.find({ isActive: true });
    console.log(`✅ Found ${centers.length} recycling centers`);
    res.json({ success: true, centers });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ Get Single Recycling Center by ID
router.get('/:id', async (req, res) => {
  try {
    const center = await RecyclingCenter.findById(req.params.id);
    if (!center) {
      return res.status(404).json({ success: false, error: 'Center not found' });
    }
    res.json({ success: true, center });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;