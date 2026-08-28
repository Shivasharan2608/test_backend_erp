import Payroll from "../models/Payroll.js";
import Employee from "../models/Employee.js";





export const createPayroll = async (req, res) => {

  try {

    const {
      employeeId,
      month,
      allowance,
      overtime,
      bonus,
      deduction,
      tax,
      leaveDeduction,
      paymentMethod,
    } = req.body;


    // Validate required fields

    if (!employeeId || !month) {

      return res.status(400).json({
        success: false,
        message: "Employee and month are required",
      });

    }


    // Find Employee

    const employee =
      await Employee.findById(employeeId);


    if (!employee) {

      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });

    }


    // Check duplicate payroll

    const existingPayroll =
      await Payroll.findOne({

        employee: employeeId,

        month,

      });


    if (existingPayroll) {

      return res.status(400).json({

        success: false,

        message:
          "Payroll already exists for this employee and month",

      });

    }


    // Basic Salary

    const basicSalary =
      Number(employee.salary);


    // Earnings

    const allowanceAmount =
      Number(allowance) || 0;

    const overtimeAmount =
      Number(overtime) || 0;

    const bonusAmount =
      Number(bonus) || 0;


    // Deductions

    const deductionAmount =
      Number(deduction) || 0;

    const taxAmount =
      Number(tax) || 0;

    const leaveDeductionAmount =
      Number(leaveDeduction) || 0;


    // Calculate Gross Salary

    const grossSalary =

      basicSalary +

      allowanceAmount +

      overtimeAmount +

      bonusAmount;


    // Total Deduction

    const totalDeduction =

      deductionAmount +

      taxAmount +

      leaveDeductionAmount;


    // Net Salary

    const netSalary =

      grossSalary -

      totalDeduction;


    // Create Payroll

    const payroll =
      await Payroll.create({

        employee: employeeId,

        basicSalary,

        allowance: allowanceAmount,

        overtime: overtimeAmount,

        bonus: bonusAmount,

        deduction: deductionAmount,

        tax: taxAmount,

        leaveDeduction:
          leaveDeductionAmount,

        grossSalary,

        totalDeduction,

        netSalary,

        month,

        paymentMethod,

      });


    res.status(201).json({

      success: true,

      message:
        "Payroll generated successfully",

      data: payroll,

    });


  } catch (error) {

    // Handle duplicate index error

    if (error.code === 11000) {

      return res.status(400).json({

        success: false,

        message:
          "Payroll already exists for this employee and month",

      });

    }


    console.error(error);


    res.status(500).json({

      success: false,

      message:
        "Internal Server Error",

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


      const updateData = {

        status,

      };


      // Add payment date

      if (status === "Paid") {

        updateData.paidDate =
          new Date();

      }


      const payroll =
        await Payroll.findByIdAndUpdate(

          req.params.id,

          updateData,

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

        message:
          error.message,

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