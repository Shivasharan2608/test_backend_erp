import express from "express";

import {
  registerUser,
  loginUser,
  verifyLogin,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/verify-login", verifyLogin);

export default router;