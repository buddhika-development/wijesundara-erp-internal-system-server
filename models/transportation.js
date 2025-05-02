const mongoose = require('mongoose');

const VehicleSchema = new mongoose.Schema({
    vehicle_Num: { 
        type: String, 
        required: true 
    },
    vehicle_Model: { type: String, required: true },
    vehicle_Make: { type: String, required: true },
    vehicle_Colour: { type: String, required: true },
    vehicle_YOM: { type: Number, required: true },
    vehicle_YOR: { type: Number, required: true }
});

const VehicleMillageFuelSchema = new mongoose.Schema({
    vehicle_Num: { type: String, required: true },
    vehicle_Milage: { type: Number, required: true },
    vehicle_Fuel: { type: Number, required: true },
    vehicle_FuelDate: { type: Date, required: true }
});

const VehicleMaintenanceSchema = new mongoose.Schema({
    vehicle_Num: { type: String, required: true },
    vehicle_MainCost: { type: Number, required: true },
    vehicle_MainDate: { type: Date, required: true },
    vehicle_Description: { type: String, required: true }
});

const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', VehicleSchema);
const VehicleMillageFuel = mongoose.models.VehicleMillageFuel || mongoose.model('VehicleMillageFuel', VehicleMillageFuelSchema);
const VehicleMaintenance = mongoose.models.VehicleMaintenance || mongoose.model('VehicleMaintenance', VehicleMaintenanceSchema);

module.exports = { Vehicle, VehicleMillageFuel, VehicleMaintenance };
