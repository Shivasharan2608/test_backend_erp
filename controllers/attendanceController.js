import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";


// ===============================
// MARK ATTENDANCE
// ===============================

export const markAttendance =
  async (req, res) => {

    try {

      const {

        employeeId,

        date,

        status,

        checkIn,

        checkOut,

      } = req.body;


      if (
        !employeeId ||
        !date
      ) {

        return res.status(400).json({

          success: false,

          message:
            "Employee and date are required",

        });

      }


      // Check employee

      const employee =
        await Employee.findById(
          employeeId
        );


      if (!employee) {

        return res.status(404).json({

          success: false,

          message:
            "Employee not found",

        });

      }


      // Calculate working hours

      let workingHours = 0;


      if (
        checkIn &&
        checkOut
      ) {

        const start =
          new Date(
            `1970-01-01T${checkIn}`
          );

        const end =
          new Date(
            `1970-01-01T${checkOut}`
          );


        const difference =
          end - start;


        workingHours =
          difference /
          (1000 * 60 * 60);

      }


      const attendance =
        await Attendance.create({

          employee: employeeId,

          date,

          status,

          checkIn,

          checkOut,

          workingHours,

        });


      res.status(201).json({

        success: true,

        message:
          "Attendance marked successfully",

        data: attendance,

      });


    } catch (error) {

      if (error.code === 11000) {

        return res.status(400).json({

          success: false,

          message:
            "Attendance already marked for this employee",

        });

      }


      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };


// ===============================
// GET ALL ATTENDANCE
// ===============================

export const getAttendance =
  async (req, res) => {

    try {

      const attendance =
        await Attendance.find()

          .populate(
            "employee",
            "name email department"
          )

          .sort({
            date: -1,
          });


      res.status(200).json({

        success: true,

        count:
          attendance.length,

        data:
          attendance,

      });


    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };


// ===============================
// UPDATE ATTENDANCE
// ===============================

export const updateAttendance =
  async (req, res) => {

    try {

      const attendance =
        await Attendance.findByIdAndUpdate(

          req.params.id,

          req.body,

          {

            new: true,

            runValidators: true,

          }

        );


      if (!attendance) {

        return res.status(404).json({

          success: false,

          message:
            "Attendance record not found",

        });

      }


      res.status(200).json({

        success: true,

        message:
          "Attendance updated successfully",

        data:
          attendance,

      });


    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };


// ===============================
// DELETE ATTENDANCE
// ===============================

export const deleteAttendance =
  async (req, res) => {

    try {

      const attendance =
        await Attendance.findByIdAndDelete(

          req.params.id

        );


      if (!attendance) {

        return res.status(404).json({

          success: false,

          message:
            "Attendance record not found",

        });

      }


      res.status(200).json({

        success: true,

        message:
          "Attendance deleted successfully",

      });


    } catch (error) {

      res.status(500).json({

        success: false,

        message:
          error.message,

      });

    }

  };