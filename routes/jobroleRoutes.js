const express = require('express');
const { JobRole } = require('../models/HRDepartment');
const router = express.Router();

// Create Job Role
router.post('/', async (req, res) => {
    try {
        const jobRole = new JobRole(req.body);
        await jobRole.save();
        res.json(jobRole);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all Job Roles
router.get('/', async (req, res) => {
    try {
        const jobRoles = await JobRole.find();
        res.json(jobRoles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
