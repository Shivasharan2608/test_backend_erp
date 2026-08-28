import express from "express";

import {

  createProject,

  getProjects,

  updateProject,

  deleteProject,

} from "../controllers/projectController.js";

import authMiddleware from "../middleware/authMiddleware.js";


const router =
  express.Router();


router.post(
  "/",
  authMiddleware,
  createProject
);


router.get(
  "/",
  authMiddleware,
  getProjects
);


router.put(
  "/:id",
  authMiddleware,
  updateProject
);


router.delete(
  "/:id",
  authMiddleware,
  deleteProject
);


export default router;