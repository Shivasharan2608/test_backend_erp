import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// LOGIN - SEND VERIFICATION EMAIL
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check password
    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    // Generate random verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Save token and expiry
    user.loginVerificationToken = verificationToken;

    // Token valid for 10 minutes
    user.loginVerificationExpires = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await user.save();

    // Frontend URL
    const frontendUrl =
      process.env.FRONTEND_URL || "http://localhost:5173";

    const verificationUrl =
      `${frontendUrl}/verify-login?token=${verificationToken}&email=${encodeURIComponent(user.email)}`;

    // Send email
    await sendEmail({
      email: user.email,
      subject: "Verify Your Login - Employee Portal",
      text: `Click the following link to verify your login: ${verificationUrl}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          
          <h2 style="color: #4f46e5;">
            Employee Portal Login Verification
          </h2>

          <p>Hello ${user.name},</p>

          <p>
            Someone is trying to log in to your Employee Portal account.
          </p>

          <p>
            If this was you, click the button below to complete your login:
          </p>

          <div style="margin: 30px 0;">
            <a
              href="${verificationUrl}"
              style="
                background-color: #4f46e5;
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 8px;
                display: inline-block;
                font-weight: bold;
              "
            >
              Verify & Login
            </a>
          </div>

          <p>
            This link will expire in <strong>10 minutes</strong>.
          </p>

          <p>
            If you did not attempt to log in, you can safely ignore this email.
          </p>

          <p>
            Regards,<br />
            Employee Portal
          </p>

        </div>
      `,
    });

    // IMPORTANT:
    // Do NOT generate JWT here.
    res.status(200).json({
      success: true,
      message:
        "Verification email sent. Please check your email to complete login.",
    });

  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to send verification email",
    });
  }
};


// VERIFY LOGIN
export const verifyLogin = async (req, res) => {
  try {
    const { token, email } = req.query;

    if (!token || !email) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification link",
      });
    }

    // Find user
    const user = await User.findOne({
      email,
      loginVerificationToken: token,
      loginVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Verification link is invalid or expired",
      });
    }

    // Clear verification token
    user.loginVerificationToken = null;
    user.loginVerificationExpires = null;

    await user.save();

    // Generate JWT only after email verification
    const authToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      success: true,
      message: "Login verified successfully",
      token: authToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Verify login error:", error);

    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};