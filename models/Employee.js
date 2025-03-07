const mongoose = require('mongoose')

const EmployeeSchema = new mongoose.Schema({
    employee_id : {
        type : Number,
        required : true
    },
    employee_name : {
        type : String,
        require : true
    },
    employee_dob : {
        type : Date,
        required : true
    },
    employee_address_address_line_one : {
        type : String,
        required : true
    },
    employee_address_address_line_tw0 : {
        type : String
    },
    employee_address_address_city : {
        type : String,
        required : true
    },
    employee_bank_account_number : {
        type : Number,
        required : true
    },
    employee_status : {
        type : String,
        required : true
    }
})

const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);

module.exports = Employee