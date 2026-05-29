const mongoose = require('mongoose');

const rescueReportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional if guest report is allowed
  reporterName: { type: String, required: true },
  contactNumber: { type: String, required: true },
  animalType: { type: String, required: true },
  injuryDescription: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  imageUrl: { type: String, required: true },
  emergencyLevel: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true },
  notes: { type: String },
  status: { 
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  assignedTeam: { type: mongoose.Schema.Types.ObjectId, ref: 'RescueTeam', default: null },
  afterImageUrl: { type: String, default: '' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model('RescueReport', rescueReportSchema);
