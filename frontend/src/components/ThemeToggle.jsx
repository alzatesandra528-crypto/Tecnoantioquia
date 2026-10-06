import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlined from "@mui/icons-material/LightModeOutlined";
import { IconButton, Tooltip } from "@mui/material";
import { useSite } from "../site.jsx";

export default function ThemeToggle() {
  const { mode, toggleMode } = useSite();
  const isDark = mode === "dark";
  return (
    <Tooltip title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}>
        <IconButton
        onClick={toggleMode}
        aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
        aria-pressed={isDark}
        sx={{ color: "currentColor" }}
      >
        {isDark ? <LightModeOutlined /> : <DarkModeOutlined />}
      </IconButton>
    </Tooltip>
  );
}
