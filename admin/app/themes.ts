import { createTheme } from "@mui/material/styles";

// 🎨 Custom FERS theme colors
const theme = createTheme({
  palette: {
    primary: {
      main: "#F98125", // orange
    },
    secondary: {
      main: "#11224D", // dark blue
    },
    background: {
      default: "#FEEDDE", // light background
      paper: "#ffffff",
    },
    text: {
      primary: "#11224D",
      secondary: "#F98125",
    },
  },
  typography: {
    fontFamily: "Inter, Arial, sans-serif",
  },
});

export default theme;
