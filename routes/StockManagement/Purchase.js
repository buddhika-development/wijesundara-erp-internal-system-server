const express = require('express')
const Purchase = require('../../models/Purchase')
const Stock = require('../../models/Stock')
const { request2 } = require('../../models/HRDepartment')
const router = express.Router()

router.get('/', async (req,res) => {
    const purchases = await Purchase.find().sort({ purchase_date: -1 })
    res.status(200).json(purchases) 
})


router.get('/purchase/:id', async(req, res) => {

    try{
        const id = req.params.id
        const purchase = await Purchase.findById(id)
    
        res.status(200).json(purchase)
    }
    catch(err) {
        res.status(500).json({
            'message' : 'Something went wrong in the process...'
        })
    }
})


router.delete('/purchase/remove/:id', async (req,res) => {

    try{
        const id = req.params.id
        const purchase = await Purchase.findByIdAndDelete(id)

        res.status(200).json({
            'message' : 'Successfully removed..'
        })
    }
    catch(err){
        console.log(`Something went wrong in the puchase remove process... ${err}`)
        res.status(500).json({
            'message' : 'Something went wrong...'
        })
    }
})


router.patch('/purchase/update/approve/:id', async(req, res) => {

    try{
        const id = req.params.id
        const purchase = await Purchase.findByIdAndUpdate({
            purchase_status : 'approved'
        })

        res.json(purchase)
        
    }
    catch(err) {
        console.log(`Something went wrong in data fetching process.. ${err}`)
        res.status(500).json({
            'message' : 'Something went wrong. check again.'
        })
    }
    
})

router.patch('/purchase/update/reject/:id', async(req, res) => {

    try{
        const id = req.params.id
        const purchase = await Purchase.findByIdAndUpdate({
            purchase_status : 'reject'
        })

        res.json(purchase)
        
    }
    catch(err) {
        console.log(`Something went wrong in data fetching process.. ${err}`)
        res.status(500).json({
            'message' : 'Something went wrong. check again.'
        })
    }
    
})



router.get('/purchase_stats', async (req, res) => {

    try {
        const purchase_response = await fetch('http://localhost:5000/api/purchase')
        const supplier_response = await fetch('http://localhost:5000/api/suppliers')
        const rice_varient_reponse = await fetch('http://localhost:5000/api/rice_varient')

        let purchases_details =[];

        if(purchase_response.ok && supplier_response.ok && rice_varient_reponse.ok) {
            const purchase_details = await purchase_response.json()
            const supplier_detials = await supplier_response.json()
            const rice_varient_details = await rice_varient_reponse.json()

            for (let purchase of purchase_details) {
                for (let supplier of supplier_detials){
                    if (purchase["supplier_id"] === supplier["_id"]){
                        for (let rice_varient of rice_varient_details){

                            if(purchase["rice_varient"] === rice_varient["_id"]){   
                                const temp_details = {...purchase, ...supplier, ...rice_varient}

                                const purchase_details = {
                                    purchase_details : purchase,
                                    supplier : supplier,
                                    rice_varient : rice_varient
                                }
                                purchases_details.push(purchase_details)
                            }
                        }
                    }
                }
            }
            
            res.status(200).json(purchases_details)
        }
        else {
            throw new Error('Somethign went wrong in data fetchin....')
        }
    }
    catch(err) {
        res.status(500).json({
            'message' : 'Something went wrong in data fetching...'
        })
    }
})


router.post('/add_purchase', async (req, res) => {

    // access the data from request body
    const supplier_id = req.body.supplier
    const rice_type = req.body.rice_type
    const stock_amount = req.body.stock_amount
    const last_update_date = Date.now() 
    
    if (rice_type != "" && stock_amount != "" && supplier_id != "") {
        try{
    
            await Purchase.create({
                supplier_id : supplier_id,
                rice_varient : rice_type,
                stock_amount : stock_amount,
                purchase_date : last_update_date,
                purchase_status : "pending"
            })

            res.json({
                'message' : 'Successly created....'
            })
                
        }
        catch(err) {
            console.log(`Something went wrong... ${err}`)
            res.status(500).json({
                'message' : 'Something went wrong.. Check again and submit the details.'
            })
        }
    }
    else {
        res.status(500).json({
            'message' : 'Please fill all the fields...'
        })
    }
    
})


router.post("/requestApproval", async (req, res) => {
    const { sec_id, amount, description, bank_account } = req.body;
  
    try {
      const requestInstance = new request2({
        sec_id: sec_id,
        amount: amount,
        description: description,
        status: "",
        bankAccount: bank_account || null,
      });
  
      await requestInstance.save();
      res.status(201).json({ message: "Approval request submitted successfully", request: requestInstance });
    } catch (error) {
      console.error("Error submitting approval request:", error.message, error.stack);
      res.status(500).json({ error: "Failed to submit approval request" });
    }
});


module.exports = router