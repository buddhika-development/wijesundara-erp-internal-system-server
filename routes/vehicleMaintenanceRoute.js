const express = require('express');
const router = express.Router();
const { Vehicle, VehicleMaintenance } = require('../models/transportation');

// Add maintenance record
router.post('/add', async (req, res) => {
  try {
    const { vehicleNumber, maintenanceCost, description, date } = req.body;

    // Validate vehicle number length
    if (vehicleNumber.length > 8) {
      return res.status(400).json({ message: 'Vehicle number cannot exceed 8 characters.' });
    }

    // Check if vehicle exists
    const vehicle = await Vehicle.findOne({ vehicle_Num: vehicleNumber });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle is not in the system!' });
    }

    // Check future date
    const submittedDate = new Date(date);
    const today = new Date();
    submittedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (submittedDate > today) {
      return res.status(400).json({ message: 'Future dates are not allowed for maintenance records.' });
    }

    // Save as separate record
    const record = new VehicleMaintenance({
      vehicle_Num: vehicleNumber,
      vehicle_MainCost: parseFloat(maintenanceCost),
      vehicle_MainDate: date,
      vehicle_Description: description
    });

    await record.save();

    res.status(200).json({ message: 'Maintenance record added successfully!', data: record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error adding maintenance record', error: err.message });
  }
});

// Get maintenance records with optional filters
router.get('/', async (req, res) => {
  try {
    const { vehicleNum, dateFrom, dateTo } = req.query;
    const query = {};

    if (vehicleNum) query.vehicle_Num = { $regex: vehicleNum, $options: 'i' };
    if (dateFrom || dateTo) {
      query.vehicle_MainDate = {};
      if (dateFrom) query.vehicle_MainDate.$gte = new Date(dateFrom);
      if (dateTo) query.vehicle_MainDate.$lte = new Date(dateTo);
    }

    const records = await VehicleMaintenance.find(query);
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching maintenance records', error: err.message });
  }
});

module.exports = router;