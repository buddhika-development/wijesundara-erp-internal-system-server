const express = require('express');
const { EmployeeDepartment } = require('../models/HRDepartment');
const router = express.Router();

// Create Employee-Department-JobRole Relation
router.post('/', async (req, res) => {
    try {
        const relation = new EmployeeDepartment(req.body);
        await relation.save();
        res.json(relation);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all Relations
router.get('/', async (req, res) => {
    try {
        const relations = await EmployeeDepartment.find()
            .populate('employee_id')
            .populate('department_id')
            .populate('jobrole_id');
        res.json(relations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
