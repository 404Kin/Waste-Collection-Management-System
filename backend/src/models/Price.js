const mongoose = require('mongoose');

const priceSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    unique: true,
    enum: ['plastic', 'paper', 'glass', 'metal', 'ewaste']
  },
  type: {
    type: String,
    required: true
  },
  pricePerKg: {
    type: Number,
    required: true,
    min: 0
  },
  minKg: {
    type: Number,
    required: true,
    default: 1
  },
  maxKg: {
    type: Number,
    required: true,
    default: 100
  },
  emoji: {
    type: String,
    default: '♻️'
  },
  color: {
    type: String,
    default: 'from-gray-500 to-gray-600'
  },
  description: {
    type: String,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Price', priceSchema);