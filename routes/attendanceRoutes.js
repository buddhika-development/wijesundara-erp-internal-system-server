const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const { Attendance } = require('../models/HRDepartment');


// TEST-CASE
// {
//     "employee_id": "67d13d2e585e7169232d20d3",
//     "date": "2025-03-15",
//     "attended": true
// }

//create attendance
router.post('/add', async (req, res) => {
    const { employee_id, date, attended } = req.body;

    try {
        const newAttendance = new Attendance({
            employee_id,
            date,
            attended,
        });
        await newAttendance.save();
        res.status(201).json({ message: 'Attendance added', attendance: newAttendance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error failed to add attendance' });
    }
});

//get all attendance
router.get('/', async (req, res) => {
    try {
        const attendances = await Attendance.find();
        res.status(200).json(attendances);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch attendance records' });
    }
});

// Get attendance by date
// TEST_case
//   http://localhost:5000/api/attendance/date/2025-03-21  working +

router.get('/date/:date', async (req, res) => {
    const { date } = req.params;  

    try {
        
        const dateObj = new Date(date);

        const attendance = await Attendance.find({
            date: {
                $gte: new Date(dateObj.setHours(0, 0, 0, 0)),  
                $lt: new Date(dateObj.setHours(23, 59, 59, 999)), 
            },
        });

        if (attendance.length > 0) {
            res.status(200).json(attendance);
        } else {
            res.status(404).json({ message: 'No attendance for this date' });
        }
    } catch (err) {
        console.error('Error fetching attendance by date:', err);
        res.status(500).json({ error: 'error while fetch attendance by date' });
    }
});


// Get attendance by employee_id
// TEST_case 
// http://localhost:5000/api/attendance/67d167d8041f87401871c44f wworking +
router.get('/:employee_id', async (req, res) => {
    const { employee_id } = req.params;  

    try {
        const attendance = await Attendance.find({ employee_id: employee_id });
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
