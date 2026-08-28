import express from "express";

import {
  createPayroll,
  getPayrolls,
  updatePayrollStatus,
  deletePayroll,
} from "../controllers/payrollController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// Create Payroll
router.post(
  "/",
  authMiddleware,
  createPayroll
);


// Get All Payroll Records
router.get(
  "/",
  authMiddleware,
  getPayrolls
);


// Update Payroll Status
router.put(
  "/:id/status",
  authMiddleware,
  updatePayrollStatus
);


// Delete Payroll
router.delete(
  "/:id",
  authMiddleware,
  deletePayroll
);


export default router;