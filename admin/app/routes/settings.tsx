import { useState, useMemo } from "react";
import {
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
  Stack,
  CssBaseline,
  Box,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import ComputerIcon from "@mui/icons-material/Computer";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [systemName, setSystemName] = useState("FERS Admin");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
          primary: {
            main: darkMode ? "#90caf9" : "#ff8c00", 
          },
          background: {
            default: darkMode ? "#121212" : "#f4f6f8",
            paper: darkMode ? "#1e1e1e" : "#fff",
          },
        },
      }),
    [darkMode]
  );

  const handleSave = () => {
    setSnackbarOpen(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundColor: theme.palette.background.default,
          p: 4,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            maxWidth: 600,
            width: "100%",
            borderRadius: 3,
          }}
        >
          {/* Header */}
          <Stack direction="row" alignItems="center" spacing={2} mb={3}>
            <SettingsIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h5" fontWeight={600}>
              System Settings
            </Typography>
          </Stack>

          <Stack spacing={1} mb={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Brightness4Icon color="primary" />
              <Typography variant="subtitle1" fontWeight={600}>
                Appearance
              </Typography>
            </Stack>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                />
              }
              label="Dark Mode"
            />
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={1} mb={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <NotificationsActiveIcon color="primary" />
              <Typography variant="subtitle1" fontWeight={600}>
                Notifications
              </Typography>
            </Stack>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                />
              }
              label="Enable Notifications"
            />
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={1} mb={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <ComputerIcon color="primary" />
              <Typography variant="subtitle1" fontWeight={600}>
                System Preferences
              </Typography>
            </Stack>
            <TextField
              label="System Name"
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              fullWidth
            />
          </Stack>

          {/* Preview Area */}
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              mt: 2,
              textAlign: "center",
              bgcolor: darkMode ? "#1e1e1e" : "#fafafa",
              color: darkMode ? "#fff" : "#333",
              borderRadius: 2,
            }}
          >
            <Typography variant="body2">
              Preview: {darkMode ? "Dark Mode Active" : "Light Mode Active"}
            </Typography>
          </Paper>

          {/* Save Button */}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3, py: 1 }}
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </Paper>

        {/* Snackbar for confirmation */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={2500}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            Settings saved successfully!
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}
