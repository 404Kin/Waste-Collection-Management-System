const mongoose = require('mongoose');

const pickupSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true 
  },
  userEmail: { 
    type: String, 
    required: true,
    default: 'No Email'
  },
  userName: { 
    type: String, 
    required: true,
    default: 'Unknown User'
  },
  address: { 
    type: String, 
    required: true 
  },
  wasteType: { 
    type: String, 
    required: true,
    default: 'general'
  },
  weight: { 
    type: Number, 
    default: 0 
  },
  date: { 
    type: String, 
    required: true 
  },
  time: { 
    type: String, 
    required: true,
    default: 'morning'
  },
  instructions: { 
    type: String, 
    default: '' 
  },
  status: { 
    type: String, 
    default: 'pending',
    enum: ['pending', 'assigned', 'completed', 'cancelled']
  },
  driverId: {              // ✅ ড্রাইভার আইডি
    type: String, 
    default: '' 
  },
  driverName: {            // ✅ ড্রাইভারের নাম (এই ফিল্ডটি যোগ করুন)
    type: String, 
    default: '' 
  },
  completedAt: {
    type: Date
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Pickup', pickupSchema);