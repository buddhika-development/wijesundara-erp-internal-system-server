const express = require('express');
const { JobRole } = require('../models/HRDepartment');
const router = express.Router();

// Create Job Role
router.post('/add', async (req, res) => {
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

//update job role data
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { job_role_salary, monthly_bonus, attendance_bonus_per_extra_day } = req.body;

    try {
        const jobRole = await JobRole.findById(id);
        if (!jobRole) {
            return res.status(404).json({ error: 'Job role not found' });
        }

        if (job_role_salary !== undefined) jobRole.job_role_salary = job_role_salary;
        if (monthly_bonus !== undefined) jobRole.monthly_bonus = monthly_bonus;
        if (attendance_bonus_per_extra_day !== undefined) {
            jobRole.attendance_bonus_per_extra_day = attendance_bonus_per_extra_day;
        }

        await jobRole.save();
        res.json(jobRole);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }



});

module.exports = router;
