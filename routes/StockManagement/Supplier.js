const express = require('express')
const router = express.Router()
const Supplier = require('../../models/Supplier')

router.get('/', async (req,res) => {

    try{
        const suppliers = await Supplier.find()
        res.json(suppliers)
    }
    catch(err){
        console.log(`Something went wrong in all supplier data retrieving process.. ${err}`)
        res.status(500).json({
            'message' : 'Something went wrong in data retrieving proccess...'
        })
    }
})


// get details about single suppplier
router.get('/supplier/:id', async(req, res) => {

    try{
        const supplier_id = req.params.id

        console.log(supplier_id)
        
        const supplier_details = await Supplier.findById(supplier_id)
        res.status(200).json(supplier_details)
    }
    catch(err){
        console.log(`Something went wrong in single supplier data retrieving process... ${err}`)
        res.status(500).json({
            'message' : 'Something went wrong in data retrieving proceess..'
        })
    }
    
})


module.exports = router