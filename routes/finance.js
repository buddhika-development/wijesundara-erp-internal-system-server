const express = require('express');
const mongoose = require('mongoose');
const { request, section , pending ,bank,total} = require('../models/request');



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
      }   else if (sec_id === "ST123") {
       
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

      let requests; 
      if (sec_id == null) {
          requests = await pending.find({});
      } else {
          requests = await pending.find({ sec_id: sec_id }); 
      }

      console.log("pendings", requests);
      res.status(200).json(requests);
  } catch (err) {
      console.error("Error fetching requests:", err);
      res.status(500).json({ message: "Internal server error", error: err.message });
  }
});
router.post('/Bank',async(req,res) =>
{
  const {bank_id} = req.body;

  console.log("qq",bank_id)
  try{
    console.log("bank ek ahri");
    const request= await bank.find({bank_id:bank_id})
    const Bamount = await bank.findOne();

    console.log("qw",Bamount.Bamount);

    const totals =+ Bamount;

     //const updatedRequest4 = await total.findByIdAndUpdate(
    //    {
    //      total: totals, 
       
    //  },
    // )
    console.log(total);
    console.log(request);
    res.status(200).json( request );
  }catch (err) {
    console.error("Error fetching requests:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
}
})
router.post('/api/inaction/:id', async (req, res) => {
  const { amount, bankName, sec_id, status } = req.body;
  const validStatuses3 = ["INB123"];

  console.log("enoooo", amount, bankName, sec_id, status);

  try {
    

    const bankAccount = await bank.findOne({ bank_id: bankName });
    console.log("fetched", bankAccount);
    
    const bankAccount1 = await bank.findOne({bank_id: "BO123" })
    const bankAccount2 = await bank.findOne({bank_id: "HN123" })
    const bankAccount3 = await bank.findOne({bank_id: "RD123" })

console.log(bankAccount1)
    const newAmount = bankAccount.Bamount + (amount);
    const newAmount1 =bankAccount1.Bamount + parseFloat(((amount)*30/100).toFixed(2));
    const newAmount2 =bankAccount2.Bamount + parseFloat(((amount)*20/100).toFixed(2));
    const newAmount3 =bankAccount3.Bamount + parseFloat(((amount)*10/100).toFixed(2));
    const newAmount22 = bankAccount.Bamount + ((amount)-( parseFloat(amount*60/100).toFixed(2)));

    console.log("BO",newAmount1);
    console.log("HN",newAmount2);
    console.log("RD",newAmount3);

    console.log("updated value", newAmount22);

    const updatedRequest1 = await bank.findOneAndUpdate(
      { bank_id: "RD123" },
      { Bamount: newAmount3 },
      { new: true, runValidators: true }
    );
    const updatedRequest2 = await bank.findOneAndUpdate(
      { bank_id: "HN123" },
      { Bamount: newAmount2 },
      { new: true, runValidators: true }
    );
    const updatedRequest4 = await bank.findOneAndUpdate(
      { bank_id: "BO123" },
      { Bamount: newAmount1 },
      { new: true, runValidators: true }
    );
    const updatedRequest3 = await bank.findOneAndUpdate(
      { bank_id: bankName },
      { Bamount: newAmount22 },
      { new: true, runValidators: true }
    );

   

    let updatedRequest = null;
    const idd = await request.findOne({ sec_id: sec_id });
    if (idd && idd.sec_id === "IN123") {
      updatedRequest = await request.findByIdAndUpdate(
        req.params.id,
        { status: status },
        { new: true, runValidators: true }
      );
     
    }

   
  } catch (error) {
    console.error("Error updating bank account:", error);
    res.status(500).json({ message: "Server error", error: error.message });
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
    console.log("anudaSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS"); 
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


router.get("/approvedRequests", async (req, res) => {
  try {
    const approvedRequests = await request.find({ status: "approve", sec_id: "HR123" });
    if (!approvedRequests || approvedRequests.length === 0) {
      return res.status(404).json({ message: "No approved requests found for HR123." });
    }
    res.status(200).json(approvedRequests);
  } catch (error) {
    console.error("Error fetching approved requests:", error);
    res.status(500).json({ error: "Failed to fetch approved requests." });
  }
});

module.exports = router;