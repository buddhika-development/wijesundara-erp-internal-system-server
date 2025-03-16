const express = require('express');
const mongoose = require('mongoose');
const { request, section } = require('../models/request');

const router = express.Router();

router.get('/requests', async (req, res) => {
  try {
    console.log("Request received at /requests");

    if (mongoose.connection.readyState !== 1) {
      throw new Error("Mongoose is not connected to MongoDB");
    }

    const requests = await request.find();
    
 
    

    res.status(200).json({ requests });
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

router.post('/all', async (req, res) => {

    const {sec_id} = req.body;
    const {status}="-";
    console.log(sec_id);
  try {
    console.log("All fetched");
  
    if (mongoose.connection.readyState !== 1) {
      throw new Error("Mongoose is not connected to MongoDB");
    }

    const requests = await request.find({sec_id,status});
 
    

    res.status(200).json({ requests });
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});
router.post('/api/action/:id', async (req, res) => {
    console.log("hi hi");
    const {status} = req.body;
    const {id} =req.params;
    console.log(status); 
  try {
    const validStatuses = ["approve", "decline", "pending"];
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const updatedRequest = await request.findByIdAndUpdate(
      id,
      { status: status.toLowerCase() }, 
      { new: true, runValidators: true } 
    );

    if (mongoose.connection.readyState !== 1) {
      throw new Error("Mongoose is not connected to MongoDB");
    }

    
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});


module.exports = router;