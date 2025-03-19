const express = require('express');
const mongoose = require('mongoose');
const { request, section,pending ,bank} = require('../models/request');



const router = express.Router();

router.get('/requests', async (req, res) => {
  try {
    console.log("Request received at /requests");

    if (mongoose.connection.readyState !== 1) {
      throw new Error("Mongoose is not connected to MongoDB");
    }


    
    const requests = await request.find({
     
        $or: [
            { status: { $exists: false } }, 
            { status: "" }                  
        ]
    });


    res.status(200).json({ requests });
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});


router.get('/requests1', async (req, res) => {
    try {
      console.log("Request received at /requests");
  
      if (mongoose.connection.readyState !== 1) {
        throw new Error("Mongoose is not connected to MongoDB");
      }
  
  
      
      const requests = await request.find({
       
          $or: [
             
              { status: "approve" }                  
          ]
      });
  
  console.log("duum",requests);
      res.status(200).json({ requests });
    } catch (err) {
      console.error("Error fetching requests:", err);
      res.status(500).json({ message: "Internal server error", error: err.message });
    }
  });
  
  router.post('/requests2', async (req, res) => {
    try {
      console.log("nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
  
      if (mongoose.connection.readyState !== 1) {
        throw new Error("Mongoose is not connected to MongoDB");
      }
  
      const { status, sec_id } = req.body;
      console.log("nnnnnnnnnnnnnnnnnnnnnnn", status,sec_id);
  
      
      if (!status) {
        return res.status(400).json({ message: "Status is required" });
      }
      if (!sec_id) {
        return res.status(400).json({ message: "sec_id is required" });
      }
  
      let requests; 
      if (sec_id === "HR123") {
 
        requests = await request.find({ status: status, sec_id: sec_id });
        
      } else if (sec_id === "Tra123") {
       
        requests = await request.find({ status: status , sec_id: sec_id});
      }
  
      console.log("duum", requests);
      res.status(200).json({ requests });
    } catch (err) {
      console.error("Error fetching requests:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  });

router.post('/all', async (req, res) => {
    const { sec_id } = req.body;
    console.log(sec_id);

    try {
        console.log("All fetched");

        if (mongoose.connection.readyState !== 1) {
            throw new Error("Mongoose is not connected to MongoDB");
        }

        
        const requests = await request.find({
            sec_id: sec_id,
            $or: [
                { status: { $exists: false } }, 
                { status: "" }                  
            ]
        });

        console.log(requests);
        res.status(200).json({ requests });
    } catch (err) {
        console.error("Error fetching requests:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});



router.post('/pending', async (req, res) => {
    const { sec_id } = req.body;
    console.log(sec_id);
    console.log("zzzzzzzzzzzzzzzzzzzzzzzz");
   
    try {
        console.log("methana ok");

        if (mongoose.connection.readyState !== 1) {
            throw new Error("Mongoose is not connected to MongoDB");
        }

        
        const requests = await pending.find({  sec_id: sec_id });

        console.log(requests);
        res.status(200).json({ requests });
    } catch (err) {
        console.error("Error fetching requests:", err);
        res.status(500).json({ message: "Internal server error", error: err.message });
    }
});



router.post('/api/action/:id', async (req, res) => {
    console.log("hi hi");
    const {status} = req.body;
    const {description} = req.body;
    const {sec_id} = req.body;
    const {date} = req.body;
    const {amount} = req.body;
    const {id} =req.params;
    const {approveAmount} =req.body;
    const {bankAccount} =req.body;
    console.log("anuda",bankAccount); 

    console.log("anuda",status); 
    try {
    const validStatuses2 = ["approve", "decline"];
    const validStatuses = ["approve", "decline", "pending"];
    const validStatuses1 = [ "pending"];
    const validStatuses3 = [ "approve"];
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status value" });
    }
   
    const updatedRequest = await request.findByIdAndUpdate(
        id,
        {
          status: status.toLowerCase(), 
        },
        { new: true, runValidators: true } 
      );
    
    
      console.log("anuda1",updatedRequest); 

      if(status && validStatuses3.includes(status.toLowerCase()))
        {
            const updatedRequest3 = await request.findByIdAndUpdate(
                id,
                {
                  amount: approveAmount, 
                  bankAccount:bankAccount,
                },
                { new: true, runValidators: true }
              );
              const bank1 = await bank.findOne({bank_id:bankAccount});
              console.log("ss",bank1.Bamount)
              
              bank1.Bamount -= approveAmount;
              const updatedRequest4 = await bank.findByIdAndUpdate(
                bank1._id,
                {
                    Bamount:  bank1.Bamount, 
                 
                },
                { new: true, runValidators: true }
              );
            }




if(status && validStatuses2.includes(status.toLowerCase())){
    
    const deletedPending1 = await pending.findByIdAndDelete(id);
   
}

if(status && validStatuses1.includes(status.toLowerCase()))
{
    const document = {
        _id: id,
        sec_id,
        amount: amount || 0,
        description,
        date,
      };

      const result = await pending.create(document);
      console.log("Inserted into pending collection with same _id:", result);
    }

   

    
  } catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});


module.exports = router;