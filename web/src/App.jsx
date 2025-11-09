import { AppBar, Toolbar, Typography } from "@mui/material";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Smart Financial Coach</Typography>
        </Toolbar>
      </AppBar>
      <Dashboard />
    </>
  );
}
