const express = require('express')
const Bid = require('../../models/Bid')
const router = express.Router()

router.get('/', async (req, res) => {

    try{
        const full_bid_details = []
        const bids = await Bid.find().sort({bid_price : 1})
        
        for (let bid of bids){
            const supplier_id = bid["supplier_id"]
            const rice_varient_id = bid["rice_varient"]

            const supplier_response = await fetch(`http://localhost:8080/api/suppliers/supplier/${supplier_id}`)
            const supplier_details = await supplier_response.json()

            const rice_varient_response = await fetch(`http://localhost:8080/api/rice_varient/${rice_varient_id}`)
            const rice_varient_details = await rice_varient_response.json()

            const single_bid_details = {
                bid_details : bid.toObject(),
                supplier_details : supplier_details,
                rice_varient : rice_varient_details
            }

            full_bid_details.push(single_bid_details)
        }
        
        
        res.status(200).json(full_bid_details)
    }
    catch(err){
        console.log(`Something went wrong in bid retrieving process... ${err}`)
        res.status(500).json({
            message : `Someting went wrong in bids detais retreiving process...`
        })
    }
    
})

module.exports = router