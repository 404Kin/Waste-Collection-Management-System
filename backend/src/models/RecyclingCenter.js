const mongoose = require('mongoose');

const RecyclingCenterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: ''
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  acceptedWaste: {
    type: [String],
    default: ['plastic', 'paper', 'metal', 'glass']
  },
  workingHours: {
    start: { type: String, default: '9:00 AM' },
    end: { type: String, default: '6:00 PM' }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RecyclingCenter', RecyclingCenterSchema);