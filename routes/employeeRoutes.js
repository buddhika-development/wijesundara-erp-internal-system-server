const express = require('express');
const { Employee, EmployeeDepartment } = require('../models/HRDepartment');
const router = express.Router();

// Add employee and link to department/job role
router.post('/', async (req, res) => {
  const { 
    employee_id, 
    employee_name, 
    employee_dob, 
    employee_address_address_line_one, 
    employee_address_address_line_two, 
    employee_address_address_city, 
    employee_bank_account_number, 
    employee_status, 
    department_id,  // New field: ObjectId of Department
    jobrole_id      // New field: ObjectId of JobRole
  } = req.body;

  try {
    // Create the employee
    const employee = new Employee({
      employee_id,
      employee_name,
      employee_dob,
      employee_address_address_line_one,
      employee_address_address_line_two,
      employee_address_address_city,
      employee_bank_account_number,
      employee_status: employee_status || 'active', // Default to 'active'
    });
    const savedEmployee = await employee.save();

    // Create the relationship with department and job role
    if (department_id && jobrole_id) {
      const relation = new EmployeeDepartment({
        employee_id: savedEmployee._id,
        department_id,
        jobrole_id,
      });
      await relation.save();
    } else {
      return res.status(400).json({ error: 'Department ID and Job Role ID are required to link the employee' });
    }

    res.status(201).json({ message: 'Employee added and linked successfully', employee: savedEmployee });
  } catch (err) {
    console.error('Error adding employee:', err);
    res.status(400).json({ error: err.message });
  }
});

// Get all employees
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update employee details and relationships
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { 
      employee_id, 
      employee_name, 
      employee_dob, 
      employee_address_address_line_one, 
      employee_address_address_line_two, 
      employee_address_address_city, 
      employee_bank_account_number, 
      employee_status, 
      department_id, 
      jobrole_id 
    } = req.body;
  
    try {
      const employee = await Employee.findById(id);
      if (!employee) {
        return res.status(404).json({ error: 'employee not found' });
      }
  
      if (employee_id !== undefined) employee.employee_id = employee_id;
      if (employee_name) employee.employee_name = employee_name;
      if (employee_dob) employee.employee_dob = employee_dob;
      if (employee_address_address_line_one) employee.employee_address_address_line_one = employee_address_address_line_one;
      if (employee_address_address_line_two !== undefined) employee.employee_address_address_line_two = employee_address_address_line_two;
      if (employee_address_address_city) employee.employee_address_address_city = employee_address_address_city;
      if (employee_bank_account_number) employee.employee_bank_account_number = employee_bank_account_number;
      if (employee_status) employee.employee_status = employee_status;
  
      await employee.save();
  
      // Update or create department/job role relationship
      if (department_id || jobrole_id) {
        let relation = await EmployeeDepartment.findOne({ employee_id: id });
        if (relation) {
          // Update existing relation
          if (department_id) relation.department_id = department_id;
          if (jobrole_id) relation.jobrole_id = jobrole_id;
          await relation.save();
        } else {
          // Create new relation if none exists
          if (!department_id || !jobrole_id) {
            return res.status(400).json({ error: 'Both department_id and jobrole_id are required to create a new relationship' });
          }
          relation = new EmployeeDepartment({
            employee_id: id,
            department_id,
            jobrole_id,
          });
          await relation.save();
        }
      }
  
      res.json({ message: 'Employee updated successfully', employee });
    } catch (err) {
      console.error('Error updating employee:', err);
      res.status(400).json({ error: err.message });
    }
  });


// Update employee status
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { employee_status } = req.body;

  try {
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    if (employee_status) {
      employee.employee_status = employee_status;
    }

    await employee.save();
    res.json(employee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;