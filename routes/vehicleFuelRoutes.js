const express = require('express');
const router = express.Router();
const { Vehicle, VehicleMillageFuel } = require('../models/transportation');

// Get all fuel and mileage records with optional filters
router.get('/', async (req, res) => {
  try {
    const { vehicleNum, dateFrom, dateTo } = req.query;
    const query = {};

    if (vehicleNum) {
      if (vehicleNum.length > 8) {
        return res.status(400).json({ message: 'Vehicle number must be 8 characters or less' });
      }
      query.vehicle_Num = { $regex: vehicleNum, $options: 'i' };
    }
    if (dateFrom || dateTo) {
      query.vehicle_FuelDate = {};
      if (dateFrom) {
        const fromDate = new Date(dateFrom);
        if (isNaN(fromDate)) return res.status(400).json({ message: 'Invalid dateFrom format' });
        query.vehicle_FuelDate.$gte = fromDate;
      }
      if (dateTo) {
        const toDate = new Date(dateTo);
        if (isNaN(toDate)) return res.status(400).json({ message: 'Invalid dateTo format' });
        query.vehicle_FuelDate.$lte = toDate;
      }
    }

    console.log('Fuel query:', query); // Debug log
    const records = await VehicleMillageFuel.find(query);
    res.status(200).json(records);
  } catch (err) {
    console.error('Error in /api/vehicle-fuel:', err);
    res.status(500).json({ message: 'Error fetching fuel and mileage records', error: err.message });
  }
});

// Add fuel and mileage with validation
router.post('/add', async (req, res) => {
  const { vehicleNumber, fuelCost, mileage, date } = req.body;

  try {
    if (!vehicleNumber || vehicleNumber.length > 8) {
      return res.status(400).json({ message: 'Vehicle number must be 8 characters or less!' });
    }

    const submittedDate = new Date(date);
    const today = new Date();
    submittedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    if (submittedDate > today) {
      return res.status(400).json({ message: 'Future dates are not allowed!' });
    }

    const vehicle = await Vehicle.findOne({ vehicle_Num: vehicleNumber });
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle is not in the system!' });
    }

    let record = await VehicleMillageFuel.findOne({ vehicle_Num: vehicleNumber });
    if (record) {
      record.vehicle_Fuel += parseFloat(fuelCost);
      record.vehicle_Milage += parseFloat(mileage);
      record.vehicle_FuelDate = date;
      await record.save();
    } else {
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
    console.error('Error in /api/vehicle-fuel/add:', err);
    res.status(500).json({ message: 'Error processing request', error: err.message });
  }
});

module.exports = router;