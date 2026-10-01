import { Box, Typography, createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import logo from '../../assets/logo.png';

export const BRAND = 'linear-gradient(90deg, #a238ff 0%, #2f8bff 55%, #00e5ff 100%)';
export const HEAD = '"Poppins", "Inter", sans-serif';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#7c6cff', light: '#988bff' },
    background: { default: '#ffffff', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: { textTransform: 'none', fontWeight: 600 },
  },
});

const points = [
  { icon: <MenuBookIcon />, t: 'Unlimited notebooks', d: 'Pages of text, checklists and code.' },
  { icon: <LockOutlinedIcon />, t: 'Locked books and pages', d: 'A separate password for private notes.' },
  { icon: <VpnKeyIcon />, t: 'AES-256 password vault', d: 'Logins encrypted with your master password.' },
  { icon: <ShieldOutlinedIcon />, t: '3 independent privacy layers', d: 'One password never opens everything.' },
];

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '5fr 6fr' }, bgcolor: '#fff' }}>
        {/* ---------- left: brand panel ---------- */}
        <Box sx={{ position: 'relative', display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'center', p: 7, color: '#fff', overflow: 'hidden', background: 'linear-gradient(145deg, #7a2cff 0%, #2f6bff 55%, #00b8e6 100%)' }}>
          <motion.div animate={{ y: [0, -24, 0], x: [0, 14, 0] }} transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', top: '-8%', right: '-12%', width: 380, height: 380, borderRadius: '50%', background: 'rgba(255,255,255,0.12)', filter: 'blur(40px)' }} />
          <motion.div animate={{ y: [0, 26, 0], x: [0, -16, 0] }} transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
            style={{ position: 'absolute', bottom: '-12%', left: '-10%', width: 420, height: 420, borderRadius: '50%', background: 'rgba(0,229,255,0.25)', filter: 'blur(50px)' }} />

          <Box sx={{ position: 'relative', maxWidth: 460 }}>
            <Typography sx={{ fontFamily: HEAD, fontWeight: 800, fontSize: '2.7rem', lineHeight: 1.12, letterSpacing: '-0.02em', mb: 2 }}>
              Write freely.<br />Lock securely.
            </Typography>
            <Typography sx={{ color: 'rgba(255,255,255,0.88)', fontSize: '1.08rem', lineHeight: 1.65, mb: 5 }}>
              Your notebooks and your passwords, in one private place that only you can open.
            </Typography>

            {points.map((p, i) => (
              <motion.div key={p.t} initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.4 }}>
                  <Box sx={{ width: 44, height: 44, borderRadius: 2.5, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(255,255,255,0.18)', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(8px)' }}>
                    {p.icon}
                  </Box>
                  <Box>
                    <Typography sx={{ fontWeight: 700 }}>{p.t}</Typography>
                    <Typography sx={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)' }}>{p.d}</Typography>
                  </Box>
                </Box>
              </motion.div>
            ))}
          </Box>
        </Box>

        {/* ---------- right: form ---------- */}
        <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', px: { xs: 3, sm: 6 }, py: 6, bgcolor: '#fff', overflow: 'hidden' }}>
          <Box sx={{ position: 'absolute', top: '-10%', right: '-10%', width: 320, height: 320, borderRadius: '50%', bgcolor: 'rgba(0,229,255,0.10)', filter: 'blur(90px)', pointerEvents: 'none' }} />
          <Box sx={{ position: 'absolute', bottom: '-10%', left: '-10%', width: 320, height: 320, borderRadius: '50%', bgcolor: 'rgba(162,56,255,0.10)', filter: 'blur(90px)', pointerEvents: 'none' }} />

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
            style={{ position: 'relative', width: '100%', maxWidth: 440 }}>
            {/* logo, cropped to the artwork */}
            <Box component={Link} to="/" sx={{ display: 'block', position: 'relative', width: 150, height: 150, mx: 'auto', mb: 1, overflow: 'hidden' }}>
              <Box component="img" src={logo} alt="InkLock" sx={{ position: 'absolute', width: 255, height: 255, left: -52, top: -42, maxWidth: 'none' }} />
            </Box>

            <Typography align="center" component="h1" sx={{ fontFamily: HEAD, fontWeight: 800, fontSize: { xs: '1.8rem', sm: '2.1rem' }, letterSpacing: '-0.02em', color: '#1b1b2f', mb: 0.8 }}>
              {title}
            </Typography>
            <Typography align="center" color="text.secondary" sx={{ mb: 4 }}>{subtitle}</Typography>

            {children}

            <Box sx={{ mt: 4, textAlign: 'center' }}>{footer}</Box>
          </motion.div>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

/* shared input look */
export const fieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    bgcolor: '#faf9ff',
    '& fieldset': { borderColor: '#e0dcff' },
    '&:hover fieldset': { borderColor: '#b9aaff' },
    '&.Mui-focused fieldset': { borderColor: '#7c6cff', borderWidth: 2 },
  },
};

export const submitSx = {
  py: 1.5, mt: 1, fontSize: '1.05rem', borderRadius: 8, background: BRAND,
  boxShadow: '0 10px 28px rgba(95,90,255,0.4)', transition: 'transform .2s, box-shadow .2s',
  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 14px 34px rgba(95,90,255,0.5)' },
  '&.Mui-disabled': { color: '#fff', opacity: 0.7 },
};
