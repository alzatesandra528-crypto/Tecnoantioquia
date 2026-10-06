import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#305BFF" },
    secondary: { main: "#753EF2" },
    background: { default: "#F5F6FA", paper: "#FFFFFF" },
    text: { primary: "#14182C", secondary: "#687089" }
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    button: { textTransform: "none", fontWeight: 700 }
  },
  shape: { borderRadius: 14 }
});

export default theme;
