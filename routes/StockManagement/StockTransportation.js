const express = require('express')
const mongoose = require('mongoose')
const TransportationTask = require('../../models/StockTransportation')
const router = express.Router()

const TransportationTaskAssignmentModel = TransportationTask.TransportationTaskAssignment;
const TransportationTaskModel = TransportationTask.TransportationTask;

router.get('/', async (req,res) => {
    try {
        const transportation_task_details = await TransportationTaskModel.find()
    
        res.status(200).json(transportation_task_details)
    }
    catch(err) {
        console.log("Something went wrong.... " + err)
        res.status(500).json({
            'message' : 'Something went wrong.. Please try again.'
        })
    }
})


router.get('/transportation_stats', async (req, res) => {
    
    try{
        const transportaion_tasks_response = await fetch('http://localhost:8080/api/transportaion_task')
        const infrastructure_response = await fetch('http://localhost:8080/api/infrastructure')

        if(transportaion_tasks_response.ok && infrastructure_response.ok) {
            const transportaion_detail = await transportaion_tasks_response.json()
            const infrastructure_details = await infrastructure_response.json()

            // for (let transport of transportaion_detail){
            //     for (let infrastructure of infrastructure_details){
            //         if(trans)
            //     }
            // }
        }
        else{
            res.status(500).json({
                'message' : "Something went wrong in data fetching..."
            })
        }
        
    }
    catch(err) {
        console.log("something went wrong in while data fetching.... " + err)
        res.status(500).json({
            'message' : 'Someting went wrong while data fetching...........'
        })
    }
})


router.post('/', async (req, res) => {

    // extract data from the request body
    const transportation_source = req.body.transportation_source.trim()
    const transportation_destination = req.body.transportation_destination.trim()
    const transportation_status = req.body.transportation_status.trim()
    const transportation_date = req.body.transportation_date.trim()

    try {

        await TransportationTask.insertOne({
            transportation_source: transportation_source,
            transportation_destination : transportation_destination,
            transportation_status : transportation_status,
            transportation_date : transportation_date
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
        const transportaion_task_assignment_details = await TransportationTaskAssignmentModel.find()
        res.json(transportaion_task_assignment_details)
    }
    catch(err) {
        console.log(`Something went wrong : ${err}`)
        res.status(500).json({
            'message' : 'Something went wrong...'
        })
    }
})



router.get('/task/:task_id' , async (req, res) => {
    const task_id = req.params.task_id;
    console.log(task_id)    

    try{
        const task = await TransportationTaskModel.find({
            _id : task_id
        })
        console.log(task)

        res.json({
            'message' : 'success'
        })        
    }
    catch(err) {
        res.status(500).json({
            'message' : 'something went wrong...'
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



module.exports = router