const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// 🧩 POST /api/auth/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // 🧠 Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // 🔍 Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // 🔐 Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    // 🎟️ Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        assignedStation: user.assignedStation,
      },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "7d" }
    );

    // ✅ Successful login
    res.status(200).json({
      message: "Login successful.",
      token,
      user: {
        _id: user._id,
        email: user.email,
        role: user.role,
        assignedStation: user.assignedStation,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
});

module.exports = router;
