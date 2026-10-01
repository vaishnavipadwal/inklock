import { Box, createTheme, ThemeProvider } from '@mui/material';
import Navbar from '../components/Landing/Navbar';
import HeroSection from '../components/Landing/HeroSection';
import WhySection from '../components/Landing/WhySection';
import FeaturesSection from '../components/Landing/FeaturesSection';
import SecuritySection from '../components/Landing/SecuritySection';
import FaqSection from '../components/Landing/FaqSection';
import Footer from '../components/Landing/Footer';
import Preloader from '../components/Landing/Preloader';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#7c6cff', light: '#988bff' },
    secondary: { main: '#2dd4bf' },
    background: { default: '#faf9ff', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: { styleOverrides: { root: { borderRadius: 8 } } },
  },
});

export default function Landing() {
  return (
    <ThemeProvider theme={lightTheme}>
      <Preloader />
      <Box id="top" sx={{ bgcolor: '#faf9ff', minHeight: '100vh', color: 'text.primary' }}>
        <Navbar />
        <HeroSection />
        <WhySection />
        <FeaturesSection />
        <SecuritySection />
        <FaqSection />
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
