import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';

const navBtnStyle = {
  position: 'relative',
  backgroundColor: 'transparent',
  fontSize: '1rem',
  color: '#333',
  transition: 'color 0.3s ease',
  '&:hover': {
    backgroundColor: 'transparent',
    color: '#7c6cff',
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    width: '0',
    height: '2px',
    bottom: '4px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#7c6cff',
    transition: 'width 0.3s ease',
    borderRadius: '2px',
  },
  '&:hover::after': {
    width: '80%',
  }
};

export default function Navbar() {
  const scrollTo = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#f3f4fa', color: '#000000' }}>
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, md: 6 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: 'inherit', cursor: 'pointer' }} onClick={(e) => scrollTo(e, 'top')}>
          <Box component="img" src={logo} alt="InkLock Logo" sx={{ height: 48, width: 'auto', objectFit: 'contain' }} />
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
          <Button sx={navBtnStyle} onClick={(e) => scrollTo(e, 'why')}>Why InkLock</Button>
          <Button sx={navBtnStyle} onClick={(e) => scrollTo(e, 'features')}>Features</Button>
          <Button sx={navBtnStyle} onClick={(e) => scrollTo(e, 'security')}>Security</Button>
          <Button sx={navBtnStyle} onClick={(e) => scrollTo(e, 'faq')}>FAQ</Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
          <Button component={Link} to="/login" sx={navBtnStyle}>Login</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
