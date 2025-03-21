const express = require('express');
const router = express.Router();
const { Vehicle } = require('../models/transportation');

// Regular expression for vehicle number pattern (example: alphanumeric with 6-10 characters)
const vehicleNumberPattern = /^[A-Za-z0-9]{6,10}$/;

// Add a new vehicle
router.post('/add', async (req, res) => {
    try {
        const vehicle = new Vehicle(req.body);
        await vehicle.save();
        res.status(201).json(vehicle);
    } catch (err) {
        res.status(400).json({ message: 'Error adding vehicle', error: err.message });
    }
});
//searchimg the vehicle
router.get('/search/:vehicle_Num', async (req, res) => {
    const { vehicle_Num } = req.params;

    // Check if the vehicle number matches the expected pattern
    if (!vehicleNumberPattern.test(vehicle_Num)) {
        console.log('Invalid vehicle number format');
        return res.status(400).json({ message: 'Invalid vehicle number format' });
    }

    try {
        const vehicle = await Vehicle.findOne({ vehicle_Num });

        if (!vehicle) {
            console.log('Vehicle not found in DB:', vehicle_Num);
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        console.log('Vehicle found:', vehicle);
        res.status(200).json(vehicle);
    } catch (err) {
        console.log('Error checking vehicle data:', err);
        res.status(500).json({ message: 'Error checking vehicle data', error: err.message });
    }
});


// Delete a vehicle by vehicle number
router.delete('/delete/:vehicle_Num', async (req, res) => {
  const { vehicle_Num } = req.params;

  try {
    // Find and delete the vehicle
    const vehicle = await Vehicle.findOneAndDelete({ vehicle_Num });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Optionally, also delete related data (fuel, maintenance)
    await VehicleMillageFuel.deleteMany({ vehicle_Num });
    await VehicleMaintenance.deleteMany({ vehicle_Num });

    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    console.log('Error deleting vehicle:', err);
    res.status(500).json({ message: 'Error deleting vehicle', error: err.message });
  }
});

// Edit vehicle by vehicle number using PATCH method
router.patch('/edit/:vehicle_Num', async (req, res) => {
    const { vehicle_Num } = req.params;

    // Check if the vehicle number matches the expected pattern
    if (!vehicleNumberPattern.test(vehicle_Num)) {
        return res.status(400).json({ message: 'Invalid vehicle number format' });
    }

    try {
        const updatedVehicle = await Vehicle.findOneAndUpdate(
            { vehicle_Num },
            req.body,
            { new: true }
        );

        if (!updatedVehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.status(200).json(updatedVehicle);
    } catch (err) {
        res.status(400).json({ message: 'Error updating vehicle', error: err.message });
    }
});

module.exports = router;
