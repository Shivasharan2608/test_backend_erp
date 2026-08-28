import mongoose from "mongoose";


const attendanceSchema =
  new mongoose.Schema(

    {

      employee: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Employee",

        required: true,

      },


      date: {

        type: Date,

        required: true,

      },


      status: {

        type: String,

        enum: [

          "Present",

          "Absent",

          "Half Day",

          "Leave",

        ],

        default: "Present",

      },


      checkIn: {

        type: String,

        default: null,

      },


      checkOut: {

        type: String,

        default: null,

      },


      workingHours: {

        type: Number,

        default: 0,

      },

    },

    {

      timestamps: true,

    }

  );


// One attendance per employee per day

attendanceSchema.index(

  {

    employee: 1,

    date: 1,

  },

  {

    unique: true,

  }

);


export default mongoose.model(

  "Attendance",

  attendanceSchema

);