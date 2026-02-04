import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Stack,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople";
import TerrainIcon from "@mui/icons-material/Terrain";
import VisibilityIcon from "@mui/icons-material/Visibility";

const EMERGENCY_TYPES = [
  { type: "Fire", color: "error.main", icon: <LocalFireDepartmentIcon sx={{ fontSize: 40, color: "error.main" }} /> },
  { type: "Flood", color: "primary.main", icon: <WaterDropIcon sx={{ fontSize: 40, color: "primary.main" }} /> },
  { type: "Earthquake", color: "warning.main", icon: <EmojiPeopleIcon sx={{ fontSize: 40, color: "warning.main" }} /> },
  { type: "Accident", color: "info.main", icon: <DirectionsCarIcon sx={{ fontSize: 40, color: "info.main" }} /> },
  { type: "Landslide", color: "success.main", icon: <TerrainIcon sx={{ fontSize: 40, color: "success.main" }} /> },
];

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState([]);
  const [selectedType, setSelectedType] = useState(null);
  const [filteredReports, setFilteredReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://10.53.52.120:5000/api/reports");
      const allReports = res.data || [];
      const resolved = allReports.filter((r) => r.status === "Resolved");
      setReports(resolved);
    } catch (error) {
      console.error("❌ Error fetching reports:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (type) => {
    const filtered = reports.filter((r) => r.type === type);
    setSelectedType(type);
    setFilteredReports(filtered);
  };

  const handleCloseDetails = () => {
    setSelectedType(null);
    setFilteredReports([]);
  };

  if (loading)
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Box mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Reports
        </Typography>
        <Typography variant="body2" color="text.secondary">
          These are all <strong>resolved</strong> emergencies categorized by type.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {EMERGENCY_TYPES.map(({ type, icon, color }, index) => {
          const incidents = reports.filter((r) => r.type === type);
          const total = incidents.length;
          const latest =
            total > 0
              ? new Date(
                  Math.max(...incidents.map((r) => new Date(r.timestamp)))
                ).toLocaleString()
              : "No resolved incidents yet";

          return (
            <Grid item xs={12} md={6} lg={4} key={index}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: 4,
                  borderTop: `6px solid`,
                  borderColor: color,
                  transition: "all 0.2s ease",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                <Stack spacing={1.5}>
                  <Box display="flex" alignItems="center" gap={2}>
                    {icon}
                    <Typography variant="h6">{type} Reports</Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    Total resolved: {total}
                  </Typography>

                  <Typography variant="caption" color="text.secondary">
                    Last resolved: {latest}
                  </Typography>

                  <Chip
                    label={total > 0 ? "Resolved" : "No Data"}
                    color={total > 0 ? "success" : "default"}
                    size="small"
                    sx={{ width: "fit-content" }}
                  />

                  <Button
                    variant="outlined"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewDetails(type)}
                    sx={{ borderRadius: 2 }}
                    disabled={total === 0}
                  >
                    View Details
                  </Button>
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Dialog open={!!selectedType} onClose={handleCloseDetails} maxWidth="md" fullWidth>
        <DialogTitle>{selectedType} Reports</DialogTitle>
        <DialogContent dividers>
          {filteredReports.length === 0 ? (
            <Typography>No detailed reports available for this type.</Typography>
          ) : (
            filteredReports.map((r, i) => (
              <Paper
                key={i}
                sx={{ p: 2, mb: 2, borderRadius: 2, backgroundColor: "#fafafa" }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {r.name || "Unnamed"}
                </Typography>
                <Typography variant="body2">Level: {r.level || "N/A"}</Typography>
                <Typography variant="body2">Description: {r.description}</Typography>
                <Typography variant="body2">Address: {r.address}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(r.timestamp).toLocaleString()}
                </Typography>
              </Paper>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetails}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
