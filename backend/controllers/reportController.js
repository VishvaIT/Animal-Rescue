const RescueReport = require('../models/RescueReport');
const RescueUpdate = require('../models/RescueUpdate');
const Notification = require('../models/Notification');

// Create a new report
exports.createReport = async (req, res) => {
  try {
    const { reporterName, contactNumber, animalType, injuryDescription, address, lat, lng, emergencyLevel, notes } = req.body;
    let imageUrl = '';
    if (req.file) {
      // Temporary local URL, will be replaced by Cloudinary later
      imageUrl = `/uploads/${req.file.filename}`;
    }

    const newReport = await RescueReport.create({
      reporter: req.user ? req.user.id : null,
      reporterName,
      contactNumber,
      animalType,
      injuryDescription,
      location: {
        address,
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      },
      imageUrl,
      emergencyLevel,
      notes
    });

    const io = req.app.get('io');
    if (io) {
      // Need to populate if we want full details instantly, but basic newReport is fine
      io.emit('new_rescue_post', newReport);
    }

    res.status(201).json(newReport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all reports (Admin / Public Map)
exports.getReports = async (req, res) => {
  try {
    const reports = await RescueReport.find().populate('assignedTeam').sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get my reports (User Dashboard)
exports.getMyReports = async (req, res) => {
  try {
    const reports = await RescueReport.find({ reporter: req.user.id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update report status (Team/Admin)
exports.updateReportStatus = async (req, res) => {
  try {
    const { status, updateNotes } = req.body;
    const report = await RescueReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status;
    
    // Assign team if accepting
    if (status === 'Team Assigned' && req.user.role === 'team') {
      const RescueTeam = require('../models/RescueTeam');
      const team = await RescueTeam.findOne({ user: req.user.id });
      if (team) {
        report.assignedTeam = team._id;
      }
    }

    if (req.file) {
      report.afterImageUrl = `/uploads/${req.file.filename}`;
    }

    await report.save();

    // Create an update entry
    if (updateNotes) {
       await RescueUpdate.create({
         report: report._id,
         team: report.assignedTeam,
         statusUpdate: status,
         notes: updateNotes
       });
    }

    // Create a notification for the user
    if (report.reporter) {
       await Notification.create({
         user: report.reporter,
         title: 'Rescue Update',
         message: `Your rescue report for ${report.animalType} is now: ${status}`,
         type: 'info'
       });
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('rescue_status_updated', report);
    }

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Like a report
exports.likeReport = async (req, res) => {
  try {
    const report = await RescueReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    
    const index = report.likes.indexOf(req.user.id);
    if (index === -1) {
      report.likes.push(req.user.id);
    } else {
      report.likes.splice(index, 1);
    }
    await report.save();
    
    const io = req.app.get('io');
    if (io) io.emit('report_liked', { reportId: report._id, likes: report.likes });
    
    res.json(report.likes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Comment on a report
exports.commentOnReport = async (req, res) => {
  try {
    const { text } = req.body;
    const report = await RescueReport.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    
    // We need user name, we can fetch User or assume req.user is populated. 
    // Auth middleware usually attaches user ID, we'll fetch User to get the name safely.
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    
    const newComment = {
      user: req.user.id,
      userName: user ? user.name : 'Unknown User',
      text
    };
    report.comments.push(newComment);
    await report.save();
    
    const io = req.app.get('io');
    if (io) io.emit('report_commented', { reportId: report._id, comment: report.comments[report.comments.length - 1] });
    
    res.json(report.comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
