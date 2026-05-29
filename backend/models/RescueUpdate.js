const mongoose = require('mongoose');

const rescueUpdateSchema = new mongoose.Schema({
  report: { type: mongoose.Schema.Types.ObjectId, ref: 'RescueReport', required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: 'RescueTeam', required: true },
  statusUpdate: { type: String, required: true },
  notes: { type: String },
  imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('RescueUpdate', rescueUpdateSchema);
