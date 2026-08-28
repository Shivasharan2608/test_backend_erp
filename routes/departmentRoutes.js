import express from "express";

import {
  createDepartment,
  getDepartments,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createDepartment);

router.get("/", authMiddleware, getDepartments);

router.put("/:id", authMiddleware, updateDepartment);

router.delete("/:id", authMiddleware, deleteDepartment);

export default router;