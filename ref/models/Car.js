const mongoose = require('mongoose');

const CarSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true,
    unique: true
  },
  year: {
    type: Number,
    required: true
  },
  specs: {
    horsepower: Number,
    acceleration: String,
    topSpeed: String,
    transmission: String,
    engine: String
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Car', CarSchema); 