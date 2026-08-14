const mongoose = require('mongoose');

const trackingSchema = new mongoose.Schema({
  pickupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pickup',
    required: true
  },
  driverId: {
    type: String,
    required: true
  },
  driverName: {
    type: String,
    default: ''
  },
  location: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    address: { type: String, default: '' }
  },
  status: {
    type: String,
    enum: ['pending', 'en_route', 'arrived', 'collecting', 'completed'],
    default: 'pending'
  },
  history: [{
    location: { lat: Number, lng: Number },
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Tracking', trackingSchema);