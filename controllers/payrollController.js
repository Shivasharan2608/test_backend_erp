import Payroll from "../models/Payroll.js";
import Employee from "../models/Employee.js";


// Create Payroll
export const createPayroll = async (req, res) => {
  try {
    const {
      employeeId,
      allowance,
      deduction,
      month,
    } = req.body;

    // Validate required fields
    if (!employeeId || !month) {
      return res.status(400).json({
        success: false,
        message: "Employee and month are required",
      });
    }

    // Validate Employee
    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    // Prevent duplicate payroll
    const existingPayroll = await Payroll.findOne({
      employee: employeeId,
      month,
    });

    if (existingPayroll) {
      return res.status(400).json({
        success: false,
        message:
          "Payroll already generated for this employee for this month",
      });
    }

    // Employee salary becomes basic salary
    const basicSalary = employee.salary;

    // Convert values to numbers
    const allowanceAmount = Number(allowance) || 0;

    const deductionAmount = Number(deduction) || 0;

    // Calculate Net Salary
    const netSalary =
      basicSalary +
      allowanceAmount -
      deductionAmount;

    // Create Payroll
    const payroll = await Payroll.create({
      employee: employeeId,
      basicSalary,
      allowance: allowanceAmount,
      deduction: deductionAmount,
      netSalary,
      month,
    });

    res.status(201).json({
      success: true,
      message: "Payroll generated successfully",
      data: payroll,
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};


// Get All Payrolls
export const getPayrolls = async (req, res) => {

  try {

    const payrolls =
      await Payroll.find()
        .populate(
          "employee",
          "name email department"
        )
        .sort({
          createdAt: -1,
        });


    res.status(200).json({

      success: true,

      count: payrolls.length,

      data: payrolls,

    });


  } catch (error) {

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};


// Update Payroll Status
export const updatePayrollStatus =
  async (req, res) => {

    try {

      const { status } = req.body;


      if (
        !["Pending", "Paid"].includes(
          status
        )
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Status must be Pending or Paid",

        });

      }


      const payroll =
        await Payroll.findByIdAndUpdate(

          req.params.id,

          {
            status,
          },

          {
            new: true,
          }

        );


      if (!payroll) {

        return res.status(404).json({

          success: false,

          message:
            "Payroll record not found",

        });

      }


      res.status(200).json({

        success: true,

        message:
          "Payroll status updated successfully",

        data: payroll,

      });


    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message,

      });

    }

  };


// Delete Payroll
export const deletePayroll =
  async (req, res) => {

    try {

      const payroll =
        await Payroll.findByIdAndDelete(
          req.params.id
        );


      if (!payroll) {

        return res.status(404).json({

          success: false,

          message:
            "Payroll record not found",

        });

      }


      res.status(200).json({

        success: true,

        message:
          "Payroll deleted successfully",

      });


    } catch (error) {

      res.status(500).json({

        success: false,

        message: error.message,

      });

    }

  };