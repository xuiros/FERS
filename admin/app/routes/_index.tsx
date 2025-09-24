import { Box, Grid, Paper, Typography } from "@mui/material";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import GroupsIcon from "@mui/icons-material/Groups";
import PeopleIcon from "@mui/icons-material/People";
import AssessmentIcon from "@mui/icons-material/Assessment";
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
  const stats = [
    { label: "Active Alerts", value: 5, icon: <NotificationsActiveIcon fontSize="large" color="primary" /> },
    { label: "Teams Deployed", value: 3, icon: <GroupsIcon fontSize="large" color="secondary" /> },
    { label: "Users", value: 24, icon: <PeopleIcon fontSize="large" sx={{ color: "success.main" }} /> },
    { label: "Pending Reports", value: 4, icon: <AssessmentIcon fontSize="large" sx={{ color: "warning.main" }} /> },
  ];

  // Example report analytics data
  const reportData = [
    { name: "Resolved", value: 12 },
    { name: "Pending", value: 4 },
    { name: "In Review", value: 2 },
  ];

  // Example teams deployed trend (weekly)
  const teamData = [
    { week: "Week 1", deployed: 2 },
    { week: "Week 2", deployed: 4 },
    { week: "Week 3", deployed: 3 },
    { week: "Week 4", deployed: 5 },
  ];

  // Example active alerts over time (line chart)
  const alertsOverTime = [
    { day: "Mon", alerts: 2 },
    { day: "Tue", alerts: 3 },
    { day: "Wed", alerts: 1 },
    { day: "Thu", alerts: 4 },
    { day: "Fri", alerts: 2 },
    { day: "Sat", alerts: 5 },
    { day: "Sun", alerts: 3 },
  ];

  const COLORS = ["#4caf50", "#ff9800", "#2196f3"];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* === Header === */}
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dashboard
      </Typography>

      {/* === Stat Cards === */}
      <Grid container spacing={3}>
        {stats.map((stat, i) => (
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

      {/* === Analytics Section === */}
      <Box sx={{ mt: 5 }}>
        <Grid container spacing={3}>
          {/* Pie Chart - Reports Analytics */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 4,
                height: 400,
                minWidth: 300,
                maxWidth: '100%',
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Reports Analytics
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
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
              </Box>
            </Paper>
          </Grid>

          {/* Bar Chart - Teams Deployed */}
          <Grid item xs={12} md={4}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 4,
                height: 400,
                minWidth: 300,
                maxWidth: '100%',
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Teams Deployed (Weekly)
              </Typography>
              <Box sx={{ flexGrow: 1 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={teamData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="deployed" fill="#2196f3" name="Teams Deployed" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Line Chart - Active Alerts Over Time */}
          <Grid item xs={12} md={4} lg={4} xl={4} sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            minWidth: 0,
          }}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                boxShadow: 4,
                height: 400,
                width: '100%',
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                minWidth: 0,
              }}
            >
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Active Alerts Over Time
              </Typography>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={alertsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="alerts" stroke="#F98125" name="Active Alerts" strokeWidth={3} dot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
