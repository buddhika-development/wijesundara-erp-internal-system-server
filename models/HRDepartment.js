const mongoose = require('mongoose');

// Department Schema
const DepartmentSchema = new mongoose.Schema({
    department_id: {
        type: Number,
        required: true,
        unique: true
    },
    department_name: {
        type: String,
        required: true
    }
});

// Employee Schema
const EmployeeSchema = new mongoose.Schema({
    employee_id: {
        type: Number,
        required: true,
        unique: true
    },
    employee_name: {
        type: String,
        required: true
    },
    employee_dob: {
        type: Date,
        required: true
    },
    employee_address_address_line_one: {
        type: String,
        required: true
    },
    employee_address_address_line_two: {
        type: String
    },
    employee_address_address_city: {
        type: String,
        required: true
    },
    employee_bank_account_number: {
        type: Number,
        required: true
    },
    employee_status: {
        type: String,
        required: true
    }
});

// Job Role Schema
const JobRoleSchema = new mongoose.Schema({
    job_role_id: {
        type: Number,
        required: true,
        unique: true
    },
    job_role_name: {
        type: String,
        required: true
    },
    job_role_sallery: {
        type: Number,
        required: true
    }
});

// Employee,department,jobrole Relation Schema
const EmployeeDepartmentSchema = new mongoose.Schema({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Employee',
        required: true
    },
    department_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Department',
        required: true
    },
    jobrole_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'JobRole',
        required: true
    }
});

// Models 
const Department = mongoose.model('Department', DepartmentSchema);
const Employee = mongoose.model('Employee', EmployeeSchema);
const JobRole = mongoose.model('JobRole', JobRoleSchema);
const EmployeeDepartment = mongoose.model('EmployeeDepartment', EmployeeDepartmentSchema);

module.exports = { Department, Employee, JobRole, EmployeeDepartment };
