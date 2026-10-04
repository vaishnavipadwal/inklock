import { useRef } from 'react';
import { Container, Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import SaveIcon from '@mui/icons-material/Save';
import ViewQuiltIcon from '@mui/icons-material/ViewQuilt';
import SearchIcon from '@mui/icons-material/Search';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import HistoryIcon from '@mui/icons-material/History';
import LinkIcon from '@mui/icons-material/Link';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import DevicesIcon from '@mui/icons-material/Devices';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';

const BRAND = 'linear-gradient(90deg, #a238ff 0%, #2f8bff 55%, #00e5ff 100%)';
const BRAND_DIAG = 'linear-gradient(135deg, #a238ff, #2f8bff 60%, #00e5ff)';
const HEAD = '"Poppins", "Inter", sans-serif';

/* ---------- tiny preview pieces ---------- */
const Pill = ({ children, color = '#7c6cff' }) => (
  <Box component="span" sx={{ px: 1.1, py: 0.3, mr: 0.7, borderRadius: 8, fontSize: '0.7rem', fontWeight: 700, color, bgcolor: `${color}16`, border: `1px solid ${color}30`, whiteSpace: 'nowrap' }}>
    {children}
  </Box>
);
const Bar = ({ w = '100%', c = '#e9e5ff' }) => (
  <Box sx={{ height: 8, width: w, borderRadius: 4, bgcolor: c, mb: 0.9 }} />
);
const Tick = ({ on }) => (
  <Box sx={{ width: 16, height: 16, borderRadius: '5px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: on ? BRAND : 'transparent', border: on ? 'none' : '2px solid #cfcfe0' }}>
    {on && <CheckRoundedIcon sx={{ fontSize: 12, color: '#fff' }} />}
  </Box>
);

/* ---------- one preview per feature ---------- */
const previews = {
  notebooks: (
    <Box sx={{ display: 'flex', gap: 1.2, alignItems: 'flex-end', height: 74 }}>
      {[['#a238ff', 74, 'Study'], ['#2f8bff', 62, 'Work'], ['#00c2ff', 70, 'Ideas'], ['#ff8a3d', 56, 'Journal'], ['#27c93f', 66, 'Recipes']].map(([c, h, n]) => (
        <Box key={n} sx={{ width: 38, height: h, borderRadius: '6px 6px 3px 3px', bgcolor: c, boxShadow: `0 8px 16px ${c}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform .3s', '.fcard:hover &': { transform: 'translateY(-6px)' } }}>
          <Typography sx={{ writingMode: 'vertical-rl', color: '#fff', fontSize: '0.62rem', fontWeight: 700, letterSpacing: 0.8 }}>{n}</Typography>
        </Box>
      ))}
    </Box>
  ),
  autosave: (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Bar w="70%" c="#d9d2ff" />
        <Box sx={{ width: 2, height: 14, ml: 0.5, mb: 0.9, bgcolor: '#a238ff', animation: 'blink 1s steps(1) infinite', '@keyframes blink': { '50%': { opacity: 0 } } }} />
      </Box>
      <Pill color="#00a88e">● Saved just now</Pill>
    </Box>
  ),
  blocks: (
    <Box>
      <Bar w="60%" c="#d9d2ff" />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.9 }}><Tick on /><Bar w="55%" /></Box>
      <Box sx={{ p: 0.8, borderRadius: 1.5, bgcolor: '#0f1020', color: '#7ef0ff', fontFamily: 'monospace', fontSize: '0.68rem' }}>{'</> code'}</Box>
    </Box>
  ),
  search: (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1.4, py: 0.9, mb: 1.2, borderRadius: 2, bgcolor: '#fff', border: '2px solid #a238ff40' }}>
        <SearchIcon sx={{ fontSize: 18, color: '#a238ff' }} />
        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>wave equation</Typography>
      </Box>
      <Pill>#physics</Pill><Pill color="#2f8bff">#homework</Pill><Pill color="#ff8a3d">★ favorite</Pill>
    </Box>
  ),
  pdf: (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.4 }}>
      <Box sx={{ width: 42, height: 54, borderRadius: 1.5, bgcolor: '#fff', border: '1px solid #e0dcff', p: 0.8, boxShadow: '4px 4px 0 #ece8ff' }}>
        <Bar w="80%" c="#d9d2ff" /><Bar /><Bar w="60%" />
      </Box>
      <Box sx={{ px: 1.6, py: 0.7, borderRadius: 2, color: '#fff', fontSize: '0.78rem', fontWeight: 700, background: BRAND }}>Pages 3-10</Box>
    </Box>
  ),
  history: (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      {['v1', 'v2', 'v3'].map((v, i) => (
        <Box key={v} sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 800, color: i === 2 ? '#fff' : '#7c6cff', background: i === 2 ? BRAND : '#fff', border: '2px solid #a238ff' }}>{v}</Box>
          {i < 2 && <Box sx={{ width: 22, height: 2, bgcolor: '#d9d2ff' }} />}
        </Box>
      ))}
      <Pill>Restore</Pill>
    </Box>
  ),
  share: (
    <Box>
      <Box sx={{ px: 1.2, py: 0.7, mb: 1, borderRadius: 2, bgcolor: '#fff', border: '1px solid #e0dcff', fontSize: '0.75rem', color: '#666' }}>inklock.app/s/x7Kq2…</Box>
      <Pill color="#2f8bff">Read-only</Pill><Pill color="#d9534f">Expires in 7d</Pill>
    </Box>
  ),
  vault: (
    <Box>
      {['GitHub', 'Gmail'].map((s) => (
        <Box key={s} sx={{ display: 'flex', justifyContent: 'space-between', px: 1.4, py: 0.8, mb: 0.8, borderRadius: 2, bgcolor: '#fff', border: '1px solid #ece8ff' }}>
          <Typography sx={{ fontSize: '0.8rem', fontWeight: 700 }}>{s}</Typography>
          <Typography sx={{ fontSize: '0.8rem', letterSpacing: 3, color: '#777' }}>••••••••</Typography>
        </Box>
      ))}
      <Pill color="#0e7490">AES-256-GCM</Pill>
    </Box>
  ),
  trash: (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 1.4, py: 0.9, borderRadius: 2, bgcolor: '#fff', border: '1px dashed #d9534f66' }}>
      <Typography sx={{ fontSize: '0.8rem', color: '#999', textDecoration: 'line-through' }}>Old draft</Typography>
      <Pill color="#00a88e">Restore</Pill>
    </Box>
  ),
  drag: (
    <Box>
      {['Page 1', 'Page 2', 'Page 3'].map((p, i) => (
        <Box key={p} sx={{ display: 'flex', alignItems: 'center', gap: 0.6, px: 1, py: 0.5, mb: 0.6, ml: i === 1 ? 1.6 : 0, borderRadius: 1.5, bgcolor: '#fff', border: `1px solid ${i === 1 ? '#a238ff' : '#ece8ff'}`, boxShadow: i === 1 ? '0 8px 16px rgba(162,56,255,0.2)' : 'none', fontSize: '0.75rem', fontWeight: 600 }}>
          <DragIndicatorIcon sx={{ fontSize: 15, color: '#b5b0d6' }} />{p}
        </Box>
      ))}
    </Box>
  ),
  theme: (
    <Box sx={{ display: 'flex', height: 56, borderRadius: 2, overflow: 'hidden', border: '1px solid #e0dcff' }}>
      <Box sx={{ flex: 1, bgcolor: '#fff', p: 1 }}><Bar w="70%" c="#d9d2ff" /><Bar /></Box>
      <Box sx={{ flex: 1, bgcolor: '#14142b', p: 1 }}><Bar w="70%" c="#3a3a66" /><Bar c="#2a2a4d" /></Box>
    </Box>
  ),
  devices: (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.2 }}>
      <Box sx={{ width: 72, height: 48, borderRadius: '6px 6px 2px 2px', border: '2px solid #a238ff', bgcolor: '#fff', p: 0.7 }}><Bar w="70%" c="#d9d2ff" /><Bar /></Box>
      <Box sx={{ width: 28, height: 46, borderRadius: 2, border: '2px solid #2f8bff', bgcolor: '#fff', p: 0.5 }}><Bar c="#d9d2ff" /><Bar /></Box>
    </Box>
  ),
};

/* span = how many of the 3 columns the card takes on desktop */
const features = [
  { key: 'notebooks', span: 2, icon: <MenuBookIcon />, title: 'Multiple notebooks', desc: 'Separate books for study, work or journaling, each with its own cover color and unlimited pages.' },
  { key: 'autosave', span: 1, icon: <SaveIcon />, title: 'Auto-save', desc: 'Keep typing. A closed tab costs you nothing.' },
  { key: 'blocks', span: 1, icon: <ViewQuiltIcon />, title: 'Mixed content blocks', desc: 'Text, checklists and code on one page.' },
  { key: 'search', span: 2, icon: <SearchIcon />, title: 'Search, tags and favorites', desc: 'Find any note across every book in seconds, then pin the pages you open daily.' },
  { key: 'pdf', span: 1, icon: <PictureAsPdfIcon />, title: 'Export to PDF', desc: 'A whole book, chosen pages, or a range.' },
  { key: 'history', span: 1, icon: <HistoryIcon />, title: 'Version history', desc: 'Go back to any earlier version.' },
  { key: 'share', span: 1, icon: <LinkIcon />, title: 'Expiring share links', desc: 'Read-only links that stop on your date.' },
  { key: 'vault', span: 2, icon: <VpnKeyIcon />, title: 'Encrypted password vault', desc: 'Keep logins next to the notes they belong with, locked behind a separate master password.' },
  { key: 'trash', span: 1, icon: <DeleteSweepIcon />, title: 'Trash and restore', desc: 'Deleted pages wait in Trash first.' },
  { key: 'drag', span: 1, icon: <DragIndicatorIcon />, title: 'Drag-and-drop', desc: 'Reorder pages and books by dragging.' },
  { key: 'theme', span: 1, icon: <DarkModeIcon />, title: 'Dark and light mode', desc: 'Write comfortably at any hour.' },
  { key: 'devices', span: 1, icon: <DevicesIcon />, title: 'Any device', desc: 'Sign in anywhere, notes are there.' },
];

function FeatureCard({ f, i }) {
  const ref = useRef(null);
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--x', `${e.clientX - r.left}px`);
    ref.current.style.setProperty('--y', `${e.clientY - r.top}px`);
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay: (i % 3) * 0.08, ease: 'easeOut' }}
      sx={{ gridColumn: { xs: 'auto', md: `span ${f.span}` } }}
    >
      <Box
        ref={ref}
        className="fcard"
        onMouseMove={onMove}
        sx={{
          position: 'relative', height: '100%', p: 3.5, borderRadius: 4, overflow: 'hidden',
          bgcolor: '#fff', border: '1px solid #ece8ff', transition: 'transform .3s, box-shadow .3s, border-color .3s',
          '&::before': { content: '""', position: 'absolute', inset: 0, opacity: 0, transition: 'opacity .3s', pointerEvents: 'none', background: 'radial-gradient(320px circle at var(--x, 50%) var(--y, 50%), rgba(162,56,255,0.13), transparent 60%)' },
          '&::after': { content: '""', position: 'absolute', left: 0, top: 0, height: 3, width: '100%', background: BRAND, transform: 'scaleX(0)', transformOrigin: 'left', transition: 'transform .4s ease' },
          '&:hover': { transform: 'translateY(-6px)', borderColor: '#cdbfff', boxShadow: '0 20px 44px rgba(124,108,255,0.18)' },
          '&:hover::before': { opacity: 1 },
          '&:hover::after': { transform: 'scaleX(1)' },
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* mini preview */}
          <Box sx={{ mb: 3, p: 2, minHeight: 100, display: 'flex', alignItems: 'center', borderRadius: 3, bgcolor: '#faf9ff', border: '1px solid #f0edff' }}>
            <Box sx={{ width: '100%' }}>{previews[f.key]}</Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.4, mb: 1 }}>
            <Box sx={{ width: 38, height: 38, borderRadius: 2, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: BRAND_DIAG, boxShadow: '0 6px 14px rgba(95,90,255,0.35)', '& svg': { fontSize: 20 } }}>
              {f.icon}
            </Box>
            <Typography sx={{ fontFamily: HEAD, fontWeight: 700, fontSize: '1.08rem', color: '#1b1b2f' }}>{f.title}</Typography>
          </Box>
          <Typography color="text.secondary" sx={{ lineHeight: 1.65, fontSize: '0.94rem' }}>{f.desc}</Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default function FeaturesSection() {
  return (
    <Box id="features" sx={{ position: 'relative', bgcolor: '#f3f4fa', py: { xs: 8, md: 12 }, borderTop: '1px solid #ece8ff', overflow: 'hidden' }}>
      <Box sx={{ position: 'absolute', top: '10%', left: '-10%', width: 420, height: 420, borderRadius: '50%', bgcolor: 'rgba(162,56,255,0.08)', filter: 'blur(110px)', pointerEvents: 'none' }} />
      <Box sx={{ position: 'absolute', bottom: '5%', right: '-10%', width: 420, height: 420, borderRadius: '50%', bgcolor: 'rgba(0,229,255,0.10)', filter: 'blur(110px)', pointerEvents: 'none' }} />

      <Container maxWidth="lg" sx={{ position: 'relative' }}>
        <Typography align="center" sx={{ textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.8rem', fontWeight: 700, color: '#7c6cff', mb: 1.5 }}>
          Features
        </Typography>
        <Typography component="h2" align="center" sx={{ fontFamily: HEAD, fontWeight: 800, fontSize: { xs: '2rem', md: '2.8rem' }, lineHeight: 1.15, letterSpacing: '-0.02em', mb: 2 }}>
          Everything you need to{' '}
          <Box component="span" sx={{ background: BRAND, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>write, organize and protect.</Box>
        </Typography>
        <Typography align="center" color="text.secondary" sx={{ fontSize: '1.1rem', maxWidth: 580, mx: 'auto', mb: 8 }}>
          Small details that make a private notebook feel effortless.
        </Typography>

        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' } }}>
          {features.map((f, i) => <FeatureCard key={f.key} f={f} i={i} />)}
        </Box>
      </Container>
    </Box>
  );
}
