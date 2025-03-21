const express = require('express');
const dotenv = require('dotenv');
const db_connection = require('./utils/db');
const stock_router = require('./routes/stock');

const vehicleRoutes= require('./routes/vehicleRoutes');
const vehicleFuelRoutes = require('./routes/vehicleFuelRoutes');
const vehicleMaintenanceRoutes = require('./routes/vehicleMaintenanceRoute');

const cors = require('cors');



dotenv.config()

// configure basic app
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(cors());


// access port values
const PORT = process.env.PORT || 8080

// setup api routers
app.use('/api/stock', stock_router)
app.use('/api/vehicles',vehicleRoutes);
app.use('/api/vehicle-fuel', vehicleFuelRoutes);
app.use('/api/vehicle-maintenance', vehicleMaintenanceRoutes);

db_connection()

app.listen(PORT, ()=> {
    console.log(`Backend server running in port ${PORT}`)
})