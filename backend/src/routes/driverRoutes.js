// backend/routes/driverRoutes.js
const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

// সব ড্রাইভার দেখুন
router.get('/', async (req, res) => {
  try {
    // ✅ সঠিক কালেকশন নাম ব্যবহার করুন (Driver)
    const drivers = await Driver.find().sort({ name: 1 });
    console.log('📤 Found drivers:', drivers.length);
    res.json({ success: true, drivers });
  } catch (error) {
    console.error('❌ Error fetching drivers:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// নতুন ড্রাইভার যোগ করুন
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, allVehicles } = req.body;
    
    const lastDriver = await Driver.findOne().sort({ driverId: -1 });
    let driverId = 'DRV001';
    if (lastDriver) {
      const num = parseInt(lastDriver.driverId.replace('DRV', '')) + 1;
      driverId = `DRV${String(num).padStart(3, '0')}`;
    }
    
    const driver = new Driver({
      driverId,
      name,
      email,
      phone,
      allVehicles: allVehicles || [],
      vehicleNumber: '',
      vehicleType: '',
      status: 'available'
    });
    
    await driver.save();
    console.log('✅ Driver created:', driver.name);
    res.status(201).json({ success: true, driver });
  } catch (error) {
    console.error('❌ Error creating driver:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ড্রাইভারের গাড়ি আপডেট করুন
router.put('/:id/vehicle', async (req, res) => {
  try {
    const { vehicleNumber, vehicleType } = req.body;
    const driver = await Driver.findById(req.params.id);
    
    if (!driver) {
      return res.status(404).json({ success: false, error: 'Driver not found' });
    }
    
    const vehicleExists = driver.allVehicles.some(v => v.vehicleNumber === vehicleNumber);
    if (!vehicleExists) {
      return res.status(400).json({ 
        success: false, 
        error: 'Vehicle not found in driver\'s list' 
      });
    }
    
    driver.vehicleNumber = vehicleNumber;
    driver.vehicleType = vehicleType;
    driver.status = 'busy';
    await driver.save();
    
    console.log('✅ Driver vehicle updated:', driver.name, vehicleNumber);
    res.json({ success: true, driver });
  } catch (error) {
    console.error('❌ Error updating driver vehicle:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ড্রাইভার ডিলিট করুন
router.delete('/:id', async (req, res) => {
  try {
    const driver = await Driver.findByIdAndDelete(req.params.id);
    if (!driver) {
      return res.status(404).json({ success: false, error: 'Driver not found' });
    }
    console.log('✅ Driver deleted:', driver.name);
    res.json({ success: true, message: 'Driver deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting driver:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;