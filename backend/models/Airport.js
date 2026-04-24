const mongoose = require('mongoose');

const airportSchema = new mongoose.Schema({
  airportCode: {
    type: String,
    required: true,
    unique: true
  },
  hourlyCapacity: {
    type: Number,
    required: true,
    default: 40
  },
  runwayCount: {
    type: Number,
    required: true,
    default: 2
  },
  congestionIndex: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Airport', airportSchema);
