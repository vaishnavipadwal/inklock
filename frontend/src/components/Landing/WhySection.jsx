import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import EditNoteIcon from '@mui/icons-material/EditNote';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import HistoryIcon from '@mui/icons-material/History';
import IosShareIcon from '@mui/icons-material/IosShare';
import TuneIcon from '@mui/icons-material/Tune';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const BRAND = 'linear-gradient(90deg, #a238ff 0%, #2f8bff 55%, #00e5ff 100%)';
const BRAND_DIAG = 'linear-gradient(135deg, #a238ff, #2f8bff 60%, #00e5ff)';
const HEAD_FONT = '"Poppins", "Inter", sans-serif';

/* Apps people use today that InkLock replaces */
const replaces = [
  'Notes app',
  'Password manager',
  'To-do list',
  'PDF converter',
  'File locker',
  'Reminder app',
];

/*
  Add or edit features here. soon: true shows a "Soon" badge,
  remove the flag when the feature ships.
*/
const pillars = [
  {
    icon: <EditNoteIcon />,
    title: 'Write without friction',
    desc: 'A real editor for real notes, not a plain text box.',
    items: [
      { t: 'Rich text, headings and lists' },
      { t: 'Checklists and code blocks' },
      { t: 'Auto-save as you type' },
      { t: 'Images and file attachments', soon: true },
      { t: 'Reminders inside pages', soon: true },
    ],
  },
  {
    icon: <MenuBookIcon />,
    title: 'Organize your way',
    desc: 'Structure that scales from one notebook to a whole life.',
    items: [
      { t: 'Unlimited notebooks and pages' },
      { t: 'Search across everything' },
      { t: 'Tags and favorites' },
      { t: 'Drag-and-drop reordering' },
      { t: 'Page templates', soon: true },
    ],
  },
  {
    icon: <ShieldOutlinedIcon />,
    title: 'Protect what matters',
    desc: 'Three independent layers, so one password never opens everything.',
    items: [
      { t: 'Locked books and pages' },
      { t: 'AES-256 encrypted password vault' },
      { t: 'Hashed login passwords' },
      { t: 'Two-factor authentication', soon: true },
      { t: 'Auto-lock and panic button', soon: true },
    ],
  },
  {
    icon: <HistoryIcon />,
    title: 'Recover from mistakes',
    desc: 'Deleting or overwriting the wrong thing should never be final.',
    items: [
      { t: 'Trash with restore' },
      { t: 'Page version history' },
      { t: 'Auto-save, so a closed tab loses nothing' },
    ],
  },
  {
    icon: <IosShareIcon />,
    title: 'Share and export',
    desc: 'Get your work out of InkLock in the form you need.',
    items: [
      { t: 'PDF of a book, pages or a range' },
      { t: 'Read-only share links with expiry' },
      { t: 'Markdown and DOCX export', soon: true },
    ],
  },
  {
    icon: <TuneIcon />,
    title: 'Stay in control',
    desc: 'You decide who gets in, and you can see who tried.',
    items: [
      { t: 'Login history with device and place' },
      { t: 'Dark and light mode' },
      { t: 'Works on any device' },
      { t: 'AI summaries and tag suggestions', soon: true },
    ],
  },
];

const fade = (i = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.6, delay: i * 0.07, ease: 'easeOut' },
});

function Item({ t, soon }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2, mb: 1.1 }}>
      <Box sx={{ width: 7, height: 7, borderRadius: '50%', flexShrink: 0, background: soon ? '#d4d0ee' : BRAND }} />
      <Typography sx={{ fontSize: '0.92rem', color: soon ? 'text.secondary' : '#2a2a40', fontWeight: soon ? 400 : 500, lineHeight: 1.4 }}>
        {t}
      </Typography>
      {soon && (
        <Box sx={{ ml: 'auto', px: 1, py: '1px', borderRadius: 8, fontSize: '0.65rem', fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase', color: '#7c6cff', bgcolor: 'rgba(124,108,255,0.1)', border: '1px solid rgba(124,108,255,0.25)', flexShrink: 0 }}>
          Soon
        </Box>
      )}
    </Box>
  );
}

export default function WhySection() {
  return (
    <Box id="why" sx={{ bgcolor: '#f3f4fa', py: { xs: 8, md: 12 }, borderTop: '1px solid #ece8ff' }}>
      <Container maxWidth="lg">
        {/* ---------- Heading ---------- */}
        <motion.div {...fade()}>
          <Typography align="center" sx={{ textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.8rem', fontWeight: 700, color: '#7c6cff', mb: 1.5 }}>
            Why InkLock
          </Typography>
          <Typography component="h2" align="center" sx={{ fontFamily: HEAD_FONT, fontWeight: 800, fontSize: { xs: '2rem', md: '2.8rem' }, lineHeight: 1.15, letterSpacing: '-0.02em', maxWidth: 820, mx: 'auto', mb: 2 }}>
            One private workspace for everything you{' '}
            <Box component="span" sx={{ background: BRAND, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              write, store and protect.
            </Box>
          </Typography>
          <Typography align="center" sx={{ color: 'text.secondary', fontSize: '1.1rem', maxWidth: 660, mx: 'auto', mb: 5, lineHeight: 1.65 }}>
            Most people juggle a notes app, a password manager, a to-do list and a PDF tool. InkLock brings
            them together behind layers only you control, and keeps getting better.
          </Typography>
        </motion.div>

        {/* ---------- Replaces strip ---------- */}
        <motion.div {...fade(1)}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: 1.2, mb: 8 }}>
            {replaces.map((r) => (
              <Box key={r} sx={{ px: 1.8, py: 0.7, borderRadius: 8, bgcolor: '#fff', border: '1px solid #e8e8f0', color: '#8a8aa0', fontSize: '0.88rem', fontWeight: 600, textDecoration: 'line-through', textDecorationColor: '#c9c9d9' }}>
                {r}
              </Box>
            ))}
            <ArrowForwardIcon sx={{ color: '#7c6cff', mx: 0.5 }} />
            <Box sx={{ px: 2.2, py: 0.8, borderRadius: 8, color: '#fff', fontSize: '0.92rem', fontWeight: 700, background: BRAND, boxShadow: '0 8px 22px rgba(95,90,255,0.35)' }}>
              InkLock
            </Box>
          </Box>
        </motion.div>

        {/* ---------- Six pillars ---------- */}
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, mb: 8 }}>
          {pillars.map((p, i) => (
            <motion.div key={p.title} {...fade(i)} style={{ height: '100%' }}>
              <Box sx={{ height: '100%', p: 3.5, borderRadius: 3, bgcolor: '#fff', border: '1px solid #ece8ff', transition: 'all .3s', '&:hover': { transform: 'translateY(-5px)', borderColor: '#a238ff', boxShadow: '0 14px 36px rgba(124,108,255,0.16)' } }}>
                <Box sx={{ width: 48, height: 48, mb: 2, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: BRAND_DIAG }}>
                  {p.icon}
                </Box>
                <Typography sx={{ fontFamily: HEAD_FONT, fontWeight: 700, fontSize: '1.2rem', mb: 0.8, color: '#1b1b2f' }}>
                  {p.title}
                </Typography>
                <Typography color="text.secondary" sx={{ lineHeight: 1.6, fontSize: '0.95rem', mb: 2.5 }}>
                  {p.desc}
                </Typography>
                {p.items.map((it) => <Item key={it.t} {...it} />)}
              </Box>
            </motion.div>
          ))}
        </Box>

      </Container>
    </Box>
  );
}
