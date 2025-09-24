import {
  Paper, Typography, Switch, FormControlLabel,
  TextField, Button, Stack
} from "@mui/material";

export default function Settings() {
  return (
    <Paper sx={{ p: 3, maxWidth: 500 }}>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>

      <Stack spacing={2}>
        <FormControlLabel
          control={<Switch defaultChecked />}
          label="Enable Notifications"
        />
        <FormControlLabel
          control={<Switch />}
          label="Dark Mode"
        />
        <TextField label="System Name" defaultValue="FERS Admin" fullWidth />
        <Button variant="contained" color="primary">
          Save Changes
        </Button>
      </Stack>
    </Paper>
  );
}
