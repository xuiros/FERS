const express = require("express");
const router = express.Router();
const Report = require("../models/Report");
const User = require("../models/User");
const fetchFn = typeof fetch !== "undefined" ? fetch : require("node-fetch");

/* ------------------------------ 📏 Distance Function ------------------------------ */
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/* ------------------------------ 📍 Reverse Geocoding ------------------------------ */
async function getAddressFromCoords(lat, lng) {
  try {
    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    const response = await fetchFn(url);
    const data = await response.json();

    if (data.status === "OK" && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (err) {
    console.error("⚠️ Error fetching address:", err);
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

/* ------------------------------ 📤 GET /api/reports ------------------------------ */
/**
 * Fetch reports filtered by admin email or station name
 */
router.get("/", async (req, res) => {
  try {
    const { adminEmail, stationName } = req.query;
    let query = {};

    if (adminEmail) {
      query["assignedStation.email"] = adminEmail;
    } else if (stationName) {
      query["assignedStation.name"] = stationName;
    }

    const reports = await Report.find(query).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    console.error("❌ Error fetching reports:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

/* ------------------------------ 🧩 POST /api/reports ------------------------------ */
/**
 * Create a report and auto-assign to nearest station
 */
router.post("/", async (req, res) => {
  try {
    const { name, message, type, level, description, location, userId } = req.body || {};

    if (!location?.latitude || !location?.longitude) {
      return res.status(400).json({ error: "Missing location coordinates" });
    }

    // 🔹 1️⃣ Fetch all station admins with valid coordinates
    const stations = await User.find({
      role: "station_admin",
      "assignedStation.latitude": { $exists: true },
      "assignedStation.longitude": { $exists: true },
    });

    if (!stations.length) {
      return res.status(500).json({ error: "No fire stations found in users collection" });
    }

    // 🔹 2️⃣ Find the nearest station based on coordinates
    let nearestStation = null;
    let minDistance = Infinity;

    for (const user of stations) {
      const st = user.assignedStation;
      const distance = getDistance(
        location.latitude,
        location.longitude,
        st.latitude,
        st.longitude
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestStation = user;
      }
    }

    // 🔹 3️⃣ Get formatted address
    const address = await getAddressFromCoords(location.latitude, location.longitude);

    // 🔹 4️⃣ Construct new report with assigned station
    const newReport = new Report({
      userId,
      name: name?.trim() || "Unnamed",
      message: message || "",
      type: type || "Unknown",
      level: level || "",
      description: description || "",
      location,
      address,
      assignedStation: nearestStation
        ? {
            name: nearestStation.assignedStation.name,
            email: nearestStation.email,
            address: nearestStation.assignedStation.address,
            latitude: nearestStation.assignedStation.latitude,
            longitude: nearestStation.assignedStation.longitude,
          }
        : null,
      status: "Active",
      timestamp: new Date(),
    });

    // 🔹 5️⃣ Save report to database
    await newReport.save();

    // 🔹 6️⃣ Notify the assigned station (if socket.io is active)
    const io = req.app.get("io");
    if (io && nearestStation?._id) {
      io.to(nearestStation._id.toString()).emit("new_report", {
        message: `🚨 New report assigned to ${nearestStation.assignedStation.name}`,
        report: newReport,
      });
    }

    // 🔹 7️⃣ Respond to frontend
    res.status(201).json({
      message: `Report created successfully — assigned to ${nearestStation?.assignedStation.name}`,
      report: newReport,
    });
  } catch (err) {
    console.error("❌ Error creating report:", err);
    res.status(500).json({ error: "Server error while creating report" });
  }
});

/* ------------------------------ 🔄 PATCH /:id/status ------------------------------ */
router.patch("/:id/status", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: "Status is required" });

    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.status = status;
    await report.save();

    res.json({ message: `Report status updated to ${status}`, report });
  } catch (err) {
    console.error("❌ Error updating status:", err);
    res.status(500).json({ message: "Server error updating status" });
  }
});

/* ------------------------------ ✅ PATCH /:id/resolve ------------------------------ */
router.patch("/:id/resolve", async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    report.status = "Resolved";
    await report.save();

    res.json({ message: "Report marked as resolved", report });
  } catch (err) {
    console.error("❌ Error resolving report:", err);
    res.status(500).json({ message: "Server error resolving report" });
  }
});

/* ------------------------------ 📊 GET /summary ------------------------------ */
router.get("/summary", async (req, res) => {
  try {
    const summary = await Report.aggregate([
      {
        $group: {
          _id: "$type",
          total: { $sum: 1 },
          active: { $sum: { $cond: [{ $eq: ["$status", "Active"] }, 1, 0] } },
          resolved: { $sum: { $cond: [{ $eq: ["$status", "Resolved"] }, 1, 0] } },
          lastReport: { $max: "$timestamp" },
        },
      },
      { $sort: { total: -1 } },
    ]);
    res.json(summary);
  } catch (err) {
    console.error("❌ Error generating summary:", err);
    res.status(500).json({ message: "Failed to generate report summary" });
  }
});

/* ------------------------------ 📡 POST /:id/notify-view-location ------------------------------ */
router.post("/:id/notify-view-location", async (req, res) => {
  try {
    const { id } = req.params;
    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ message: "Report not found" });

    const io = req.app.get("io");
    if (io && report.userId) {
      io.to(report.userId.toString()).emit("view_location", {
        reportId: id,
        message: "Admin is viewing your location",
        location: report.location,
      });
    }

    res.json({ message: "User notified successfully" });
  } catch (err) {
    console.error("❌ Error notifying user:", err);
    res.status(500).json({ message: "Server error notifying user" });
  }
});

module.exports = router;
