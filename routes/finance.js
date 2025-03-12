const express = require('express');
const mongoose = require('mongoose');
const { request } = require('../models/request'); 

const router = express.Router();

router.get('/requests', async (req, res) => {
    try {
        console.log("Request received at /requests");

        if (mongoose.connection.readyState !== 1) {
            throw new Error("Mongoose is not connected to MongoDB");
        }

        const requests = await request.find(); 
        console.log(requests);

        res.status(200).json({ requests });
    } catch (err) {
        console.error("Error fetching requests:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});

module.exports = router;
