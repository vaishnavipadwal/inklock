import { useState } from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const BRAND = 'linear-gradient(90deg, #a238ff 0%, #2f8bff 55%, #00e5ff 100%)';
const HEAD = '"Poppins", "Inter", sans-serif';

const cats = ['Getting started', 'Privacy', 'Features'];

const faqs = [
  { c: 'Getting started', q: 'Is InkLock free to start?', a: 'Yes. Create an account and start writing right away, no card needed.' },
  { c: 'Getting started', q: 'Which devices can I use?', a: 'Any device with a web browser. Sign in and your notebooks are already there.' },
  { c: 'Getting started', q: 'How many notebooks and pages can I have?', a: 'As many as you like. Every notebook holds unlimited pages, and each page can mix text, checklists and code.' },
  { c: 'Privacy', q: 'Can InkLock read my saved passwords?', a: 'No. Vault entries are encrypted with AES-256-GCM using a key derived from your master password. That key is never stored, so the database only holds scrambled data.' },
  { c: 'Privacy', q: 'What if I forget my vault master password?', a: 'It cannot be recovered. Since we never hold the key, nobody can decrypt the vault without it. Keep your master password somewhere safe.' },
  { c: 'Privacy', q: 'How are my passwords stored?', a: 'Your login password and book passwords are stored as hashes (bcrypt or Argon2), never as plain text. Vault entries are encrypted, because they have to be readable again when you unlock them.' },
  { c: 'Privacy', q: 'What do the three privacy layers mean?', a: 'Layer 1 is your account login. Layer 2 is a separate password on private books or pages. Layer 3 is the vault master password. Each is independent, so one password never opens everything.' },
  { c: 'Features', q: 'Can I export my notes?', a: 'Yes. Export a whole notebook, selected pages or a range like 3 to 10 as a PDF. Markdown and DOCX export are coming.' },
  { c: 'Features', q: 'What if I delete something by mistake?', a: 'Deleted pages go to Trash first so you can restore them, and version history lets you return to an earlier version of a page.' },
  { c: 'Features', q: 'Can I share a page with someone?', a: 'Yes. Create a read-only link and choose when it expires. You can revoke it at any time.' },
  { c: 'Features', q: 'Is two-factor login available?', a: 'It is on the way, along with auto-lock and the panic button. Login history is already there so you can spot unfamiliar sign-ins.' },
  { c: 'Features', q: 'Does my work save automatically?', a: 'Yes. Pages save as you type, so a closed tab or a dropped connection costs you almost nothing.' },
];

function Item({ f, open, onToggle }) {
  return (
    <Box sx={{ mb: 1.5, borderRadius: 3, bgcolor: open ? '#fff' : '#faf9ff', border: '1px solid', borderColor: open ? '#cdbfff' : '#ece8ff', boxShadow: open ? '0 14px 34px rgba(124,108,255,0.14)' : 'none', transition: 'all .3s', '&:hover': { borderColor: '#cdbfff' } }}>
      <Box component="button" onClick={onToggle} aria-expanded={open}
        sx={{ all: 'unset', boxSizing: 'border-box', width: '100%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, p: { xs: 2, sm: 2.5 } }}>
        <Typography sx={{ fontWeight: 700, color: '#1b1b2f', fontSize: { xs: '0.98rem', sm: '1.05rem' } }}>{f.q}</Typography>
        <Box sx={{ width: 32, height: 32, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: open ? '#fff' : '#7c6cff', background: open ? BRAND : '#f1eeff', transform: open ? 'rotate(180deg)' : 'none', transition: 'all .3s' }}>
          <KeyboardArrowDownIcon sx={{ fontSize: 20 }} />
        </Box>
      </Box>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }} style={{ overflow: 'hidden' }}>
            <Typography color="text.secondary" sx={{ px: { xs: 2, sm: 2.5 }, pb: 2.5, lineHeight: 1.7 }}>{f.a}</Typography>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

export default function FaqSection() {
  const [cat, setCat] = useState('Getting started');
  const [open, setOpen] = useState(faqs[0].q);
  const list = faqs.filter((f) => f.c === cat);

  return (
    <Box id="faq" sx={{ position: 'relative', bgcolor: '#f3f4fa', py: { xs: 8, md: 12 }, borderTop: '1px solid #ece8ff', overflow: 'hidden' }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gap: { xs: 5, md: 8 }, gridTemplateColumns: { xs: '1fr', md: '4fr 7fr' }, alignItems: 'start' }}>
          {/* left: heading + help card */}
          <Box sx={{ position: { md: 'sticky' }, top: { md: 110 } }}>
            <Typography sx={{ textTransform: 'uppercase', letterSpacing: 2, fontSize: '0.8rem', fontWeight: 700, color: '#7c6cff', mb: 1.5 }}>FAQ</Typography>
            <Typography component="h2" sx={{ fontFamily: HEAD, fontWeight: 800, fontSize: { xs: '2rem', md: '2.6rem' }, lineHeight: 1.15, letterSpacing: '-0.02em', mb: 2 }}>
              Questions,{' '}
              <Box component="span" sx={{ background: BRAND, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>answered honestly.</Box>
            </Typography>
            <Typography color="text.secondary" sx={{ lineHeight: 1.65, mb: 4 }}>
              Straight answers about privacy, features and what happens when things go wrong.
            </Typography>
            <Box sx={{ p: 3, borderRadius: 4, bgcolor: '#fff', border: '1px solid #ece8ff', boxShadow: '0 14px 34px rgba(124,108,255,0.1)' }}>
              <Typography sx={{ fontFamily: HEAD, fontWeight: 700, mb: 0.8, color: '#1b1b2f' }}>Ready to try it?</Typography>
              <Typography color="text.secondary" sx={{ fontSize: '0.92rem', mb: 2, lineHeight: 1.6 }}>
                Make your first notebook in under a minute.
              </Typography>
              <Button component={Link} to="/register" variant="contained" fullWidth sx={{ py: 1.2, borderRadius: 8, background: BRAND, boxShadow: '0 8px 22px rgba(95,90,255,0.35)' }}>
                Get started free
              </Button>
            </Box>
          </Box>

          {/* right: filters + accordion */}
          <Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {cats.map((c) => (
                <Box key={c} component="button" onClick={() => setCat(c)}
                  sx={{ all: 'unset', cursor: 'pointer', px: 2, py: 0.8, borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, color: cat === c ? '#fff' : '#5b4bd6', background: cat === c ? BRAND : '#fff', border: '1px solid', borderColor: cat === c ? 'transparent' : '#e0dcff', transition: 'all .25s', '&:hover': { borderColor: '#a238ff' } }}>
                  {c}
                </Box>
              ))}
            </Box>
            {list.map((f) => (
              <Item key={f.q} f={f} open={open === f.q} onToggle={() => setOpen(open === f.q ? null : f.q)} />
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
