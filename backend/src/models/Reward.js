const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  points: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['earned', 'redeemed', 'bonus'],
    default: 'earned'
  },
  source: {
    type: String,
    enum: ['recycling', 'referral', 'bonus', 'event'],
    default: 'recycling'
  },
  description: {
    type: String,
    required: true
  },
  referenceId: {
    type: String,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Reward', RewardSchema);