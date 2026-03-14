const express = require('express');
const router = express.Router();
const Report = require('../models/Report');
const auth = require('../middleware/auth');

// @route   GET /api/dashboard/citizen
// @desc    Get citizen dashboard stats and recent reports
// @access  Private (Citizen)
router.get('/citizen', auth, async (req, res) => {
    if (req.user.role !== 'citizen') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const total = await Report.countDocuments({ citizenId: req.user.id });
        const resolved = await Report.countDocuments({ citizenId: req.user.id, status: 'Resolved' });
        const pending = await Report.countDocuments({ citizenId: req.user.id, status: 'Pending' });
        const inProgress = await Report.countDocuments({ citizenId: req.user.id, status: 'In Progress' });

        const recentReports = await Report.find({ citizenId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(5);

        res.json({
            stats: { total, resolved, pending, inProgress },
            recentReports
        });
    } catch (err) {
        console.error('Citizen dashboard error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/dashboard/collector
// @desc    Get collector dashboard stats and pickups
// @access  Private (Collector)
router.get('/collector', auth, async (req, res) => {
    if (req.user.role !== 'collector') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        // Find the user to get their zone
        const User = require('../models/User');
        const user = await User.findById(req.user.id);
        
        if (!user.zone) {
            return res.status(400).json({ message: 'Collector has no assigned zone' });
        }

        const assigned = await Report.countDocuments({ zone: user.zone, status: { $ne: 'Resolved' } });
        const completed = await Report.countDocuments({ collectorId: req.user.id, status: 'Resolved' });
        const pending = await Report.countDocuments({ zone: user.zone, status: 'Pending' });

        const pickups = await Report.find({ zone: user.zone })
            .sort({ createdAt: -1 });

        res.json({
            stats: { assigned, completed, pending },
            pickups
        });
    } catch (err) {
        console.error('Collector dashboard error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/dashboard/admin
// @desc    Get admin dashboard stats and problem areas
// @access  Private (Admin)
router.get('/admin', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
    }

    try {
        const total = await Report.countDocuments();
        const resolved = await Report.countDocuments({ status: 'Resolved' });
        const pending = await Report.countDocuments({ status: 'Pending' });
        
        const User = require('../models/User');
        const collectorsCount = await User.countDocuments({ role: 'collector' });

        // Get problem areas using aggregation
        const problemAreas = await Report.aggregate([
            { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
            { $group: { _id: "$location", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Get zone efficiency for admin sidebar
        const zoneStats = await Report.aggregate([
            { $group: { 
                _id: "$zone", 
                total: { $sum: 1 }, 
                resolved: { $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] } } 
            }},
            { $project: {
                zone: "$_id",
                efficiency: { $multiply: [{ $divide: ["$resolved", "$total"] }, 100] }
            }}
        ]);

        res.json({
            stats: { total, resolved, pending, collectorsCount },
            problemAreas: problemAreas.map(item => ({ location: item._id, count: item.count })),
            zoneStats
        });
    } catch (err) {
        console.error('Admin dashboard error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
