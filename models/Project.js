import mongoose from "mongoose";


const projectSchema =
  new mongoose.Schema(

    {

      name: {

        type: String,

        required: true,

      },


      description: {

        type: String,

        default: "",

      },


      manager: {

        type:
          mongoose.Schema.Types.ObjectId,

        ref: "Employee",

      },


      team: [

        {

          type:
            mongoose.Schema.Types.ObjectId,

          ref: "Employee",

        },

      ],


      startDate: {

        type: Date,

      },


      endDate: {

        type: Date,

      },


      status: {

        type: String,

        enum: [

          "Planning",

          "In Progress",

          "Completed",

          "On Hold",

        ],

        default:
          "Planning",

      },


      progress: {

        type: Number,

        default: 0,

        min: 0,

        max: 100,

      },


      budget: {

        type: Number,

        default: 0,

      },

    },

    {

      timestamps: true,

    }

  );


export default mongoose.model(

  "Project",

  projectSchema

);