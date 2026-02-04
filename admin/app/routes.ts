import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  // 👇 Make login the root route ("/")
  route("/", "./routes/login.tsx"),

  route("/app", "./routes/_layouts.tsx", [
    route("", "./routes/_index.tsx"), // Dashboard
    route("alerts", "./routes/alerts.tsx"),
    route("teams", "./routes/teams.tsx"),
    route("users", "./routes/users.tsx"),
    route("reports", "./routes/reports.tsx"),
    route("settings", "./routes/settings.tsx"),
  ]),
] satisfies RouteConfig;
