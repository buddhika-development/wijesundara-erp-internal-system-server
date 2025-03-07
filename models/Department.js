const mongoose = require('mongoose')

const DepartmentSchema = new mongoose.Schema({
    department_id : {
        type : Number,
        required : true
    },
    department_name : {
        type : String,
        required : true
    }
})

const Department = mongoose.models.Department || mongoose.model('Department', DepartmentSchema)

module.exports = Department