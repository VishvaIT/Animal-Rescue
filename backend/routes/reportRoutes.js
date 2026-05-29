const express = require('express');
const router = express.Router();
const { createReport, getReports, getMyReports, updateReportStatus, likeReport, commentOnReport } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public or User can create report
router.post('/', upload.single('image'), createReport);

// Get all reports (Public map or Admin)
router.get('/', getReports);

// Get my reports (User dashboard)
router.get('/my-reports', protect, getMyReports);

// Update status (Team or Admin)
router.put('/:id/status', protect, authorize('team', 'admin'), upload.single('afterImage'), updateReportStatus);

// Like a report
router.post('/:id/like', protect, likeReport);

// Comment on a report
router.post('/:id/comment', protect, commentOnReport);

module.exports = router;
