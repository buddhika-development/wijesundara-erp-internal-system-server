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
        required: [true, "Employee ID is required"],
        unique: true,
        min: [1, "Employee ID must be a positive number"],
    },
    employee_name: {
        type: String,
        required: [true, "Name is required"],
        match: [/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"]
    },
    employee_dob: {
        type: Date,
        required: [true, "Date of Birth is required"]
    },
    employee_address_address_line_one: {
        type: String,
        required: [true, "Address Line 1 is required"]
    },
    employee_address_address_line_two: {
        type: String
    },
    employee_address_address_city: {
        type: String,
        required: true,
        match: [/^[a-zA-Z\s]+$/, "City must contain only letters and spaces"]
    },
    employee_bank_account_number: {
        type: Number,
        required: true,
        match: [/^\d+$/, "Bank account number must contain only numbers"],
        // minLength: [8, "Bank account Number must be at least 8 digits"],
        // maxLength: [16, "Bank account number must not exceed 16 digits"]
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
    job_role_salary: {
        type: Number,
        required: true
    },
    monthly_bonus: {  
        type: Number,
        required: true,
        default: 0  
    },
    attendance_bonus_per_extra_day: {  
        type: Number,
        required: true,
        default: 500 
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

// Attendance Schema
const AttendanceSchema = new mongoose.Schema({
    employee_id: {
        type: mongoose.Schema.Types.ObjectId,  // Reference to Employee collection
        ref: 'Employee',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    attended: {
        type: Boolean,
        required: true
    }
});

const BankRequests = new mongoose.Schema({
    sec_id: {
        type: String,
        required: true
    },
    amount: {
        type: Number, 
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: false
    },
    bankAccount: {
        type: String,
        required: false
    }
});

// Models 
const Department = mongoose.model('Department', DepartmentSchema);
const Employee = mongoose.model('Employee', EmployeeSchema);
const JobRole = mongoose.model('JobRole', JobRoleSchema);
const Attendance = mongoose.model('Attendance', AttendanceSchema);
const EmployeeDepartment = mongoose.model('EmployeeDepartment', EmployeeDepartmentSchema);

const request2 = mongoose.model('request2', BankRequests, "All");

module.exports = { Department, Employee, JobRole, Attendance, EmployeeDepartment, request2 };

