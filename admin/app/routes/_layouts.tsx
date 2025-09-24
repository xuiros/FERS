import { Outlet, Link, useLocation } from "react-router-dom";
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
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PeopleIcon from "@mui/icons-material/People";
import GroupIcon from "@mui/icons-material/Group";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import logo from "../assets/icons/logo.png";
import { useTheme } from "@mui/material/styles";

export default function Layout() {
  const theme = useTheme();
  const location = useLocation();

  const mainMenu = [
    { text: "Dashboard", path: "/", icon: <DashboardIcon /> },
    { text: "Alerts", path: "/alerts", icon: <NotificationsIcon /> },
    { text: "Teams", path: "/teams", icon: <PeopleIcon /> },
    { text: "Users", path: "/users", icon: <GroupIcon /> },
  ];

  const managementMenu = [
    { text: "Reports", path: "/reports", icon: <AssessmentIcon /> },
    { text: "Settings", path: "/settings", icon: <SettingsIcon /> },
  ];

  const renderMenu = (items: typeof mainMenu) =>
    items.map((item) => (
      <ListItem key={item.text} disablePadding>
        <ListItemButton
          component={Link}
          to={item.path}
          sx={{
            color: "#fff",
            backgroundColor:
              location.pathname === item.path
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
    ));

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
            justifyContent: "flex-start",
            gap: 1,
            px: 2,
            py: 1,
          }}
        >
          <img src={logo} alt="FERS Logo" width="32" height="32" />
          <Typography variant="h6" fontWeight="bold">
            FERS
          </Typography>
        </Toolbar>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />

        {/* Main Section */}
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

        {/* Management Section */}
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

      {/* Main Content */}
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
