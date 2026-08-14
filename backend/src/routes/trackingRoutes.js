const express = require('express');
const router = express.Router();
const Tracking = require('../models/Tracking');
const Pickup = require('../models/Pickup');
const Driver = require('../models/Driver');

// ✅ ড্রাইভারের লোকেশন আপডেট করুন (Auto Driver Name)
router.post('/update', async (req, res) => {
  try {
    const { pickupId, driverId, lat, lng, address, status } = req.body;

    // 🔍 ড্রাইভারের নাম Auto খুঁজুন
    const driver = await Driver.findOne({ driverId: driverId });
    const driverName = driver?.name || 'Unknown Driver';

    let tracking = await Tracking.findOne({ pickupId });

    if (!tracking) {
      tracking = new Tracking({
        pickupId,
        driverId,
        driverName: driverName,  // ✅ Auto নাম আসবে
        location: { lat, lng, address: address || '' },
        status: status || 'en_route',
        history: [{ location: { lat, lng }, timestamp: new Date() }]
      });
    } else {
      tracking.location = { lat, lng, address: address || '' };
      tracking.status = status || tracking.status;
      tracking.driverName = driverName;  // ✅ নাম আপডেট হবে
      tracking.updatedAt = new Date();
      tracking.history.push({ location: { lat, lng }, timestamp: new Date() });
      
      if (tracking.history.length > 100) {
        tracking.history = tracking.history.slice(-100);
      }
    }

    await tracking.save();

    // পিকআপের স্ট্যাটাস আপডেট করুন
    if (status === 'completed') {
      await Pickup.findByIdAndUpdate(pickupId, { status: 'completed' });
    } else if (status === 'en_route' || status === 'arrived') {
      await Pickup.findByIdAndUpdate(pickupId, { status: 'assigned' });
    }

    res.json({ 
      success: true, 
      tracking,
      driverName: driverName 
    });
  } catch (error) {
    console.error('❌ Tracking update error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ ইউজার ট্র্যাকিং দেখুন (Auto Driver Name)
router.get('/:pickupId', async (req, res) => {
  try {
    const tracking = await Tracking.findOne({ pickupId: req.params.pickupId });
    
    if (!tracking) {
      return res.status(404).json({ 
        success: false, 
        error: 'Tracking not found' 
      });
    }

    // 🔍 ড্রাইভারের নাম Auto খুঁজুন
    const driver = await Driver.findOne({ driverId: tracking.driverId });
    
    res.json({
      success: true,
      tracking: {
        ...tracking.toObject(),
        driverName: driver?.name || tracking.driverName || 'Unknown Driver',
        driverPhone: driver?.phone || 'N/A'
      }
    });
  } catch (error) {
    console.error('❌ Get tracking error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ✅ অ্যাডমিন সব ট্র্যাকিং দেখুন (Auto Driver Name)
router.get('/admin/all', async (req, res) => {
  try {
    const trackings = await Tracking.find()
      .sort({ updatedAt: -1 })
      .populate('pickupId', 'address userName wasteType');
    
    // 🔍 প্রতিটি ট্র্যাকিং এর জন্য ড্রাইভারের নাম Auto খুঁজুন
    const enrichedTrackings = await Promise.all(trackings.map(async (track) => {
      const driver = await Driver.findOne({ driverId: track.driverId });
      return {
        ...track.toObject(),
        driverName: driver?.name || track.driverName || 'Unknown'
      };
    }));
    
    res.json({ success: true, trackings: enrichedTrackings });
  } catch (error) {
    console.error('❌ Get all tracking error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;