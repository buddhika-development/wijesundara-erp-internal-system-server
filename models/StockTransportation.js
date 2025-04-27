const mongoose = require('mongoose')

const TransportationTaskSchema = new mongoose.Schema({
    transportation_source : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Infrastructure',
        required : true
    },
    transportation_destination : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Infrastructure',
        required : true
    },
    transportation_status : {
        type : String,
        required : true
    },
    transportation_date : {
        type : Date,
        required : true
    },
    rice_type : {
        type : String,
        required : true
    }
})


const TransportationTaskAssignmentsSchema = new mongoose.Schema({
    transportation_task_id : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "TransportationTask",
        required : true
    },
    transportation_vehivle_number : {
        type : String,
        required :true
    },
    transportation_driver_name : {
        type : String,
        required : true
    },
    transportation_contact_number : {
        type : String,
        required : true
    }
})


const TransportationTask = mongoose.models.TransportationTask || mongoose.model('TransportationTask', TransportationTaskSchema)
const TransportationTaskAssignment = mongoose.models.TransportationTaskAssignment || mongoose.model('TransportationTaskAssignment', TransportationTaskAssignmentsSchema)
module.exports = { TransportationTask, TransportationTaskAssignment}