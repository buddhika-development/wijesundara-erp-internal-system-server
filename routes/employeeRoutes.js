const express = require('express');
const { Employee } = require('../models/HRDepartment');
const router = express.Router();

//add employee
router.post('/', async (req, res) => {
    try {
        const employee = new Employee(req.body);
        await employee.save();
        res.json(employee);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//get all emplyrs
router.get('/', async (req, res) => {
    try {
        const employees = await Employee.find();
        res.json(employees);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


//update employee status
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const {employee_status} = req.body;

    try {
        const employee = await Employee.findById(id);
        if(!employee) {
            return res.status(404).json({ error: 'Employee not fund'});
        }
        if(employee_status) {
            employee.employee_status = employee_status;
        }

        await employee.save();
        res.json(employee);
    } catch (err) {
        res.status(400).json({ error: err.message});
    }
});

module.exports = router;
