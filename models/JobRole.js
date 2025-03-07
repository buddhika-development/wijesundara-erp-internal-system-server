const mongoose = require('mongoose')

const JobRoleSchema = new mongoose.Schema({
    job_role_id : {
        type : Number,
        require : true
    },
    job_role_name : {
        type : String,
        require : true
    },
    job_role_sallery : {
        type : Number,
        require : true
    }
})

const JobRole = mongoose.models.JobRole || mongoose.model('JobRole', JobRoleSchema)

module.exports = JobRole