const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const auth = require('../middleware/auth');

// @route   POST /api/reports
// @desc    Submit a new garbage report
// @access  Private (Citizen)
router.post('/', auth, async (req, res) => {
    try {
        const { garbageType, location, landmark, zone, description, photo, urgency } = req.body;

        const newReport = new Report({
            citizenId: req.user.id,
            garbageType,
            location,
            landmark,
            zone,
            description,
            photo,
            urgency,
            status: 'Pending'
        });

        const report = await newReport.save();
        res.json(report);
    } catch (err) {
        console.error('Report submission error:', err);
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ message: 'Validation Error: ' + messages.join(', ') });
        }
        res.status(500).json({ message: 'Server Error: ' + err.message });
    }
});

// @route   GET /api/reports
// @desc    Get all reports (with filters)
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const { zone, status, citizenId } = req.query;
        let query = {};

        if (zone) query.zone = zone;
        if (status) query.status = status;
        
        // If citizen, they only see their own reports by default if not specified
        if (req.user.role === 'citizen') {
            query.citizenId = req.user.id;
        } else if (citizenId) {
            query.citizenId = citizenId;
        }

        const reports = await Report.find(query).sort({ createdAt: -1 });
        res.json(reports);
    } catch (err) {
        console.error('Fetch reports error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/reports/:id
// @desc    Get report by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
    try {
        const report = await Report.findById(req.params.id).populate('citizenId', 'name email phone');
        if (!report) return res.status(404).json({ message: 'Report not found' });
        res.json(report);
    } catch (err) {
        console.error('Fetch report details error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/reports/:id/status
// @desc    Update report status
// @access  Private (Collector/Admin)
router.put('/:id/status', auth, async (req, res) => {
    try {
        const { status } = req.body;
        
        let report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });

        // If collector, they can only update if they are assigned or if it's pending in their zone
        if (req.user.role === 'collector') {
            const User = require('../models/User');
            const user = await User.findById(req.user.id);
            if (report.zone !== user.zone) {
                return res.status(403).json({ message: 'Not authorized for this zone' });
            }
            
            // Set collectorId if not set
            if (!report.collectorId) {
                report.collectorId = req.user.id;
            }
        }

        report.status = status;
        await report.save();
        res.json(report);
    } catch (err) {
        console.error('Update status error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
