const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET /api/admin/users
// @desc    Get all users
// @access  Private (Admin)
router.get('/users', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }

    try {
        const { role, search } = req.query;
        let query = {};

        if (role && role !== 'All') query.role = role.toLowerCase();
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { zone: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        console.error('Admin Fetch Users Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/users/:id/status
// @desc    Toggle user status (Active/Inactive)
// @access  Private (Admin)
router.put('/users/:id/status', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied.' });
    }

    try {
        const { isActive } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) return res.status(404).json({ message: 'User not found' });
        if (user.role === 'admin') return res.status(400).json({ message: 'Admin status cannot be toggled' });

        user.isActive = isActive;
        await user.save();
        
        res.json({ message: `User ${isActive ? 'activated' : 'deactivated'} successfully`, user });
    } catch (err) {
        console.error('Toggle User Status Error:', err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT /api/admin/users/:id/zone
// @desc    Update user zone
// @access  Private (Admin)
router.put('/users/:id/zone', auth, async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied.' });
    }

    try {
        const { zone } = req.body;
        const user = await User.findById(req.params.id);
        
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.zone = zone;
        await user.save();
        
        res.json({ message: 'User zone updated successfully', user });
    } catch (err) {
        console.error('Update User Zone Error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
