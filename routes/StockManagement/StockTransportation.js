const express = require('express')
const mongoose = require('mongoose')
const { TransportationTask, TransportationTaskAssignment} = require('../../models/StockTransportation');
const { route } = require('../salaryRoutes');
const router = express.Router()


router.get('/', async (req,res) => {
    try {
        const transportation_task_details = await TransportationTask.find().sort({transportation_date : -1})
    
        res.status(200).json(transportation_task_details)
    }
    catch(err) {
        console.log("Something went wrong.... " + err)
        res.status(500).json({
            'message' : 'Something went wrong.. Please try again.'
        })
    }
})

// update task states
router.patch('/update_task/:id', async(req,res) => {

    try{
        const task_id = "680efa1bc93e06cad3bbd91b";
        const task = await TransportationTask.find(task_id)
        
        res.json('message')
    }
    catch(err){
        console.log(`Something went wrong in transporation state update process... ${err}`)
        res.status(500).json({
            'message' : 'Something went wrong..'
        })
    }
    
})


router.post('/', async (req, res) => {

    // extract data from the request body
    const transportation_source = req.body.source_location
    const transportation_destination = req.body.destination_location
    const transportation_status = req.body.status
    const transportation_rice_type = req.body.rice_type
    const transportation_stock = req.body.stock
    const transportation_date = Date.now()

    try {

        await TransportationTask.insertOne({
            transportation_source: transportation_source,
            transportation_destination : transportation_destination,
            transportation_status : transportation_status,
            transportation_date : transportation_date,
            rice_type : transportation_rice_type,
            stock_amount : transportation_stock
        })
        
        res.status(201).json({
            'message' : 'successfully created'
        })
    }
    catch(err) {
        console.log("Something went wrong.... " + err)
        res.status(500).json({
            'message' : 'Something went wrong please check details and try again later...'
        })
    }
    
})


router.get('/trasnportation_task_assginment', async (req, res) => {

    try{
        const transportaion_task_assignment_details = await TransportationTaskAssignment.find()
        res.json(transportaion_task_assignment_details)
    }
    catch(err) {
        console.log(`Something went wrong : ${err}`)
        res.status(500).json({
            'message' : 'Something went wrong...'
        })
    }
})


// access the single transportation task details using the transportation id
router.get('/task/:task_id' , async (req, res) => {
    
    try{
        const task_id = req.params.task_id;
        const task = await TransportationTask.findById(task_id)
        
        res.json(task)
    }
    catch(err) {
        console.log(`Something went wrong in single task accessing process... ${err}`)
        res.status(500).json({
            'message' : 'something went wrong...'
        })
    }
    
})


router.get('/transportation_tasks/waiting', async (req, res) => {

    try {

        let task_full_details_list = []
        
        const transportation_task_response = await fetch('http://localhost:8080/api/transportaion_task')
        const infrastructure_response = await fetch('http://localhost:8080/api/infrastructure')
        const rice_varient_response = await fetch("http://localhost:8080/api/rice_varient")

        if (!transportation_task_response.ok || !infrastructure_response.ok || !rice_varient_response.ok) {
            throw new Error("Something went wtong in task details acessing process...")
        }

        const transporation_tasks = await transportation_task_response.json()
        const infrastructures = await infrastructure_response.json()
        const rice_varients = await rice_varient_response.json()
        
        const waiting_tasks = transporation_tasks.filter((transporation_task) => transporation_task["transportation_status"] == 'waiting')

        for (let waiting_task of waiting_tasks){
            const source_details = infrastructures.find((infrastructure) => infrastructure["_id"] == waiting_task["transportation_source"])
            const destination_details = infrastructures.find((infrastructure) => infrastructure["_id"] == waiting_task["transportation_destination"])
            const rice_varient_details = rice_varients.find((rice_varient) => rice_varient["_id"] == waiting_task["rice_type"])
            
            const task_full_details = {
                task_details : waiting_task,
                source_details : source_details,
                destination_details : destination_details,
                rice_varient_details : rice_varient_details
            }

            task_full_details_list.push(task_full_details)
        }
        
        res.status(200).json(task_full_details_list)
    }
    catch(err){
        console.log(`Something went wrong task accessing process.... ${err}`)
        res.status(500).json({
            'message' : 'Something went wrong...'
        })
    }
    
})



router.get('/trasnportation_task_assginment/stats' , async (req, res) => {

    try{
        const transportaion_assignment_full_details = []

        const transportation_task_response = await fetch('http://localhost:8080/api/transportaion_task')
        const transportation_task_assignment_response  = await fetch('http://localhost:8080/api/transportaion_task/trasnportation_task_assginment')
        const infrastructure_response = await fetch('http://localhost:8080/api/infrastructure')

        if(transportation_task_assignment_response.ok && transportation_task_response.ok && infrastructure_response.ok) {
            const transportation_task_details = await transportation_task_response.json()
            const transportation_task_assignment_details = await transportation_task_assignment_response.json()
            const infrastructure_details = await infrastructure_response.json()

            for( let transportaion_task_assignment of transportation_task_assignment_details) {
                for (let transport_task of transportation_task_details) {
                    if(transport_task["_id"] === transportaion_task_assignment["transportation_task_id"]) {

                        let source_details = null;
                        let destination_detail = null;
                        
                        for( let infrastructure of infrastructure_details) {
                            if( transport_task["transportation_source"] === infrastructure["_id"]){
                                source_details = infrastructure
                            }
                        }

                        for(let infrastructure of infrastructure_details) {
                            if( transport_task["transportation_destination"] === infrastructure["_id"]) {
                                destination_detail = infrastructure;
                            }
                        }
                        
                        transportaion_assignment_full_details.push({
                            ...transport_task, 
                            ...transportaion_task_assignment,
                            source : source_details,
                            destination : destination_detail
                        })
                    }
                }
                
            }

            res.status(200).json(transportaion_assignment_full_details)
            
        }
        else{
            throw new Error("Something went wrong in data fetching....")
        }
    }
    catch(err) {
        console.log(`Something went wrong... ${err}`)
        res.status(500).json({
            'message' : 'Successfully getted..'
        })
    }
})



// route about access the pending transportaion details
router.get('/task/status/pending', async (req, res) => {
    try{
        const pending_tasks = await TransportationTask.find({transportation_status : "waiting"})
        const pending_tasks_full_details = []

        for (let pending_task of pending_tasks){
            const transaction_source_id = pending_task.transportation_source
            const transaction_destination_id = pending_task.transportation_destination

            // transportaiton source detials
            const transaction_source_response = await fetch(`http://localhost:8080/api/infrastructure/infrastructures/${transaction_source_id}`)
            const transaction_source_details = await transaction_source_response.json()
            
            // transaport destination details
            const transaction_destination_response = await fetch(`http://localhost:8080/api/infrastructure/infrastructures/${transaction_destination_id}`)
            const transaction_destination_details = await transaction_destination_response.json()

            const full_details = {
                task_details: pending_task.toObject(),
                source_details: transaction_source_details,
                destination_details: transaction_destination_details
            }

            pending_tasks_full_details.push(full_details)
            
        }
        
        res.status(200).json(pending_tasks_full_details)
    }
    catch(err){
        console.log(`Something went wrong in data fetching in pending task searching process... ${err}`)
        res.status(500).json({
            'message' : `Sometihng went wrong in fetching data in the pending task.... ${err}`
        })
    }
})


module.exports = router