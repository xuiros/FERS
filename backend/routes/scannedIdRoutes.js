const express = require("express");
const router = express.Router();
const ScannedId = require("../models/Scannedid"); 

router.get("/findByIdNumber/:idNumber", async (req, res) => {
  try {
    const { idNumber } = req.params;
    const record = await ScannedId.findOne({ id_number: idNumber });

    if (!record) {
      return res.status(404).json({ message: "ID not found" });
    }

    res.json(record);
  } catch (error) {
    console.error("❌ Error fetching scanned ID:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
