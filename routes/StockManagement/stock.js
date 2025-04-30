const express = require('express');
const Stock = require('../../models/Stock');
const router = express.Router();

const status = ["processing", "store", "waiting"]

router.get('/', async (req, res) => {
    try{
        const stock_details = await Stock.find()
        res.status(200).json(stock_details)
    }
    catch(err) {
        console.log("Something went wrong... " + err)
        res.status(500).json({
            'message' : 'Something went wrong data fetching....'
        })
    }
})

router.post('/', async (req, res) => {

    // access the data from request body
    const rice_type = req.body.rice_type.trim()
    const stock_amount = req.body.stock_amount.trim()
    const stock_status = req.body.stock_status.trim()
    const stock_place = req.body.stock_place.trim()
    const last_update_date = Date.now()
    
    if (rice_type && stock_amount && stock_status && stock_place) {
        try{
    
            await Stock.create({
                rice_varient : rice_type,
                stock_amount : stock_amount,
                stock_status : stock_status,
                stock_premise : stock_place,
                last_updated_date : last_update_date
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


router.patch('/:stock_id', async (req, res) => {

    const stock_id = req.params.stock_id;
    const stock_status = req.body.status.trim()

    if(status.includes(stock_status.toLowerCase())) {

        await Stock.findByIdAndUpdate(stock_id, {
            stock_status : status
        })
        
        res.json({
            'message' : 'Successfully updated'
        })
    }
    else {
        res.status(500).json({
            'message' : 'Please enter valid details...'
        })
    }

}) 



router.get('/availability_stats', async (req,res) => {

    const stock_response = await fetch('http://localhost:8080/api/stock/')
    const rice_varient_response = await fetch('http://localhost:8080/api/rice_varient')
    const infrastructure_response = await fetch('http://localhost:8080/api/infrastructure')

    if( stock_response.ok && rice_varient_response.ok && infrastructure_response.ok) {
        const stock_details = await stock_response.json()
        const rice_varient_details = await rice_varient_response.json()
        const infrastructure_details = await infrastructure_response.json()

        let stock_stat = []

        for (let stock of stock_details){
            for (let rice_varient of rice_varient_details) {
                if (stock["rice_varient"] == rice_varient["_id"]) {

                    for (let infra of infrastructure_details) {
                        if(stock["stock_premise"] == infra["_id"]) {
                            const temp_stock = {...stock, ...rice_varient, ...infra}
                            stock_stat.push(temp_stock)

                        }
                    }
                }
            }
        }

        res.status(200).json(stock_stat)
    }
    else{
        res.status(500).json({
            'message' : 'something went wrong data fetching process...'
        })

    }
})



module.exports = router