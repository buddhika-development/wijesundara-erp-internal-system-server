const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db_connection = require('./utils/db');
const finance_router = require('./routes/finance');

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use('/', finance_router);

db_connection();

app.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
});