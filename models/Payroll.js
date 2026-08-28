import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },

    // Salary Details
    basicSalary: {
      type: Number,
      required: true,
    },

    allowance: {
      type: Number,
      default: 0,
    },

    overtime: {
      type: Number,
      default: 0,
    },

    bonus: {
      type: Number,
      default: 0,
    },

    // Deductions
    deduction: {
      type: Number,
      default: 0,
    },

    tax: {
      type: Number,
      default: 0,
    },

    leaveDeduction: {
      type: Number,
      default: 0,
    },

    // Final Salary
    grossSalary: {
      type: Number,
      required: true,
    },

    totalDeduction: {
      type: Number,
      required: true,
    },

    netSalary: {
      type: Number,
      required: true,
    },

    month: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending",
    },

    paidDate: {
      type: Date,
      default: null,
    },

    paymentMethod: {
      type: String,
      enum: [
        "Bank Transfer",
        "Cash",
        "UPI",
      ],
      default: "Bank Transfer",
    },
  },
  {
    timestamps: true,
  }
);


// Prevent duplicate payroll

payrollSchema.index(
  {
    employee: 1,
    month: 1,
  },
  {
    unique: true,
  }
);


export default mongoose.model(
  "Payroll",
  payrollSchema
);