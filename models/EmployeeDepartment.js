const mongoose = require('mongoose')
const Employee = require('./Employee')
const Department = require('./Department')
const JobRole = require('./JobRole')

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

const EmployeeDepartment = mongoose.models.EmployeeDepartment || mongoose.model('EmployeeDepartment', EmployeeDepartmentSchema)

module.exports = EmployeeDepartment