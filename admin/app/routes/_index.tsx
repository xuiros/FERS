import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import GroupsIcon from "@mui/icons-material/Groups";
import PeopleIcon from "@mui/icons-material/People";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";

export default function Dashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeAlerts: 0,
    teamsDeployed: 0,
    users: 0,
  });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    if (storedUser) {
      fetchData(storedUser);
    }

    // ✅ Optional: Real-time updates (if WebSocket used)
    const socket = new WebSocket("ws://10.53.52.120:5000");
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "NEW_REPORT") {
        fetchData(storedUser);
      }
    };

    return () => socket.close();
  }, []);

  const fetchData = async (loggedUser) => {
    try {
      const token = localStorage.getItem("token");
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      // Get all reports + user count
      const [reportsRes, usersRes] = await Promise.all([
        axios.get("http://10.53.52.120:5000/api/reports", config),
        axios.get("http://10.53.52.120:5000/api/users/count", config),
      ]);

      let reportsData = reportsRes.data || [];
      const userCount = usersRes.data.count || 0;

      if (loggedUser?.role === "station_admin" && loggedUser.assignedStation) {
        reportsData = reportsData.filter(
          (r) =>
            r.assignedStation?.name === loggedUser.assignedStation.name ||
            r.assignedStation?.address === loggedUser.assignedStation.address
        );
      }

      const activeAlerts = reportsData.filter((r) => r.status === "Active").length;

      setReports(reportsData);
      setStats({
        activeAlerts,
        teamsDeployed: 3,
        users: userCount,
      });
    } catch (err) {
      console.error("❌ Error fetching dashboard data:", err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  const COLORS = ["#4caf50", "#2196f3"];
  const reportData = [
    { name: "Resolved", value: reports.filter((r) => r.status === "Resolved").length },
    { name: "Active", value: reports.filter((r) => r.status === "Active").length },
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const alertsOverTime = dayNames.map((day) => {
    const count = reports.filter((r) => {
      const reportDay = new Date(r.timestamp).getDay();
      return r.status === "Active" && dayNames[reportDay] === day;
    }).length;
    return { day, alerts: count };
  });

  const teamData = [
    { week: "Week 1", deployed: 2 },
    { week: "Week 2", deployed: 4 },
    { week: "Week 3", deployed: 3 },
    { week: "Week 4", deployed: 5 },
  ];

  const statsArray = [
    {
      label: "Active Alerts",
      value: stats.activeAlerts,
      icon: <NotificationsActiveIcon fontSize="large" color="primary" />,
    },
    {
      label: "Teams Deployed",
      value: stats.teamsDeployed,
      icon: <GroupsIcon fontSize="large" color="secondary" />,
    },
    {
      label: "Users",
      value: stats.users,
      icon: <PeopleIcon fontSize="large" sx={{ color: "success.main" }} />,
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 2, width: "100%" }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {user?.assignedStation?.name
          ? `${user.assignedStation.name} Dashboard`
          : "Dashboard"}
      </Typography>

      {/* Top Stats */}
      <Grid container spacing={2}>
        {statsArray.map((stat, i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Paper
              sx={{
                p: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderRadius: 3,
                boxShadow: 4,
                height: "100%",
              }}
            >
              <Box>
                <Typography variant="h6" color="textSecondary">
                  {stat.label}
                </Typography>
                <Typography variant="h3" fontWeight="bold" color="text.primary">
                  {stat.value}
                </Typography>
              </Box>
              {stat.icon}
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Charts Section */}
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          {/* Pie Chart */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 4, height: 400 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Reports Analytics
              </Typography>
              <ResponsiveContainer width="100%" height="85%">
                <PieChart>
                  <Pie
                    data={reportData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    label
                    stroke="none"
                  >
                    {reportData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Bar Chart */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 4, height: 400 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Teams Deployed (Weekly)
              </Typography>
              <ResponsiveContainer width="100%" height="85%">
                <BarChart data={teamData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="deployed" fill="#2196f3" name="Teams Deployed" />
                </BarChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Line Chart */}
          <Grid item xs={12}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 4,
                height: 400,
                minHeight: 400,
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Active Alerts Over Time
              </Typography>
              <ResponsiveContainer width="100%" height="85%">
                <LineChart
                  data={alertsOverTime}
                  margin={{ top: 10, right: 20, left: -20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" interval={0} tick={{ fontSize: 14 }} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="alerts"
                    stroke="#F98125"
                    name="Active Alerts"
                    strokeWidth={3}
                    dot={{ r: 6 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
