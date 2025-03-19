const express = require('express');
const { Department } = require('../models/HRDepartment');
const router = express.Router();

// Create Department
router.post('/', async (req, res) => {
    try {
        const department = new Department(req.body);
        await department.save();
        res.json(department);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all Departments
router.get('/', async (req, res) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;