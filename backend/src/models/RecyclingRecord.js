const mongoose = require('mongoose');

const RecyclingRecordSchema = new mongoose.Schema({
  pickupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pickup',
    required: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  wasteType: {
    type: String,
    required: true
  },
  weight: {
    type: Number,
    required: true
  },
  pointsEarned: {
    type: Number,
    default: 0
  },
  certificateNumber: {
    type: String,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'verified', 'completed'],
    default: 'pending'
  },
  verifiedAt: {
    type: Date
  },
  notes: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('RecyclingRecord', RecyclingRecordSchema);