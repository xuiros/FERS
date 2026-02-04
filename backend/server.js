const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");

dotenv.config();

console.log("🌍 Environment Variables Check:");
console.log(
  "🗺️ Google Maps API Key:",
  process.env.GOOGLE_MAPS_API_KEY
    ? `Loaded ✅ (${process.env.GOOGLE_MAPS_API_KEY.slice(0, 10)}...)`
    : "Missing ❌"
);
console.log(
  "🧠 Vision API Key:",
  process.env.VISION_API_KEY
    ? `Loaded ✅ (${process.env.VISION_API_KEY.slice(0, 10)}...)`
    : "Missing ❌"
);
console.log(
  "🍃 MongoDB URI:",
  process.env.MONGO_URI ? "Loaded ✅" : "Missing ❌"
);

const app = express();
app.use(cors());

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bfp_capstone";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH"],
  },
});

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("join_room", (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`👥 User ${userId} joined their private room`);
    }
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });

  socket.on("new_report_created", (report) => {
    io.emit("new_alert", report);
    console.log("📢 Broadcasted new alert:", report._id || report.name);
  });
});

app.set("io", io);

const reportRoutes = require("./routes/reportRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const visionRoutes = require("./routes/visionRoutes"); 
const visionBack = require("./routes/visionBack");     

app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vision", visionRoutes);      
app.use("/api/vision/back", visionBack);     

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});

app.get("/", (req, res) => {
  res.send("🔥 BFP FERS Backend API is running ✅");
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "0.0.0.0";

server.listen(PORT, HOST, () => {
  console.log(`🚀 Server running at http://${HOST}:${PORT}`);
});

console.log("📡 Socket.IO server initialized and attached to Express");
