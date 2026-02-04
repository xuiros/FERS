import axios from "axios";

const API_URL = "http://10.0.2.2:5000/api/reports";

export const createAlert = async ({ type, level, description, location }) => {
  try {
    const res = await axios.post(API_URL, {
      type,
      level,
      description,
      location,
    });
    console.log("✅ Report created:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Error creating report:", err.response?.data || err.message);
  }
};

// Get all reports
export const getAlerts = async () => {
  try {
    const res = await axios.get(API_URL);
    console.log("📩 Reports:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ Error fetching reports:", err);
  }
};
