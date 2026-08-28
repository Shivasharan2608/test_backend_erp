import express from "express";

import {

  markAttendance,

  getAttendance,

  updateAttendance,

  deleteAttendance,

} from "../controllers/attendanceController.js";

import authMiddleware from "../middleware/authMiddleware.js";


const router =
  express.Router();


// Mark Attendance

router.post(

  "/",

  authMiddleware,

  markAttendance

);


// Get Attendance

router.get(

  "/",

  authMiddleware,

  getAttendance

);


// Update Attendance

router.put(

  "/:id",

  authMiddleware,

  updateAttendance

);


// Delete Attendance

router.delete(

  "/:id",

  authMiddleware,

  deleteAttendance

);


export default router;