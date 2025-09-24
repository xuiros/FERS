import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography
} from "@mui/material";

const alerts = [
  { id: 1, type: "Fire", location: "Downtown", status: "Active" },
  { id: 2, type: "Rescue", location: "North District", status: "Resolved" },
  { id: 3, type: "Fire", location: "East Village", status: "Ongoing" },
];

export default function Alerts() {
  return (
    <TableContainer component={Paper}>
      <Typography variant="h5" sx={{ p: 2 }}>
        Active Alerts
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Location</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {alerts.map((alert) => (
            <TableRow key={alert.id}>
              <TableCell>{alert.id}</TableCell>
              <TableCell>{alert.type}</TableCell>
              <TableCell>{alert.location}</TableCell>
              <TableCell>{alert.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
