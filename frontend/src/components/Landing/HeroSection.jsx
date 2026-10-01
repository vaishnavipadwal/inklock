import { useEffect, useState } from 'react';
import { Box, Typography, Button, Container, Stack, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LockIcon from '@mui/icons-material/Lock';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';

const BRAND = 'linear-gradient(90deg, #a238ff 0%, #2f8bff 55%, #00e5ff 100%)';
const HEAD_FONT = '"Poppins", "Inter", sans-serif';

const chips = [
  { icon: <ShieldOutlinedIcon sx={{ fontSize: 18 }} />, label: 'AES-256 vault' },
  { icon: <LockOutlinedIcon sx={{ fontSize: 18 }} />, label: '3 privacy layers' },
  { icon: <TimerOutlinedIcon sx={{ fontSize: 18 }} />, label: 'Auto-lock' },
  { icon: <PictureAsPdfIcon sx={{ fontSize: 18 }} />, label: 'PDF export' },
];

const books = [
  { name: 'Physics Notes', color: '#a238ff', scene: 'notes' },
  { name: 'Project ideas', color: '#00c2ff', scene: null },
  { name: 'Private journal', color: '#ff8a3d', scene: 'locked', locked: true },
];

const SCENES = ['notes', 'locked', 'vault'];

/* ---------- Scene 1: a notebook page ---------- */
function NotesScene() {
  return (
    <Box>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 1 }}>
        PHYSICS NOTES  ·  PAGE 4
      </Typography>
      <Typography sx={{ mt: 0.5, mb: 2, fontWeight: 800, fontSize: '1.4rem', fontFamily: HEAD_FONT, color: '#111' }}>
        Lecture notes: Waves
      </Typography>

      {[{ t: 'Read chapter 6', d: true }, { t: 'Solve problem set 3', d: false }, { t: 'Email lab partner', d: false }].map((c) => (
        <Box key={c.t} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.2 }}>
          <Box sx={{ width: 20, height: 20, borderRadius: '6px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: c.d ? BRAND : 'transparent', border: c.d ? 'none' : '2px solid #cfcfe0' }}>
            {c.d && <Box sx={{ width: 9, height: 9, bgcolor: '#fff', clipPath: 'polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%)' }} />}
          </Box>
          <Typography sx={{ fontWeight: 500, fontSize: '0.95rem', textDecoration: c.d ? 'line-through' : 'none', color: c.d ? 'text.secondary' : '#222' }}>
            {c.t}
          </Typography>
        </Box>
      ))}

      <Box sx={{ mt: 2, bgcolor: '#0f1020', borderRadius: 2, p: 2, fontFamily: 'monospace', fontSize: '0.85rem', color: '#7ef0ff', borderLeft: '4px solid #a238ff' }}>
        <span style={{ color: '#c58bff' }}>def</span> wavelength(v, f):<br />
        &nbsp;&nbsp;&nbsp;&nbsp;<span style={{ color: '#c58bff' }}>return</span> v / f
      </Box>
    </Box>
  );
}

/* ---------- Scene 2: a locked book asking for its password ---------- */
function LockedScene() {
  return (
    <Box sx={{ textAlign: 'center', py: 2 }}>
      <Box sx={{ width: 64, height: 64, mx: 'auto', mb: 2, borderRadius: '50%', background: BRAND, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 10px 30px rgba(162,56,255,0.35)' }}>
        <LockIcon sx={{ color: '#fff', fontSize: 30 }} />
      </Box>
      <Typography sx={{ fontWeight: 800, fontFamily: HEAD_FONT, fontSize: '1.15rem', color: '#111' }}>Private journal is locked</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Enter the book password to open it</Typography>
      <Box sx={{ mx: 'auto', maxWidth: 230, px: 2, py: 1.2, borderRadius: 2, border: '1px solid #d9d4ff', bgcolor: '#fff', letterSpacing: 4, color: '#555', textAlign: 'left' }}>
        ••••••••
      </Box>
      <Box sx={{ mx: 'auto', mt: 1.5, maxWidth: 230, py: 1, borderRadius: 2, background: BRAND, color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>
        Unlock
      </Box>
    </Box>
  );
}

/* ---------- Scene 3: the password vault ---------- */
function VaultScene() {
  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VpnKeyIcon sx={{ color: '#7c6cff' }} />
          <Typography sx={{ fontWeight: 800, fontFamily: HEAD_FONT, color: '#111' }}>Password vault</Typography>
        </Box>
        <Typography variant="caption" sx={{ px: 1.2, py: 0.4, borderRadius: 8, bgcolor: 'rgba(0,229,255,0.12)', color: '#0e7490', fontWeight: 700 }}>
          AES-256-GCM
        </Typography>
      </Box>
      {['GitHub', 'Gmail', 'Netflix'].map((s) => (
        <Box key={s} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.6, mb: 1.2, borderRadius: 2, bgcolor: '#fff', border: '1px solid #ece8ff' }}>
          <Typography sx={{ fontWeight: 600, fontSize: '0.95rem' }}>{s}</Typography>
          <Typography color="text.secondary" sx={{ letterSpacing: 3 }}>••••••••</Typography>
        </Box>
      ))}
    </Box>
  );
}

export default function HeroSection() {
  const [scene, setScene] = useState('notes');

  useEffect(() => {
    const id = setInterval(() => {
      setScene((s) => SCENES[(SCENES.indexOf(s) + 1) % SCENES.length]);
    }, 3800);
    return () => clearInterval(id);
  }, []);

  const rise = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: 'easeOut' },
  });

  return (
    <Box sx={{ position: 'relative', bgcolor: '#ffffff', overflow: 'hidden' }}>
      {/* soft brand glow */}
      <Box sx={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <Box sx={{ position: 'absolute', top: '-10%', right: '-8%', width: 560, height: 560, borderRadius: '50%', bgcolor: 'rgba(0,229,255,0.14)', filter: 'blur(110px)' }} />
        <Box sx={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 520, height: 520, borderRadius: '50%', bgcolor: 'rgba(162,56,255,0.14)', filter: 'blur(110px)' }} />
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, pt: { xs: 6, md: 9 }, pb: { xs: 8, md: 12 }, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: { xs: 8, md: 6 }, alignItems: 'center' }}>
        {/* ---------- LEFT: copy ---------- */}
        <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
          <motion.div {...rise(0)}>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.8, borderRadius: 8, bgcolor: 'rgba(124,108,255,0.1)', color: '#7c6cff', mb: 3, border: '1px solid rgba(124,108,255,0.2)' }}>
              <MenuBookIcon sx={{ fontSize: 16 }} />
              <Typography sx={{ textTransform: 'uppercase', fontSize: '0.72rem', fontWeight: 700, letterSpacing: 0.8 }}>
                Notebooks + password vault
              </Typography>
            </Box>
          </motion.div>

          <motion.div {...rise(0.1)}>
            <Typography component="h1" sx={{ mb: 3, fontFamily: HEAD_FONT, fontWeight: 800, fontSize: { xs: '2.6rem', md: '3.9rem' }, lineHeight: 1.1, letterSpacing: '-0.03em' }}>
              Your notebooks.<br />
              Your secrets.<br />
              <Box component="span" sx={{ background: BRAND, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Locked by you.
              </Box>
            </Typography>
          </motion.div>

          <motion.div {...rise(0.2)}>
            <Typography sx={{ mb: 4, color: 'text.secondary', fontSize: { xs: '1.05rem', md: '1.2rem' }, lineHeight: 1.65, maxWidth: 520, mx: { xs: 'auto', md: 0 } }}>
              Create unlimited notebooks with pages of text, checklists and code. Protect private books with their
              own password, keep logins in an encrypted vault, and export anything to PDF. On any device.
            </Typography>
          </motion.div>

          <motion.div {...rise(0.3)}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4, justifyContent: { xs: 'center', md: 'flex-start' }, alignItems: 'center' }}>
              <Button component={Link} to="/register" variant="contained" size="large"
                sx={{ py: 1.5, px: 4.5, fontSize: '1.05rem', borderRadius: 8, background: BRAND, boxShadow: '0 10px 28px rgba(95,90,255,0.4)', transition: 'transform .2s, box-shadow .2s', '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 14px 34px rgba(95,90,255,0.5)' } }}>
                Get started free
              </Button>
              <Button component={Link} to="/login" variant="outlined" size="large"
                sx={{ py: 1.5, px: 4.5, fontSize: '1.05rem', borderRadius: 8, color: '#333', borderColor: '#d0d0dc', '&:hover': { bgcolor: 'rgba(124,108,255,0.05)', borderColor: '#7c6cff' } }}>
                Sign in
              </Button>
            </Stack>
          </motion.div>

          <motion.div {...rise(0.4)}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
              {chips.map((c) => (
                <Box key={c.label} sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.8, px: 1.6, py: 0.7, borderRadius: 8, border: '1px solid #e6e3ff', bgcolor: '#faf9ff', color: '#4b4b63', fontSize: '0.85rem', fontWeight: 600 }}>
                  <Box sx={{ display: 'flex', color: '#7c6cff' }}>{c.icon}</Box>
                  {c.label}
                </Box>
              ))}
            </Box>
          </motion.div>
        </Box>

        {/* ---------- RIGHT: live product mockup ---------- */}
        <Box sx={{ flex: 1.1, width: '100%', maxWidth: 560, position: 'relative' }}>
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: 'easeOut' }}
          >
            <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
              <Paper elevation={0} sx={{ borderRadius: 5, overflow: 'hidden', bgcolor: 'rgba(255,255,255,0.92)', border: '1px solid #ece8ff', boxShadow: '0 30px 70px rgba(80,60,200,0.18)' }}>
                {/* window bar */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, px: 2, py: 1.4, borderBottom: '1px solid #f0edff', bgcolor: '#faf9ff' }}>
                  {['#ff5f56', '#ffbd2e', '#27c93f'].map((c) => (
                    <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c }} />
                  ))}
                  <Typography variant="caption" sx={{ ml: 1.5, color: 'text.secondary', fontWeight: 600 }}>inklock.app</Typography>
                </Box>

                <Box sx={{ display: 'flex', minHeight: 330 }}>
                  {/* sidebar */}
                  <Box sx={{ width: { xs: 120, sm: 160 }, p: 1.5, borderRight: '1px solid #f0edff', bgcolor: '#fcfbff' }}>
                    <Typography variant="overline" sx={{ color: 'text.secondary', fontWeight: 700, letterSpacing: 1.5, fontSize: '0.65rem' }}>
                      Books
                    </Typography>
                    {books.map((b) => {
                      const active = b.scene === scene;
                      return (
                        <Box key={b.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, mt: 0.6, borderRadius: 2, bgcolor: active ? '#fff' : 'transparent', border: active ? '1px solid #ddd6ff' : '1px solid transparent', boxShadow: active ? '0 6px 16px rgba(124,108,255,0.12)' : 'none', transition: 'all .3s' }}>
                          <Box sx={{ width: 10, height: 10, borderRadius: '3px', bgcolor: b.color, flexShrink: 0 }} />
                          <Typography noWrap sx={{ fontSize: '0.8rem', fontWeight: active ? 700 : 500, color: active ? '#111' : 'text.secondary', flex: 1 }}>
                            {b.name}
                          </Typography>
                          {b.locked && <LockIcon sx={{ fontSize: 13, color: '#ff8a3d' }} />}
                        </Box>
                      );
                    })}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, mt: 2, borderRadius: 2, bgcolor: scene === 'vault' ? '#fff' : 'transparent', border: scene === 'vault' ? '1px solid #ddd6ff' : '1px solid transparent', transition: 'all .3s' }}>
                      <VpnKeyIcon sx={{ fontSize: 15, color: '#7c6cff' }} />
                      <Typography sx={{ fontSize: '0.8rem', fontWeight: scene === 'vault' ? 700 : 500, color: scene === 'vault' ? '#111' : 'text.secondary' }}>
                        Vault
                      </Typography>
                    </Box>
                  </Box>

                  {/* content area */}
                  <Box sx={{ flex: 1, p: { xs: 2, sm: 3 }, position: 'relative' }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={scene}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -24 }}
                        transition={{ duration: 0.35 }}
                      >
                        {scene === 'notes' && <NotesScene />}
                        {scene === 'locked' && <LockedScene />}
                        {scene === 'vault' && <VaultScene />}
                      </motion.div>
                    </AnimatePresence>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </motion.div>

          {/* floating badges */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
            transition={{ opacity: { delay: 1, duration: 0.5 }, scale: { delay: 1, duration: 0.5 }, y: { duration: 5, repeat: Infinity, ease: 'easeInOut' } }}
            style={{ position: 'absolute', bottom: -18, left: -18 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#fff', px: 2, py: 1.2, borderRadius: 8, boxShadow: '0 14px 34px rgba(0,0,0,0.14)', border: '1px solid #eee' }}>
              <CheckCircleIcon sx={{ color: '#00c2a8', fontSize: 20 }} />
              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#222' }}>Auto-saved</Typography>
            </Box>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, 8, 0] }}
            transition={{ opacity: { delay: 1.2, duration: 0.5 }, scale: { delay: 1.2, duration: 0.5 }, y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' } }}
            style={{ position: 'absolute', top: -16, right: -10 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, bgcolor: '#fff', px: 2, py: 1.2, borderRadius: 8, boxShadow: '0 14px 34px rgba(0,0,0,0.14)', border: '1px solid #eee' }}>
              <TimerOutlinedIcon sx={{ color: '#a238ff', fontSize: 20 }} />
              <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', color: '#222' }}>Auto-lock in 4:59</Typography>
            </Box>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}
