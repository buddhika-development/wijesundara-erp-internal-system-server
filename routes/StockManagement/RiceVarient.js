const express = require('express')
const RiceVarient = require('../../models/RiceVarient')
const router = express.Router()

router.get('/', async (req, res) => {
    try{
        const rice_varients = await RiceVarient.find();
        res.status(200).json(rice_varients)
    }
    catch(err) {
        console.log("Something went wrong data loading... " + err)
        res.status(500).json({
            'message' : 'Something went wrong...'
        })
    }

} )


// add new rice varient
router.post('/', async (req, res) => {
    // access the data from request body
    const rice_type = req.body.rice_type.trim()

    if(rice_type != "") {
        try {
            await RiceVarient.create({
                rice_type : rice_type
            })

            res.status(201).json({
                'message' : 'successfully inserted...'
            })
        }
        catch(err) {
            console.log("Something went wrong in data insertion... " + err)
            res.status(500).json({
                'message' : 'Something went wrong.. Please try again later....'
            })
        }
    } 
    
})


// access the rice varient details through the api endpoint using the mongodb database and 
router.get('/:id', async (req,res) => {
    const rice_varient_id = req.params.id;

    try{
        const rice_type_details = await RiceVarient.findById(rice_varient_id)
        
        if (rice_type_details){
            res.status(200).json(rice_type_details)
        }
        else{
            res.status(404).json({
                'message' : 'There is no that kind of rice type. please check the detials.'
            })
        }
    }
    catch(err){
        console.error(`Something went wrong in data accessing in rice varient.. ${err}`)
        res.status(500).json({
            'message' : 'Something happening bad in backend rice type finding... ' + err
        })
    }
    
})

module.exports = router