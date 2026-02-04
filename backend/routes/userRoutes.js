const express = require("express");
const router = express.Router();
const User = require("../models/User");

// ✅ Count users
router.get("/count", async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (err) {
    console.error("❌ Error fetching user count:", err);
    res.status(500).json({ error: "Failed to fetch user count" });
  }
});

// ✅ Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// ✅ 🔍 Get user by ID number (for your UserInformation screen)
router.get("/findByIdNumber/:id_number", async (req, res) => {
  try {
    const { id_number } = req.params;
    const user = await User.findOne({ id_number });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error("❌ Error finding user by ID number:", err);
    res.status(500).json({ error: "Failed to find user" });
  }
});

module.exports = router;
