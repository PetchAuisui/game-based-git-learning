const mongoose = require('mongoose');

const UserProgressSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true }, // Simple string for now since JWT is mentioned as "assumed basic auth", we'll just use a simple ID if there is no real User table
  currentHighestLevel: { type: Number, default: 0 },
  stats: {
    totalScore: { type: Number, default: 0 },
    totalCoins: { type: Number, default: 0 },
  },
  layoutPreferences: {
    splitterHeight: { type: Number, default: 50 },
    preset: { type: String, default: 'default' }
  }
}, { timestamps: true });

module.exports = mongoose.model('UserProgress', UserProgressSchema);
