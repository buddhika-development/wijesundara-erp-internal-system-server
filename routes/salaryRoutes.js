const express = require("express");
const router = express.Router();
const { Attendance, EmployeeDepartment, request, JobRole } = require("../models/HRDepartment");

const getMonthRange = (year, month) => {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    return { firstDay, lastDay };
};

const calculateSalary = (basicSalary, extraDays, monthlyBonus, attendanceBonusPerExtraDay) => {
    const employeeEpfRate = 0.08;  
    const employerEpfRate = 0.12;  
    const employerEtfRate = 0.03; 

    basicSalary = Number(basicSalary) || 0;
    extraDays = Number(extraDays) || 0;
    monthlyBonus = Number(monthlyBonus) || 0;
    attendanceBonusPerExtraDay = Number(attendanceBonusPerExtraDay) || 200;

    const employeeEpf = basicSalary * employeeEpfRate;
    const employerEpf = basicSalary * employerEpfRate;
    const employerEtf = basicSalary * employerEtfRate;

    const attendanceBonus = extraDays * attendanceBonusPerExtraDay;
    const netSalary = (basicSalary - employeeEpf) + monthlyBonus + attendanceBonus;
    const totalEmployerCost = basicSalary + employerEpf + employerEtf + attendanceBonus + monthlyBonus;

    return { employeeEpf, employerEpf, employerEtf, attendanceBonus, netSalary, totalEmployerCost };
};

router.get("/:employee_id/:year/:month", async (req, res) => {
    const { employee_id, year, month } = req.params;

    try {
        const { firstDay, lastDay } = getMonthRange(year, month);
        const attendanceRecords = await Attendance.find({
            employee_id,
            date: { $gte: firstDay, $lte: lastDay },
            attended: true,
        });

        const totalDaysAttended = attendanceRecords.length;
        const extraDays = Math.max(0, totalDaysAttended - 20);

        if (totalDaysAttended === 0) {
            return res.status(404).json({ message: "No attendance records found for this employee in the given month." });
        }

        const employeeRelation = await EmployeeDepartment.findOne({ employee_id }).populate("jobrole_id");

        if (!employeeRelation || !employeeRelation.jobrole_id) {
            return res.status(404).json({ message: "Job role not found for this employee." });
        }

        const jobRole = employeeRelation.jobrole_id;
        const baseSalary = jobRole.job_role_salary;
        const monthlyBonus = jobRole.monthly_bonus;
        const attendanceBonusPerExtraDay = jobRole.attendance_bonus_per_extra_day;

        console.log("Job Role:", jobRole.job_role_name);
        console.log("Base Salary:", baseSalary);
        console.log("Monthly Bonus:", monthlyBonus);
        console.log("Attendance Bonus Per Extra Day:", attendanceBonusPerExtraDay);

        if (!baseSalary || isNaN(baseSalary)) {
            return res.status(400).json({ error: "Invalid base salary for this job role." });
        }

        const salaryDetails = calculateSalary(baseSalary, extraDays, monthlyBonus, attendanceBonusPerExtraDay);

        return res.status(200).json({
            employee_id,
            job_role: jobRole.job_role_name,
            month: `${year}-${month}`,
            baseSalary,
            totalDaysAttended,
            extraDays,
            attendanceBonus: salaryDetails.attendanceBonus,
            monthlyBonus,
            employeeEPF: salaryDetails.employeeEpf,
            employerEPF: salaryDetails.employerEpf,
            employerETF: salaryDetails.employerEtf,
            netSalary: salaryDetails.netSalary,
            totalEmployerCost: salaryDetails.totalEmployerCost,
        });

    } catch (error) {
        console.error("Error calculating salary:", error);
        return res.status(500).json({ error: "Failed to calculate salary." });
    }
});

router.post("/requestApproval", async (req, res) => {
    const { year, month, totalSalary, bankAccount } = req.body;
  
    try {
      const requestInstance = new request({
        sec_id: "HR123",
        amount: totalSalary,
        description: `Employee salaries for ${year} ${month}`,
        status: "",
        bankAccount: bankAccount || null,
      });
  
      await requestInstance.save();
      res.status(201).json({ message: "Approval request submitted successfully", request: requestInstance });
    } catch (error) {
      console.error("Error submitting approval request:", error.message, error.stack);
      res.status(500).json({ error: "Failed to submit approval request" });
    }
});

router.get("/approvedRequests", async (req, res) => {
    try {
      const approvedRequests = await request.find({ status: "approve", sec_id: "HR123" });
      if (!approvedRequests || approvedRequests.length === 0) {
        return res.status(404).json({ message: "No approved requests found for HR123." });
      }
      res.status(200).json(approvedRequests);
    } catch (error) {
      console.error("Error fetching approved requests:", error);
      res.status(500).json({ error: "Failed to fetch approved requests." });
    }
});

module.exports = router;