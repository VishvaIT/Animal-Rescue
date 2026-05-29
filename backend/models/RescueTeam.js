const mongoose = require('mongoose');

const rescueTeamSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teamName: { type: String, required: true },
  coverageArea: { type: String }, // e.g., "Downtown", "North Side"
  activeRescues: { type: Number, default: 0 },
  completedRescues: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  currentLocation: {
    lat: { type: Number },
    lng: { type: Number }
  }
}, { timestamps: true });

module.exports = mongoose.model('RescueTeam', rescueTeamSchema);
