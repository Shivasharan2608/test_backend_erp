import Employee from "../models/Employee.js";
import Department from "../models/Department.js";
import Payroll from "../models/Payroll.js";

export const getDashboardStats = async (req, res) => {
  try {

    // =========================
    // EMPLOYEE STATISTICS
    // =========================

    const totalEmployees =
      await Employee.countDocuments();


    // =========================
    // DEPARTMENT STATISTICS
    // =========================

    const totalDepartments =
      await Department.countDocuments();


    // =========================
    // TOTAL EMPLOYEE SALARY
    // =========================

    const salaryData =
      await Employee.aggregate([
        {
          $group: {
            _id: null,

            totalSalary: {
              $sum: "$salary",
            },
          },
        },
      ]);


    const totalSalary =
      salaryData.length > 0
        ? salaryData[0].totalSalary
        : 0;


    // =========================
    // PAYROLL STATISTICS
    // =========================

    const totalPayrolls =
      await Payroll.countDocuments();


    // Total amount of all generated payrolls
    const payrollAmountData =
      await Payroll.aggregate([
        {
          $group: {
            _id: null,

            totalPayrollAmount: {
              $sum: "$netSalary",
            },
          },
        },
      ]);


    const totalPayrollAmount =
      payrollAmountData.length > 0
        ? payrollAmountData[0].totalPayrollAmount
        : 0;


    // =========================
    // PAID PAYROLL
    // =========================

    const paidPayrollData =
      await Payroll.aggregate([
        {
          $match: {
            status: "Paid",
          },
        },

        {
          $group: {
            _id: null,

            totalPaidAmount: {
              $sum: "$netSalary",
            },
          },
        },
      ]);


    const totalPaidAmount =
      paidPayrollData.length > 0
        ? paidPayrollData[0].totalPaidAmount
        : 0;


    // =========================
    // PENDING PAYROLL
    // =========================

    const pendingPayrolls =
      await Payroll.countDocuments({
        status: "Pending",
      });


    const pendingPayrollData =
      await Payroll.aggregate([
        {
          $match: {
            status: "Pending",
          },
        },

        {
          $group: {
            _id: null,

            totalPendingAmount: {
              $sum: "$netSalary",
            },
          },
        },
      ]);


    const totalPendingAmount =
      pendingPayrollData.length > 0
        ? pendingPayrollData[0].totalPendingAmount
        : 0;


    // =========================
    // RESPONSE
    // =========================

    res.status(200).json({

      success: true,

      data: {

        // Employee
        totalEmployees,

        // Department
        totalDepartments,

        // Salary
        totalSalary,

        // Payroll
        totalPayrolls,
        totalPayrollAmount,

        // Paid
        totalPaidAmount,

        // Pending
        pendingPayrolls,
        totalPendingAmount,

      },

    });

  } catch (error) {

    console.error("Dashboard Error:", error);

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }
};