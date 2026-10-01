import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import logo from '../../assets/logo.png';

const BRAND = 'linear-gradient(90deg, #a238ff 0%, #2f8bff 55%, #00e5ff 100%)';
const HEAD = '"Poppins", "Inter", sans-serif';

const product = [
  { label: 'Why InkLock', href: '#why' },
  { label: 'Features', href: '#features' },
  { label: 'Security', href: '#security' },
  { label: 'FAQ', href: '#faq' },
];

const account = [
  { label: 'Login', to: '/login' },
  { label: 'Create account', to: '/register' },
];

const promises = [
  { icon: <LockOutlinedIcon sx={{ fontSize: 18 }} />, t: 'Hashed login passwords' },
  { icon: <VpnKeyIcon sx={{ fontSize: 18 }} />, t: 'AES-256 encrypted vault' },
  { icon: <ShieldOutlinedIcon sx={{ fontSize: 18 }} />, t: '3 independent privacy layers' },
];

const linkSx = {
  display: 'block', mb: 1.3, color: '#5b5b75', fontSize: '0.95rem', fontWeight: 500,
  textDecoration: 'none', width: 'fit-content', position: 'relative', transition: 'color .25s, transform .25s',
  '&:hover': { color: '#7c6cff', transform: 'translateX(4px)' },
};

const ColTitle = ({ children }) => (
  <Typography sx={{ fontFamily: HEAD, fontWeight: 700, fontSize: '0.8rem', letterSpacing: 1.5, textTransform: 'uppercase', color: '#1b1b2f', mb: 2.5 }}>
    {children}
  </Typography>
);

export default function Footer() {
  return (
    <Box component="footer" sx={{ position: 'relative', bgcolor: '#faf9ff', borderTop: '1px solid #ece8ff', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', bottom: '-30%', left: '-8%', width: 420, height: 420, borderRadius: '50%', bgcolor: 'rgba(162,56,255,0.08)', filter: 'blur(110px)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', top: '-20%', right: '-8%', width: 420, height: 420, borderRadius: '50%', bgcolor: 'rgba(0,229,255,0.10)', filter: 'blur(110px)', pointerEvents: 'none' }} />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        {/* ---------- closing CTA ---------- */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <Box sx={{ mt: { xs: 8, md: 10 }, mb: { xs: 7, md: 9 }, p: { xs: 4, md: 6 }, borderRadius: 5, background: BRAND, boxShadow: '0 30px 70px rgba(95,90,255,0.3)', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 3, textAlign: { xs: 'center', md: 'left' } }}>
            <Box>
              <Typography sx={{ fontFamily: HEAD, fontWeight: 800, fontSize: { xs: '1.6rem', md: '2.1rem' }, lineHeight: 1.2, color: '#fff', mb: 1 }}>
                Write freely. Lock securely.
              </Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.88)', maxWidth: 520, lineHeight: 1.6 }}>
                Start your first notebook in under a minute, and keep your logins safe in the same place.
              </Typography>
            </Box>
            <Button component={Link} to="/register" size="large"
              sx={{ py: 1.5, px: 4.5, flexShrink: 0, borderRadius: 8, bgcolor: '#fff', color: '#5b4bd6', fontWeight: 700, fontSize: '1.02rem', boxShadow: '0 10px 28px rgba(0,0,0,0.18)', transition: 'all .2s', '&:hover': { bgcolor: '#fff', transform: 'translateY(-2px)', boxShadow: '0 14px 34px rgba(0,0,0,0.25)' } }}>
              Get started free
            </Button>
          </Box>
        </motion.div>

        {/* ---------- main columns ---------- */}
        <Box sx={{ display: 'grid', gap: { xs: 5, md: 6 }, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: '5fr 2fr 2fr 3fr' }, pb: 6 }}>
          {/* brand */}
          <Box>
            {/* crop the empty margin around the logo artwork */}
            <Box component="a" href="#top" sx={{ display: 'block', position: 'relative', width: 170, height: 170, mb: 1, mt: -1, overflow: 'hidden' }}>
              <Box component="img" src={logo} alt="InkLock logo"
                sx={{ position: 'absolute', width: 290, height: 290, left: -60, top: -48, maxWidth: 'none' }} />
            </Box>
            <Typography sx={{ color: '#5b5b75', lineHeight: 1.7, maxWidth: 340 }}>
              Private notebooks and an encrypted password vault, behind layers only you control.
            </Typography>
          </Box>

          {/* product */}
          <Box>
            <ColTitle>Product</ColTitle>
            {product.map((l) => (
              <Box key={l.label} component="a" href={l.href} sx={linkSx}>{l.label}</Box>
            ))}
          </Box>

          {/* account */}
          <Box>
            <ColTitle>Account</ColTitle>
            {account.map((l) => (
              <Box key={l.label} component={Link} to={l.to} sx={linkSx}>{l.label}</Box>
            ))}
          </Box>

          {/* promises */}
          <Box>
            <ColTitle>Our promises</ColTitle>
            {promises.map((p) => (
              <Box key={p.t} sx={{ display: 'flex', alignItems: 'center', gap: 1.4, mb: 1.6 }}>
                <Box sx={{ width: 32, height: 32, borderRadius: 2, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: 'linear-gradient(135deg, #a238ff, #2f8bff 60%, #00e5ff)' }}>
                  {p.icon}
                </Box>
                <Typography sx={{ fontSize: '0.92rem', fontWeight: 600, color: '#3a3a55' }}>{p.t}</Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* ---------- bottom bar ---------- */}
        <Box sx={{ py: 3, borderTop: '1px solid #ece8ff', display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Typography sx={{ color: '#8a8aa0', fontSize: '0.88rem', textAlign: { xs: 'center', sm: 'left' } }}>
            © {new Date().getFullYear()} InkLock. Built as a coding practice project.
          </Typography>
          <Box component="a" href="#top"
            sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 2, py: 0.8, borderRadius: 8, textDecoration: 'none', fontSize: '0.85rem', fontWeight: 700, color: '#5b4bd6', bgcolor: '#fff', border: '1px solid #e0dcff', transition: 'all .25s', '&:hover': { color: '#fff', background: BRAND, borderColor: 'transparent', transform: 'translateY(-2px)' } }}>
            Back to top <ArrowUpwardIcon sx={{ fontSize: 16 }} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
