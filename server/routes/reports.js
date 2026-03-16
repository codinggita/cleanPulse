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
        const { zone, status, citizenId, search, urgency, sortBy, page = 1, limit = 10 } = req.query;
        let query = {};

        // Base Filters
        if (zone) query.zone = zone;
        if (status && status !== 'All') query.status = status;
        if (urgency && urgency !== 'All') query.urgency = urgency;
        
        // Search Logic (Regex)
        if (search) {
            query.$or = [
                { location: { $regex: search, $options: 'i' } },
                { landmark: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Citizen scope
        if (req.user.role === 'citizen') {
            query.citizenId = req.user.id;
        } else if (citizenId) {
            query.citizenId = citizenId;
        }

        // Sorting
        let sort = { createdAt: -1 };
        if (sortBy === 'oldest') sort = { createdAt: 1 };
        if (sortBy === 'urgency') sort = { urgency: -1 };

        // Pagination calculations
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;

        // Fetch counts and data
        const totalReports = await Report.countDocuments(query);
        const reports = await Report.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limitNum);

        res.json({
            reports,
            totalReports,
            totalPages: Math.ceil(totalReports / limitNum),
            currentPage: pageNum
        });
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

// @route   PUT /api/reports/:id
// @desc    Update a garbage report
// @access  Private (Citizen - only if pending)
router.put('/:id', auth, async (req, res) => {
    try {
        let report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });

        // Ensure user owns report
        if (report.citizenId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized to edit this report' });
        }

        // Only allow editing if Status is Pending
        if (report.status !== 'Pending') {
            return res.status(400).json({ message: 'Only pending reports can be edited' });
        }

        const { garbageType, location, landmark, zone, description, photo, urgency } = req.body;
        
        // Update fields
        if (garbageType) report.garbageType = garbageType;
        if (location) report.location = location;
        if (landmark) report.landmark = landmark;
        if (zone) report.zone = zone;
        if (description) report.description = description;
        if (photo) report.photo = photo;
        if (urgency) report.urgency = urgency;

        const updatedReport = await report.save();
        res.json(updatedReport);
    } catch (err) {
        console.error('Update report error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE /api/reports/:id
// @desc    Delete a garbage report
// @access  Private (Citizen/Admin - citizen only if pending)
router.delete('/:id', auth, async (req, res) => {
    try {
        const report = await Report.findById(req.params.id);
        if (!report) return res.status(404).json({ message: 'Report not found' });

        // If not admin, check ownership and status
        if (req.user.role !== 'admin') {
            if (report.citizenId.toString() !== req.user.id) {
                return res.status(401).json({ message: 'User not authorized to delete this report' });
            }
            if (report.status !== 'Pending') {
                return res.status(400).json({ message: 'Only pending reports can be deleted by citizen' });
            }
        }

        await Report.findByIdAndDelete(req.params.id);
        res.json({ message: 'Report removed' });
    } catch (err) {
        console.error('Delete report error:', err.message);
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

        // If report is resolved, check for badges for the citizen
        if (status === 'Resolved') {
            const { checkAndAwardBadges } = require('../utils/badgeHandler');
            await checkAndAwardBadges(report.citizenId);
        }

        res.json(report);
    } catch (err) {
        console.error('Update status error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
