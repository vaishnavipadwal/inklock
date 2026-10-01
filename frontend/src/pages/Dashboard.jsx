import { useEffect, useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/auth/me')
      .then((r) => setUser(r.data))
      .catch(() => {
        localStorage.removeItem('inklock_token');
        navigate('/login', { replace: true });
      });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem('inklock_token');
    navigate('/login', { replace: true });
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
      <Typography variant="h4" fontWeight={800}>
        {user ? `Welcome, ${user.name}` : 'Loading...'}
      </Typography>
      <Typography color="text.secondary">{user?.email}</Typography>
      <Typography color="text.secondary">Your notebooks page comes next.</Typography>
      <Button variant="contained" onClick={logout}>Log out</Button>
    </Box>
  );
}
