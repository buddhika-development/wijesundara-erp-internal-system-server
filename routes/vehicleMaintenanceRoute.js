const express = require('express');
const router = express.Router();
const { Vehicle, VehicleMaintenance } = require('../models/transportation');

// Add maintenance record
router.post('/add', async (req, res) => {
  try {
    const { vehicleNumber, maintenanceCost, description, date } = req.body;

    // Check if vehicle exists
    const vehicle = await Vehicle.findOne({ vehicle_Num: vehicleNumber });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle is not in the system!' });
    }

    // Save as separate record (no totals)
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

router.get('/', async (req, res) => {
  try {
    const records = await VehicleMaintenance.find();
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching maintenance records', error: err.message });
  }
});

module.exports = router;
