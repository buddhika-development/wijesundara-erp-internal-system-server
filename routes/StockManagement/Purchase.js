const express = require('express')
const Purchase = require('../../models/Purchase')
const Stock = require('../../models/Stock')
const router = express.Router()

router.get('/', async (req,res) => {
    const purchases = await Purchase.find()
    res.status(200).json(purchases) 
})


router.get('/purchase_stats', async (req, res) => {

    try {
        const purchase_response = await fetch('http://localhost:8080/api/purchase')
        const supplier_response = await fetch('http://localhost:8080/api/suppliers')
        const rice_varient_reponse = await fetch('http://localhost:8080/api/rice_varient')

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
                                purchases_details.push(temp_details)
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


    console.log('supplier id ' + supplier_id + " rice type " + rice_type + "stock amount " + stock_amount)
    
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


module.exports = router