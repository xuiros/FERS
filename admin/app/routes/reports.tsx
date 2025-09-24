import { Paper, Typography, List, ListItem, ListItemText, Divider } from "@mui/material";

const reports = [
  { id: 1, title: "Monthly Fire Incidents", date: "2025-09-01" },
  { id: 2, title: "Rescue Operations Summary", date: "2025-08-15" },
  { id: 3, title: "Team Activity Report", date: "2025-08-01" },
];

export default function Reports() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Reports
      </Typography>
      <List>
        {reports.map((report) => (
          <div key={report.id}>
            <ListItem button>
              <ListItemText
                primary={report.title}
                secondary={`Generated on ${report.date}`}
              />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </Paper>
  );
}
