const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  pickupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pickup'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['service', 'driver', 'timing', 'overall'],
    default: 'overall'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);