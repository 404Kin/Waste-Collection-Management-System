const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  driverId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    required: true
  },
  vehicleNumber: {         
    type: String,
    default: ''
  },
  vehicleType: {            
    type: String,
    enum: ['truck', 'van', 'pickup', 'bike', 'rickshaw', ''],
    default: ''
  },
  allVehicles: [{            
    vehicleNumber: {
      type: String,
      required: true
    },
    vehicleType: {
      type: String,
      enum: ['truck', 'van', 'pickup', 'bike', 'rickshaw'],
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  status: {
    type: String,
    enum: ['available', 'busy', 'offline'],
    default: 'available'
  },
  assignedPickups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pickup'
  }],
  totalPickups: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Driver', driverSchema);