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

const EmployeeDepartmentSchema = new mongoose.Schema({
    employee_id : {
        type : Number,
        author : ref(Employee)
    },
    department_id : {
        type: Number,
        author : ref(Department)
    },
    jobrole_id : {
        type : Number,
        author : ref(JobRole)
    }
})

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
const EmployeeDepartment = mongoose.models.EmployeeDepartment || mongoose.model('EmployeeDepartment', EmployeeDepartmentSchema)
const Employee = mongoose.models.Employee || mongoose.model('Employee', EmployeeSchema);
const Department = mongoose.models.Department || mongoose.model('Department', DepartmentSchema)

module.exports = Department, JobRole, EmployeeDepartment, Employee