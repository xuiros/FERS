import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  ListItemIcon,
  Divider,
  Button,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PeopleIcon from "@mui/icons-material/People";
import GroupIcon from "@mui/icons-material/Group";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import logo from "../assets/icons/logo.png";
import { useTheme } from "@mui/material/styles";
import { useEffect } from "react";

export default function Layout() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  // 🧠 Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!token || !user) {
      navigate("/"); // back to login
    }
  }, [navigate]);

  // ✅ Updated routes with /app prefix
  const mainMenu = [
    { text: "Dashboard", path: "/app", icon: <DashboardIcon /> },
    { text: "Alerts", path: "/app/alerts", icon: <NotificationsIcon /> },
    { text: "Teams", path: "/app/teams", icon: <PeopleIcon /> },
    { text: "Users", path: "/app/users", icon: <GroupIcon /> },
  ];

  const managementMenu = [
    { text: "Reports", path: "/app/reports", icon: <AssessmentIcon /> },
    { text: "Settings", path: "/app/settings", icon: <SettingsIcon /> },
  ];

  // 🚪 Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const renderMenu = (items: typeof mainMenu) =>
    items.map((item) => {
      const isActive =
        location.pathname === item.path ||
        (item.path !== "/app" && location.pathname.startsWith(item.path));

      return (
        <ListItem key={item.text} disablePadding>
          <ListItemButton
            component={Link}
            to={item.path}
            sx={{
              color: "#fff",
              backgroundColor: isActive
                ? theme.palette.primary.main
                : "transparent",
              "&:hover": {
                backgroundColor: theme.palette.primary.main,
                opacity: 0.9,
              },
            }}
          >
            <ListItemIcon sx={{ color: "inherit" }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      );
    });

  return (
    <Box sx={{ display: "flex" }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 220,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 220,
            boxSizing: "border-box",
            backgroundColor: theme.palette.secondary.main,
            color: "#fff",
          },
        }}
      >
        {/* Logo + Title */}
        <Toolbar
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            px: 2,
            py: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <img src={logo} alt="FERS Logo" width="32" height="32" />
            <Typography variant="h6" fontWeight="bold">
              FERS
            </Typography>
          </Box>

          {/* Logout */}
          <Button
            onClick={handleLogout}
            size="small"
            sx={{
              color: "#fff",
              textTransform: "none",
              fontSize: "0.75rem",
              border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: "6px",
              ml: 1,
              "&:hover": { backgroundColor: "rgba(255,255,255,0.15)" },
            }}
          >
            Logout
          </Button>
        </Toolbar>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />

        <List>
          <Typography
            variant="caption"
            sx={{ px: 2, py: 1, color: "rgba(255,255,255,0.7)" }}
          >
            MAIN
          </Typography>
          {renderMenu(mainMenu)}
        </List>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", my: 1 }} />

        <List>
          <Typography
            variant="caption"
            sx={{ px: 2, py: 1, color: "rgba(255,255,255,0.7)" }}
          >
            MANAGEMENT
          </Typography>
          {renderMenu(managementMenu)}
        </List>
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: theme.palette.background.default,
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
