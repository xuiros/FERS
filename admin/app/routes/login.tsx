import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 🔹 1. Send login request to backend
      const res = await axios.post("http://10.53.52.120:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      if (!user) throw new Error("User data missing in response");

      // 🔹 2. Save token and user data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // 🔹 3. Detect if the user has assignedStation (from MongoDB)
      if (user.assignedStation && user.assignedStation.latitude && user.assignedStation.longitude) {
        const defaultLocation = {
          lat: user.assignedStation.latitude,
          lng: user.assignedStation.longitude,
        };
        localStorage.setItem("defaultLocation", JSON.stringify(defaultLocation));

        console.log("✅ Default station location saved:", defaultLocation);
      } else if (user.defaultLocation) {
        // Fallback for systems using defaultLocation instead
        localStorage.setItem("defaultLocation", JSON.stringify(user.defaultLocation));
        console.log("✅ Default location saved:", user.defaultLocation);
      } else {
        console.warn("⚠️ No station location found for this user");
      }

      // 🔹 4. Redirect based on role
      if (user.role === "station_admin") {
        navigate("/app");
      } else if (user.role === "super_admin") {
        navigate("/admin");
      } else {
        navigate("/alerts");
      }
    } catch (err: any) {
      console.error("❌ Login error:", err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bgcolor="#f4f6f8"
    >
      <Paper elevation={3} sx={{ p: 4, width: 400 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          🔥 BFP Admin Login
        </Typography>

        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
