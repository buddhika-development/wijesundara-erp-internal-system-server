const express = require('express')
const Infrastructure = require('../../models/Infrastructure')
const router = express.Router()

// basic deatils related to constraints
const INFRASTRUCTURE_TYPE = ['office', 'stores', 'processing plant']

router.get('/', async (req,res) => {
    try {
        const infrastructure_details = await Infrastructure.find()
        res.status(200).json(infrastructure_details)
    }
    catch(err) {
        console.log("Something went wrong while data loading.. " +err)
        res.status(500).json({
            "message" : "Something went wrong..."
        })
    }
})


router.post('/', async (req,res) => {

    // access body data abd  modify the data
    const infrastructuer_name = req.body.infrastructure_name;
    const infrastructuer_type = req.body.infrastructure_type;
    const infrastructure_address_line_one = req.body.ingfrastructuire_address_line_one;
    const infrastructure_address_line_two = req.body.infrastructure_address_line_two;
    const infrastructure_address_district = req.body.infrastructure_address_district;
    const ingfrastructuire_address_city = req.body.ingfrastructuire_address_city;
    const contact_number = req.body.infrastructure_contact_number;

    console.log("name:" + infrastructuer_name, " type "+ infrastructuer_type, "district" +infrastructure_address_district,"line two" + infrastructure_address_line_two,"line one " +infrastructure_address_line_one, "line city " +ingfrastructuire_address_city, " contact number " + contact_number)

    // check data availability
    if (infrastructuer_name && infrastructuer_type && infrastructure_address_district && infrastructure_address_line_one && ingfrastructuire_address_city) {

        // validate the required data
        if (INFRASTRUCTURE_TYPE.includes(infrastructuer_type.toLowerCase())) {
            try {   
    
                // insert data into database
                const result = await Infrastructure.create({
                    infrastructure_name : infrastructuer_name,
                    infrastructure_type : infrastructuer_type,
                    infrastructure_address_line_one : infrastructure_address_line_one,
                    infrastructure_address_line_two : infrastructure_address_line_two,
                    infrastructure_address_district : infrastructure_address_district,
                    infrastructure_address_city : ingfrastructuire_address_city,
                    contact_number : contact_number
                })
    
                // check insertion status and send response related to reponse
                if (result) {
                    res.status(201).json({
                        'message' : 'Successfully inserted..'
                    })
                }
                else{
                    res.status(500).json({
                        'message' : 'SOmething happening in data insertion process...'
                    })
                }
                
            }
            catch(err) {
                console.log("Something went wrong in data insertion process..... "+ err)
                res.status(500).json({
                    'message' : 'Something went wrong.'
                })
            }
        }
        else{
            res.status(500).json({
                'message' : 'Please include valid infrastructure type...'
            })
        }
    }

    else {
        res.status(500).json({
            "message" : "Please provide all the values..." 
        })
    }
})


// access the infrastructure details using the infrastructure unique id
router.get('/infrastructures/:infrastructure_id' , async (req, res) => {

    const infrastructure_type = req.params.infrastructure_id; 

    try{
        const infrastructuers = await Infrastructure.findById(infrastructure_type)
        res.status(200).json(infrastructuers)
    }
    catch(err) {
        console.log("Something went wrongin data fetching... " + err)
        res.status(500).json({
            'message' : 'Something went wrong in data fetching..'
        })
    }
})


router.get('/:infrastructure_type', (req, res) => {

    // access the param details
    const infrastructuer_type = req.params.infrastructure_type;

    try{

        const infrastructuers = Infrastructure.find({
            infrastructure_type : infrastructuer_type
        })
        res.status(200).json(infrastructuers)
        
    }
    catch(err) {
        console.log(`Something went wrong in data fetching ${err}`)
        res.status(500).json({
            'message' : 'Something went wrong in data fetching...'
        })
    }
    
})


module.exports = router