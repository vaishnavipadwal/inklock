import { useState } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import PhonelinkLockIcon from '@mui/icons-material/PhonelinkLock';
import DevicesIcon from '@mui/icons-material/Devices';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import PanToolIcon from '@mui/icons-material/PanTool';
import SpeedIcon from '@mui/icons-material/Speed';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const BRAND = 'linear-gradient(90deg, #a238ff 0%, #2f8bff 55%, #00e5ff 100%)';
const BRAND_DIAG = 'linear-gradient(135deg, #a238ff, #2f8bff 60%, #00e5ff)';
const HEAD = '"Poppins", "Inter", sans-serif';

const layers = [
  { icon: <PersonOutlineIcon />, n: 1, title: 'Your account', protects: 'Everything behind sign-in', how: ['Password hashed with bcrypt or Argon2, never stored as text', 'Short-lived signed tokens with refresh', 'Optional two-factor login'] },
  { icon: <MenuBookIcon />, n: 2, title: 'Locked books and pages', protects: 'Your private notebooks', how: ['A separate password per book or page', 'Asked every time you open it', 'Stored only as a hash'] },
  { icon: <VpnKeyIcon />, n: 3, title: 'Password vault', protects: 'Your saved logins', how: ['Its own master password', 'Entries encrypted with AES-256-GCM', 'Key derived from your password and never stored'] },
];

const steps = ['Your master password', 'Key derived on the spot (PBKDF2 / Argon2)', 'Entry encrypted with AES-256-GCM', 'Only scrambled data is saved'];

const controls = [
  { icon: <PhonelinkLockIcon />, t: 'Two-factor login', d: 'Email OTP or an authenticator app on top of your password.', soon: true },
  { icon: <DevicesIcon />, t: 'Login history', d: 'See every sign-in with its device and place, like "new login from Pune, Chrome".' },
  { icon: <TimerOutlinedIcon />, t: 'Auto-lock', d: 'Locked books and the vault close themselves after you go idle.', soon: true },
  { icon: <PanToolIcon />, t: 'Panic button', d: 'One click locks everything instantly.', soon: true },
  { icon: <SpeedIcon />, t: 'Rate limiting and lockout', d: 'Repeated wrong passwords slow down and then lock the attempt.' },
  { icon: <VerifiedUserIcon />, t: 'Expiring sessions', d: 'Access tokens expire quickly, so a stolen one stops working soon.' },
];

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, delay: i * 0.08, ease: 'easeOut' },
});

const Soon = () => (
  <Box component="span" sx={{ ml: 1, px: 1, py: '1px', borderRadius: 8, fontSize: '0.62rem', fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: '#7c6cff', bgcolor: 'rgba(124,108,255,0.1)', border: '1px solid rgba(124,108,255,0.25)', verticalAlign: 'middle' }}>Soon</Box>
);

function VaultDemo() {
  const [view, setView] = useState('you');
  const rows = [['GitHub', 'dev.vaishnavi'], ['Gmail', 'vaishnavi@mail.com'], ['Netflix', 'family-plan']];
  const cipher = ['9f3a1c7e5b…d04b', 'c81e77a2f0…3a9c', '5be0d4129a…77f1'];

  return (
    <Box sx={{ display: 'grid', gap: { xs: 4, md: 6 }, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, alignItems: 'center', p: { xs: 3, md: 5 }, borderRadius: 5, bgcolor: '#faf9ff', border: '1px solid #ece8ff' }}>
      {/* pipeline */}
      <Box>
        <Typography sx={{ fontFamily: HEAD, fontWeight: 800, fontSize: { xs: '1.5rem', md: '1.9rem' }, lineHeight: 1.2, mb: 1.5, color: '#1b1b2f' }}>
          A vault even we{' '}
          <Box component="span" sx={{ background: BRAND, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>cannot open.</Box>
        </Typography>
        <Typography color="text.secondary" sx={{ lineHeight: 1.65, mb: 3 }}>
          Your master password never reaches our database. Entries are locked before they are stored, so the database owner only ever holds scrambled data.
        </Typography>
        {steps.map((s, i) => (
          <Box key={s} sx={{ display: 'flex', alignItems: 'center', gap: 1.6, mb: 1.4 }}>
            <Box sx={{ width: 30, height: 30, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '0.8rem', background: BRAND_DIAG }}>{i + 1}</Box>
            <Typography sx={{ fontWeight: 600, color: '#2a2a40', fontSize: '0.95rem' }}>{s}</Typography>
          </Box>
        ))}
        <Typography sx={{ mt: 2, p: 1.6, borderRadius: 2, bgcolor: '#fff', border: '1px dashed #cdbfff', fontSize: '0.88rem', color: '#4b4b63', lineHeight: 1.55 }}>
          <b>Trade-off:</b> because we cannot read it, we also cannot recover a forgotten master password. Keep it somewhere safe.
        </Typography>
      </Box>

      {/* toggle demo */}
      <Box>
        <Box sx={{ display: 'flex', p: 0.5, mb: 2, borderRadius: 8, bgcolor: '#ece8ff', width: 'fit-content', mx: { xs: 'auto', md: 0 } }}>
          {[['you', 'What you see'], ['db', 'What our database stores']].map(([k, l]) => (
            <Box key={k} onClick={() => setView(k)} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setView(k)}
              sx={{ px: { xs: 1.5, sm: 2.2 }, py: 0.9, borderRadius: 8, cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700, color: view === k ? '#fff' : '#5b4bd6', background: view === k ? BRAND : 'transparent', transition: 'all .25s' }}>
              {l}
            </Box>
          ))}
        </Box>
        <Box sx={{ p: 2.5, borderRadius: 4, minHeight: 250, bgcolor: view === 'you' ? '#fff' : '#0f1020', border: '1px solid #ece8ff', boxShadow: '0 24px 56px rgba(80,60,200,0.15)', transition: 'background .35s' }}>
          <AnimatePresence mode="wait">
            <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
              {view === 'you' ? (
                <>
                  <Typography sx={{ fontWeight: 800, mb: 1.5, fontFamily: HEAD }}>Password vault</Typography>
                  {rows.map(([s, u]) => (
                    <Box key={s} sx={{ p: 1.5, mb: 1.1, borderRadius: 2, border: '1px solid #ece8ff', bgcolor: '#faf9ff' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontWeight: 700 }}>{s}</Typography>
                        <Typography variant="caption" sx={{ color: '#7c6cff', fontWeight: 700 }}>Show</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">{u}</Typography>
                    </Box>
                  ))}
                </>
              ) : (
                <Box sx={{ fontFamily: 'monospace', color: '#7ef0ff', fontSize: '0.82rem' }}>
                  <Typography sx={{ fontFamily: 'monospace', color: '#8b8bb0', mb: 1.5, fontSize: '0.78rem' }}>table: vault_entries</Typography>
                  {cipher.map((c, i) => (
                    <Box key={c} sx={{ mb: 1.6, pb: 1.4, borderBottom: i < 2 ? '1px solid #25254a' : 'none' }}>
                      <Box sx={{ color: '#c58bff' }}>site_name: <span style={{ color: '#7ef0ff' }}>{c}</span></Box>
                      <Box sx={{ color: '#c58bff' }}>password_enc: <span style={{ color: '#7ef0ff' }}>{cipher[(i + 1) % 3]}</span></Box>
                      <Box sx={{ color: '#c58bff' }}>iv: <span style={{ color: '#7ef0ff' }}>a1{i}f…09</span></Box>
                    </Box>
                  ))}
                  <Typography sx={{ fontFamily: 'monospace', color: '#ff8aa0', fontSize: '0.78rem' }}>No key stored. Unreadable without your master password.</Typography>
                </Box>
              )}
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>
    </Box>
  );
}

export default function SecuritySection() {
  return (
    <Box id="security" sx={{ position: 'relative', bgcolor: '#f3f4fa', py: { xs: 8, md: 12 }, borderTop: '1px solid #ece8ff', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', top: '5%', right: '-10%', width: 440, height: 440, borderRadius: '50%', bgcolor: 'rgba(0,229,255,0.10)', filter: 'blur(110px)', pointerEvents: 'none' }} />
      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <motion.div {...fade()}>
          <Typography align="center" sx={{ textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.8rem', fontWeight: 700, color: '#7c6cff', mb: 1.5 }}>Security</Typography>
          <Typography component="h2" align="center" sx={{ fontFamily: HEAD, fontWeight: 800, fontSize: { xs: '2rem', md: '2.8rem' }, lineHeight: 1.15, letterSpacing: '-0.02em', maxWidth: 780, mx: 'auto', mb: 2 }}>
            Three locks, so one password{' '}
            <Box component="span" sx={{ background: BRAND, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>never opens everything.</Box>
          </Typography>
          <Typography align="center" color="text.secondary" sx={{ fontSize: '1.1rem', maxWidth: 620, mx: 'auto', mb: 8, lineHeight: 1.65 }}>
            Each layer has its own password and protects something different. Getting past one does not get you past the next.
          </Typography>
        </motion.div>

        {/* three layers */}
        <Box sx={{ position: 'relative', display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, mb: 8 }}>
          <Box sx={{ display: { xs: 'none', md: 'block' }, position: 'absolute', top: 27, left: '16%', right: '16%', height: 3, borderRadius: 2, background: BRAND, opacity: 0.35 }} />
          {layers.map((l, i) => (
            <motion.div key={l.title} {...fade(i)} style={{ height: '100%' }}>
              <Box sx={{ position: 'relative', height: '100%', pt: 5, px: 3.5, pb: 3.5, mt: 3, borderRadius: 4, bgcolor: '#fff', border: '1px solid #ece8ff', transition: 'all .3s', '&:hover': { transform: 'translateY(-6px)', borderColor: '#cdbfff', boxShadow: '0 20px 44px rgba(124,108,255,0.16)' } }}>
                <Box sx={{ position: 'absolute', top: -27, left: '50%', transform: 'translateX(-50%)', width: 54, height: 54, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: BRAND_DIAG, border: '4px solid #fff', boxShadow: '0 10px 24px rgba(95,90,255,0.4)' }}>{l.icon}</Box>
                <Typography align="center" sx={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: 1.5, color: '#7c6cff', textTransform: 'uppercase' }}>Layer {l.n}</Typography>
                <Typography align="center" sx={{ fontFamily: HEAD, fontWeight: 700, fontSize: '1.25rem', color: '#1b1b2f', mb: 0.5 }}>{l.title}</Typography>
                <Typography align="center" color="text.secondary" sx={{ fontSize: '0.9rem', mb: 2.5 }}>Protects: {l.protects}</Typography>
                {l.how.map((h) => (
                  <Box key={h} sx={{ display: 'flex', gap: 1.2, mb: 1 }}>
                    <ArrowForwardIcon sx={{ fontSize: 16, mt: '3px', color: '#2f8bff', flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '0.92rem', color: '#3a3a55', lineHeight: 1.5 }}>{h}</Typography>
                  </Box>
                ))}
              </Box>
            </motion.div>
          ))}
        </Box>

        {/* vault demo */}
        <motion.div {...fade()}><VaultDemo /></motion.div>

        {/* controls */}
        <Typography align="center" sx={{ fontFamily: HEAD, fontWeight: 800, fontSize: { xs: '1.5rem', md: '1.9rem' }, mt: 9, mb: 1.5, color: '#1b1b2f' }}>
          And you stay in control.
        </Typography>
        <Typography align="center" color="text.secondary" sx={{ maxWidth: 520, mx: 'auto', mb: 5 }}>
          Extra protections around the three layers.
        </Typography>
        <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
          {controls.map((c, i) => (
            <motion.div key={c.t} {...fade(i % 3)} style={{ height: '100%' }}>
              <Box sx={{ height: '100%', display: 'flex', gap: 2, p: 3, borderRadius: 3, bgcolor: '#faf9ff', border: '1px solid #ece8ff', transition: 'all .3s', '&:hover': { borderColor: '#a238ff', transform: 'translateY(-4px)', boxShadow: '0 12px 30px rgba(124,108,255,0.14)' } }}>
                <Box sx={{ width: 42, height: 42, borderRadius: 2, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: BRAND_DIAG }}>{c.icon}</Box>
                <Box>
                  <Typography sx={{ fontWeight: 700, color: '#1b1b2f', mb: 0.4 }}>{c.t}{c.soon && <Soon />}</Typography>
                  <Typography color="text.secondary" sx={{ fontSize: '0.9rem', lineHeight: 1.55 }}>{c.d}</Typography>
                </Box>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
