const express = require('express');
const dotenv = require('dotenv');
const db_connection = require('./utils/db');
const employeeRoutes = require('./routes/employeeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const jobroleRoutes = require('./routes/jobroleRoutes');
const employeeDepartmentRoutes = require('./routes/employeeDepartmentRoutes');

dotenv.config();

// configure basic app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// access port values
const PORT = process.env.PORT || 5000;

// api routers
app.use('/api/employee', employeeRoutes);
app.use('/api/department', departmentRoutes);
app.use('/api/jobrole', jobroleRoutes);
app.use('/api/relation', employeeDepartmentRoutes);

// Database connection
db_connection();

// Start server
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});
