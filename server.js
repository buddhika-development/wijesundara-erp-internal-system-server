const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db_connection = require('./utils/db');
const finance_router = require('./routes/finance');

dotenv.config();

// configure basic app
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// access port values
const PORT = process.env.PORT || 5000;

// api routers
app.use('/', finance_router);

// Database connection
db_connection();

// Start server
app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});