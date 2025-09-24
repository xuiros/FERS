import Grid from "@mui/material/Grid";
import { Card, CardContent, Typography } from "@mui/material";

const teams = [
  { id: 1, name: "Alpha Team", members: 6 },
  { id: 2, name: "Bravo Team", members: 4 },
  { id: 3, name: "Rescue Squad", members: 8 },
];

export default function Teams() {
  return (
    <Grid container spacing={2}>
      {teams.map((team) => (
        <Grid item xs={12} sm={6} md={4} key={team.id}>
          <Card>
            <CardContent>
              <Typography variant="h6">{team.name}</Typography>
              <Typography variant="body2">
                Members: {team.members}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
