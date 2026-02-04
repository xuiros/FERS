import { useEffect, useState, useCallback } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, Typography, CircularProgress, Chip, Box, TextField, MenuItem,
  Stack, Dialog, DialogActions, DialogContent, DialogContentText,
  DialogTitle, Button, Snackbar, Alert as MuiAlert,
} from "@mui/material";
import type { ChipProps } from "@mui/material";
import {
  GoogleMap, Marker, DirectionsRenderer, useJsApiLoader,
} from "@react-google-maps/api";

interface Alert {
  _id: string;
  name?: string;
  type?: string;
  level?: string;
  description?: string;
  location?: { latitude: number; longitude: number };
  status?: string;
  timestamp?: string;
  address?: string;
  assignedStation?: { name?: string; email?: string };
}

const typeColors: Record<string, ChipProps["color"]> = {
  Fire: "error",
  Flood: "info",
  Earthquake: "warning",
  Accident: "secondary",
  Landslide: "success",
};

const statusColors: Record<string, ChipProps["color"]> = {
  Active: "error",
  Resolved: "success",
};

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [mapOpen, setMapOpen] = useState(false);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: ["places"],
  });

  const cleanName = (text: string): string => {
    if (!text) return "";
    return text
      .replace(/\(.*?\)/g, "")
      .replace(/received|from backend|alert|report/gi, "")
      .replace(/\s{2,}/g, " ")
      .trim();
  };

  // 🟢 Updated to filter by assignedStation.name (not userId)
  const fetchAlerts = async () => {
    try {
      const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");
      const stationName = loggedInUser?.assignedStation?.name;

      const url = stationName
        ? `http://10.53.52.120:5000/api/reports?stationName=${encodeURIComponent(stationName)}`
        : "http://10.53.52.120:5000/api/reports";

      const res = await fetch(url);
      if (!res.ok) throw new Error(`Server responded with ${res.status}`);
      const data = await res.json();

      const formatted = data.map((alert: any) => {
        const name = cleanName(alert.name || alert.message || "Unnamed Alert");
        const status = alert.status || "Active";
        return { ...alert, name, status };
      });

      setAlerts(formatted);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      setAlerts((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
      await fetch(`http://10.53.52.120:5000/api/reports/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      await fetch(`http://10.53.52.120:5000/api/reports/${id}/notify`, {
        method: "POST",
      });
    } catch (error) {
      console.error(`Error updating status to ${status}:`, error);
    }
  };

  const handleResolveClick = (alert: Alert) => {
    setSelectedAlert(alert);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (selectedAlert) {
      updateStatus(selectedAlert._id, "Resolved");
      setSnackbarMsg(`✅ ${selectedAlert.name} has been marked as Resolved.`);
      setSnackbarOpen(true);
    }
    setConfirmOpen(false);
    setSelectedAlert(null);
  };

  const handleCancel = () => {
    setConfirmOpen(false);
    setSelectedAlert(null);
  };

  const handleViewLocation = useCallback(
    async (alert: Alert) => {
      if (!isLoaded || !alert.location) return;
      setSelectedAlert(alert);
      setMapOpen(true);

      const savedLocation = localStorage.getItem("defaultLocation");
      let stationLocation = { lat: 13.141169, lng: 123.760081 };

      if (savedLocation) {
        try {
          const parsed = JSON.parse(savedLocation);
          if (parsed.lat && parsed.lng) stationLocation = parsed;
        } catch (e) {
          console.warn("⚠️ Error parsing defaultLocation:", e);
        }
      }

      setUserLocation(stationLocation);

      const alertLoc = {
        lat: alert.location.latitude,
        lng: alert.location.longitude,
      };

      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: stationLocation,
          destination: alertLoc,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        async (result, status) => {
          if (status === "OK" && result) {
            setDirections(result);
            setSnackbarMsg(`🚒 Responding to ${alert.name}...`);
            setSnackbarOpen(true);
            await fetch(
              `http://10.53.52.120:5000/api/reports/${alert._id}/notify-view-location`,
              { method: "POST" }
            );
          } else {
            console.error("Directions request failed:", status);
          }
        }
      );
    },
    [isLoaded]
  );

  const handleSnackbarClose = () => setSnackbarOpen(false);

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 10000);
    return () => clearInterval(interval);
  }, []);

  const validAlerts = alerts.filter((a) => a.name && a.name.trim() !== "");
  const filteredAlerts = validAlerts.filter((a) => {
    const matchType = filterType === "All" || a.type === filterType;
    const matchStatus = filterStatus === "All" || a.status === filterStatus;
    return matchType && matchStatus;
  });

  if (loading) {
    return (
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Box textAlign="center" p={3}>
          <CircularProgress />
          <Typography variant="body2" color="textSecondary">
            Loading alerts...
          </Typography>
        </Box>
      </TableContainer>
    );
  }

  return (
    <>
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3, p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          🚨 Active Alerts
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} mb={2}>
          <TextField
            select
            size="small"
            label="Type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            sx={{ width: 150 }}
          >
            <MenuItem value="All">All</MenuItem>
            {Object.keys(typeColors).map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            label="Status"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={{ width: 150 }}
          >
            <MenuItem value="All">All</MenuItem>
            {Object.keys(statusColors).map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </TextField>
        </Stack>

        {filteredAlerts.length === 0 ? (
          <Typography textAlign="center" p={3} color="text.secondary">
            No alerts found for your station.
          </Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredAlerts.map((alert) => (
                <TableRow key={alert._id} hover>
                  <TableCell sx={{ fontWeight: 500 }}>{alert.name}</TableCell>
                  <TableCell>
                    {alert.type && (
                      <Chip
                        label={alert.type}
                        color={typeColors[alert.type] || "default"}
                        size="small"
                      />
                    )}
                  </TableCell>
                  <TableCell>{alert.level || ""}</TableCell>
                  <TableCell>{alert.description || ""}</TableCell>
                  <TableCell>{alert.address || "No address available"}</TableCell>
                  <TableCell>
                    <Chip
                      label={alert.status}
                      color={statusColors[alert.status] || "default"}
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </TableCell>
                  <TableCell>
                    {alert.timestamp
                      ? new Date(alert.timestamp).toLocaleString("en-PH", {
                          hour12: true,
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      {alert.status !== "Resolved" && (
                        <Chip
                          label="Resolve"
                          color="success"
                          onClick={() => handleResolveClick(alert)}
                          clickable
                        />
                      )}
                      <Chip
                        label="View Location"
                        color="primary"
                        onClick={() => handleViewLocation(alert)}
                        clickable
                      />
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      {/* Confirm Resolve Dialog */}
      <Dialog open={confirmOpen} onClose={handleCancel}>
        <DialogTitle>Confirm Resolution</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to mark <strong>{selectedAlert?.name}</strong> as{" "}
            <strong>Resolved</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleConfirm} color="success" variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Map Dialog */}
      <Dialog open={mapOpen} onClose={() => setMapOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>🚨 Route to {selectedAlert?.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ height: "400px", width: "100%" }}>
            {!isLoaded ? (
              <Typography textAlign="center" mt={4}>
                Loading map...
              </Typography>
            ) : (
              userLocation &&
              selectedAlert?.location && (
                <GoogleMap
                  mapContainerStyle={{ width: "100%", height: "100%" }}
                  center={userLocation}
                  zoom={13}
                >
                  <Marker position={userLocation} label="Station" />
                  <Marker
                    position={{
                      lat: selectedAlert.location.latitude,
                      lng: selectedAlert.location.longitude,
                    }}
                    label="Alert"
                  />
                  {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
              )
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMapOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity="info"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </MuiAlert>
      </Snackbar>
    </>
  );
}
