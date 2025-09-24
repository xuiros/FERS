import axios from "axios";

const API_URL = "http://localhost:5000/api/alerts"; // temporary

// Create an alert
export const createAlert = async (message) => {
  try {
    const res = await axios.post(API_URL, { message });
    console.log("✅ Alert created:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Error creating alert:", err);
  }
};

// Get all alerts
export const getAlerts = async () => {
  try {
    const res = await axios.get(API_URL);
    console.log("📩 Alerts:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching alerts:", err);
  }
};
