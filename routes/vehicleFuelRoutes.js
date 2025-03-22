const express = require('express');
const router = express.Router();
const { Vehicle, VehicleMillageFuel } = require('../models/transportation');

// Add fuel and mileage with validation
router.post('/add', async (req, res) => {
  const { vehicleNumber, fuelCost, mileage, date } = req.body;

  try {
    // Step 1: Vehicle Number Length Validation
    if (!vehicleNumber || vehicleNumber.length > 8) {
      return res.status(400).json({ message: 'Vehicle number must be 8 characters or less!' });
    }

    // Step 2: Date Validation
    const submittedDate = new Date(date);
    const today = new Date();
    submittedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (submittedDate > today) {
      return res.status(400).json({ message: 'Future dates are not allowed!' });
    }

    // Step 3: Check if vehicle exists
    const vehicle = await Vehicle.findOne({ vehicle_Num: vehicleNumber });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle is not in the system!' });
    }

    // Step 4: Check if fuel & mileage record exists
    let record = await VehicleMillageFuel.findOne({ vehicle_Num: vehicleNumber });

    if (record) {
      // Update existing record
      record.vehicle_Fuel += parseFloat(fuelCost);
      record.vehicle_Milage += parseFloat(mileage);
      record.vehicle_FuelDate = date;
      await record.save();
    } else {
      // Create new record
      record = new VehicleMillageFuel({
        vehicle_Num: vehicleNumber,
        vehicle_Milage: mileage,
        vehicle_Fuel: fuelCost,
        vehicle_FuelDate: date,
      });
      await record.save();
    }

    res.status(200).json({ message: 'Fuel & Mileage successfully added!', data: record });

  } catch (err) {
    res.status(500).json({ message: 'Error processing request', error: err.message });
  }
});

module.exports = router;
