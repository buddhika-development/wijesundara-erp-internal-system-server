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

module.exports = router