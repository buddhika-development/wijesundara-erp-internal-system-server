const express = require('express');
const { Employee } = require('../models/HRDepartment');
const router = express.Router();

// Create Employee
router.post('/', async (req, res) => {
    try {
        const employee = new Employee(req.body);
        await employee.save();
        res.json(employee);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all Employees
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
