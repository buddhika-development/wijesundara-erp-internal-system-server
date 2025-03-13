const express = require('express');
const router = express.Router();
const { Attendance, Employee } = require('../models/HRDepartment');


// Create Attendance
router.post('/add', async (req, res) => {
    const { employee_id, date, attended } = req.body;

    try {
        // Check if the employee exists
        const employee = await Employee.findById(employee_id);
        if (!employee) {
            return res.status(400).json({ error: 'Employee not found' });
        }

        // Create a new attendance record
        const newAttendance = new Attendance({
            employee_id,
            date,
            attended
        });

        await newAttendance.save();
        res.status(201).json({ message: 'Attendance added successfully', attendance: newAttendance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add attendance' });
    }
});


// Get all attendance records
router.get('/', async (req, res) => {
    try {
      const attendances = await Attendance.find(); // Retrieves all attendance records
      res.status(200).json(attendances);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch attendance records' });
    }
  });

  router.get('/:employee_id', async (req, res) => {
    const { employee_id } = req.params;  // Get the employee_id from the URL
  
    try {
      const attendance = await Attendance.find({ employee_id: employee_id });  // Find all attendance records for the specific employee
      if (attendance.length > 0) {
        res.status(200).json(attendance);
      } else {
        res.status(404).json({ message: 'Attendance not found for this employee' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch attendance for employee' });
    }
  });

module.exports = router;
