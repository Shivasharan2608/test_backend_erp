import mongoose from "mongoose";


const taskSchema =
  new mongoose.Schema(

    {

      title: {

        type: String,

        required: true,

      },


      description: {

        type: String,

        default: "",

      },


      project: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Project",

        required: true,

      },


      assignedTo: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Employee",

        required: true,

      },


      priority: {

        type: String,

        enum: [

          "Low",

          "Medium",

          "High",

          "Critical",

        ],

        default:
          "Medium",

      },


      status: {

        type: String,

        enum: [

          "To Do",

          "In Progress",

          "Completed",

        ],

        default:
          "To Do",

      },


      dueDate: {

        type: Date,

      },

    },

    {

      timestamps: true,

    }

  );


export default mongoose.model(

  "Task",

  taskSchema

);