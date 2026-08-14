const Pickup = require('../models/Pickup');

const createPickup = async (req, res) => {
  try {
    console.log('📦 Creating pickup:', req.body);
    
    const { userId,userEmail,userName,address, wasteType,weight, date, time, instructions } = req.body;

    // Validation
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'User ID is required' 
      });
    }

    const pickup = await Pickup.create({
      userId,  
      userEmail: userEmail || 'No Email',          
      userName: userName || 'Unknown User',  
      address,
      wasteType: wasteType || 'general',
      weight: weight || 0,
      date: date || new Date().toISOString().split('T')[0],
      time: time || 'morning',
      instructions: instructions || '',
      status: 'pending'
    });

    console.log('✅ Pickup created:', pickup);
    
    res.status(201).json({ 
      success: true, 
      pickup 
    });
  } catch (error) {
    console.error('❌ Create Pickup Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// ✅ Get User's Pickups (query থেকে userId নিবে)
const getPickups = async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        error: 'User ID is required' 
      });
    }

    const pickups = await Pickup.find({ userId })
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${pickups.length} pickups for user`);
    
    res.json({ 
      success: true, 
      count: pickups.length, 
      pickups 
    });
  } catch (error) {
    console.error('❌ Get Pickups Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// ✅ Get Single Pickup by ID
const getPickupById = async (req, res) => {
  try {
    const pickup = await Pickup.findById(req.params.id);
    
    if (!pickup) {
      return res.status(404).json({ 
        success: false, 
        error: 'Pickup not found' 
      });
    }
    
    res.json({ 
      success: true, 
      pickup 
    });
  } catch (error) {
    console.error('❌ Get Pickup Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// ✅ Update Pickup Status (ড্রাইভার সহ)
const updatePickupStatus = async (req, res) => {
  try {
    const { status, driverId, driverName } = req.body;
    const { id } = req.params;

    console.log('📝 Updating pickup:', { id, status, driverId, driverName });

    const updateData = { status };
    
    // যদি ড্রাইভার আইডি আসে তাহলে সেটাও আপডেট করুন
    if (driverId) {
      updateData.driverId = driverId;
    }
    
    // যদি ড্রাইভারের নাম আসে তাহলে সেটাও আপডেট করুন
    if (driverName) {
      updateData.driverName = driverName;
    }
    
    // যদি কমপ্লিটেড হয় তাহলে completedAt সেট করুন
    if (status === 'completed') {
      updateData.completedAt = Date.now();
    }

    const pickup = await Pickup.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!pickup) {
      return res.status(404).json({ 
        success: false, 
        error: 'Pickup not found' 
      });
    }

    console.log('✅ Pickup updated:', pickup);
    
    res.json({ 
      success: true, 
      pickup 
    });
  } catch (error) {
    console.error('❌ Update Pickup Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
const deletePickup = async (req, res) => {
  try {
    const { id } = req.params;
    
    const pickup = await Pickup.findByIdAndDelete(id);
    
    if (!pickup) {
      return res.status(404).json({ 
        success: false, 
        error: 'Pickup not found' 
      });
    }

    console.log(`✅ Pickup ${id} deleted successfully`);
    
    res.json({ 
      success: true, 
      message: 'Pickup deleted successfully' 
    });
  } catch (error) {
    console.error('❌ Delete Pickup Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};
const getAllPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find()
      .sort({ createdAt: -1 });
    
    console.log(`✅ Found ${pickups.length} total pickups`);
    
    res.json({ 
      success: true, 
      count: pickups.length, 
      pickups 
    });
  } catch (error) {
    console.error('❌ Get All Pickups Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};


module.exports = {
  createPickup,
  getPickups,
  getPickupById,
  updatePickupStatus,
  deletePickup,
  getAllPickups
};