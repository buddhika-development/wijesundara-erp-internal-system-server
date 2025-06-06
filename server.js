const express = require('express');
const dotenv = require('dotenv');

const db_connection = require('./utils/db');
const finance_router = require('./routes/finance');
const salaryRoutes = require('./routes/salaryRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const jobroleRoutes = require('./routes/jobroleRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const employeeDepartmentRoutes = require('./routes/employeeDepartmentRoutes');
const bidRoute = require('./routes/StockManagement/Bid')
const intrastructureRoute = require('./routes/StockManagement/Infrastructure')
const purchasesRoute = require('./routes/StockManagement/Purchase')
const riceVarientRoute = require('./routes/StockManagement/RiceVarient')
const stockRoute = require('./routes/StockManagement/stock')
const stockTransportaionRoute = require('./routes/StockManagement/StockTransportation')
const supplierRoute = require('./routes/StockManagement/Supplier')

const vehicleRoutes = require('./routes/vehicleRoutes');
const vehicleFuelRoutes = require('./routes/vehicleFuelRoutes');
const vehicleMaintenanceRoutes = require('./routes/vehicleMaintenanceRoute');

const cors = require('cors');
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// access port values
const PORT = process.env.PORT || 5000;

app.use('/', finance_router);
app.use('/api/salary', salaryRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/jobrole', jobroleRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/relation', employeeDepartmentRoutes);

app.use('/api/stock', stockRoute)
app.use('/api/infrastructure', intrastructureRoute)
app.use('/api/rice_varient', riceVarientRoute)
app.use('/api/transportaion_task', stockTransportaionRoute)
app.use('/api/suppliers', supplierRoute)
app.use('/api/bids', bidRoute)
app.use('/api/purchase', purchasesRoute)

app.use('/api/vehicles', vehicleRoutes);
app.use('/api/vehicle-fuel', vehicleFuelRoutes);
app.use('/api/vehicle-maintenance', vehicleMaintenanceRoutes);

db_connection();

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});