import Employee from "../models/Employee.js";
import Department from "../models/Department.js";

export const getDashboardStats = async (req, res) => {
  try {

    const totalEmployees = await Employee.countDocuments();

    const totalDepartments = await Department.countDocuments();

    const salaryData = await Employee.aggregate([
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

    res.status(200).json({
      success: true,
      data: {
        totalEmployees,
        totalDepartments,
        totalSalary,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};