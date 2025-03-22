const express = require('express');
const router = express.Router();
const { Vehicle, VehicleMillageFuel, VehicleMaintenance } = require('../models/transportation');

// Define currentYear
const currentYear = new Date().getFullYear();

// Updated regex: Max 8 characters
const vehicleNumberPattern = /^[A-Za-z0-9]{3}-\d{4}$/;

//add vehicle
router.post('/add', async (req, res) => {
    const { vehicle_Num, vehicle_Colour, vehicle_YOM, vehicle_YOR } = req.body;
  
    // Validate vehicle number format
    if (!vehicleNumberPattern.test(vehicle_Num)) {
      return res.status(400).json({ message: 'Vehicle number must follow the format: XXX-1234 (3 alphanumeric characters followed by a dash and 4 digits).' });
    }
  
    // Validate YOM & YOR
    if (vehicle_YOM > currentYear || vehicle_YOR > currentYear) {
      return res.status(400).json({ message: `YOM and YOR cannot be in the future. Max allowed year is ${currentYear}` });
    }
  
    // Check if the vehicle number already exists
    const existingVehicle = await Vehicle.findOne({ vehicle_Num });
    if (existingVehicle) {
      return res.status(400).json({ message: 'Vehicle number already exists' });
    }
  
    try {
      const vehicle = new Vehicle(req.body);
      await vehicle.save();
      res.status(201).json(vehicle);
    } catch (err) {
      res.status(400).json({ message: 'Error adding vehicle', error: err.message });
    }
  });  

// Search vehicle
router.get('/search/:vehicle_Num', async (req, res) => {
  const { vehicle_Num } = req.params;

  if (!vehicleNumberPattern.test(vehicle_Num)) {
    return res.status(400).json({ message: 'Invalid vehicle number format (max 8 alphanumeric characters)' });
  }

  try {
    const vehicle = await Vehicle.findOne({ vehicle_Num });

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: 'Error checking vehicle data', error: err.message });
  }
});

// Delete vehicle
router.delete('/delete/:vehicle_Num', async (req, res) => {
const { vehicle_Num } = req.params;

// Updated validation to match the correct format for vehicle number
const vehicleNumberPattern = /^[A-Za-z0-9]{3}-\d{4}$/;

// Check if the vehicle number matches the pattern
if (!vehicleNumberPattern.test(vehicle_Num)) {
    return res.status(400).json({
    message: 'Vehicle number must follow the format: XXX-1234 (3 alphanumeric characters followed by a dash and 4 digits)'
    });
}

try {
    // Try to find and delete the vehicle
    const vehicle = await Vehicle.findOneAndDelete({ vehicle_Num });

    if (!vehicle) {
    return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Delete related records in VehicleMillageFuel and VehicleMaintenance
    await VehicleMillageFuel.deleteMany({ vehicle_Num });
    await VehicleMaintenance.deleteMany({ vehicle_Num });

    res.status(200).json({ message: 'Vehicle deleted successfully' });
} catch (err) {
    res.status(500).json({ message: 'Error deleting vehicle', error: err.message });
}
});

// Edit vehicle
router.patch('/edit/:vehicle_Num', async (req, res) => {
  const { vehicle_Num } = req.params;

  if (!vehicleNumberPattern.test(vehicle_Num)) {
    return res.status(400).json({ message: 'Invalid vehicle number format (max 8 alphanumeric characters)' });
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
