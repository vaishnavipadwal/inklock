import { Routes, Route, Navigate } from "react-router-dom";
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#7c6cff', light: '#988bff' },
    secondary: { main: '#2dd4bf' },
    background: { default: '#050505', paper: '#121212' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 8 } } },
  },
});

function Protected({ children }) {
  return localStorage.getItem('inklock_token') ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Protected><Dashboard /></Protected>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeProvider>
  );
}
