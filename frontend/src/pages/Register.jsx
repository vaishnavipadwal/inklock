import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Box, Button, TextField, Typography, Stack, InputAdornment, IconButton, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout, { fieldSx, submitSx } from '../components/Auth/AuthLayout';
import api, { errorMessage } from '../api/client';

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(64, "Password can be at most 64 characters"),
});

function strength(pw = '') {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw) || pw.length >= 12) s++;
  return s;
}
const LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const COLORS = ['#e5e5ee', '#ff5f56', '#ffbd2e', '#2f8bff', '#00c2a8'];

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();

  const { register, handleSubmit, watch, setError, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const score = strength(watch('password'));

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await api.post('/auth/register', data);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      const msg = errorMessage(err);
      if (err.response?.status === 400 && /email/i.test(msg)) {
        setError('email', { message: msg });   // shows under the email field
      } else {
        setServerError(msg);
      }
    }
  };

  const icon = (el) => ({ startAdornment: <InputAdornment position="start">{el}</InputAdornment> });

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join InkLock to secure your notes and passwords."
      footer={
        <Typography variant="body2" color="text.secondary">
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#7c6cff', textDecoration: 'none', fontWeight: 700 }}>Log in</Link>
        </Typography>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>
          {serverError && <Alert severity="error" sx={{ borderRadius: 3 }}>{serverError}</Alert>}

          <TextField
            fullWidth label="Full name" {...register('name')}
            error={!!errors.name} helperText={errors.name?.message} autoFocus sx={fieldSx}
            slotProps={{ input: icon(<PersonOutlineIcon sx={{ color: '#9a8fe0' }} />) }}
          />

          <TextField
            fullWidth label="Email address" type="email" {...register('email')}
            error={!!errors.email} helperText={errors.email?.message} sx={fieldSx}
            slotProps={{ input: icon(<MailOutlineIcon sx={{ color: '#9a8fe0' }} />) }}
          />

          <Box>
            <TextField
              fullWidth label="Password" type={showPassword ? 'text' : 'password'} {...register('password')}
              error={!!errors.password} helperText={errors.password?.message} sx={fieldSx}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><LockOutlinedIcon sx={{ color: '#9a8fe0' }} /></InputAdornment>,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" aria-label="toggle password visibility">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1.2 }}>
              <Box sx={{ display: 'flex', gap: 0.6, flex: 1 }}>
                {[1, 2, 3, 4].map((n) => (
                  <Box key={n} sx={{ flex: 1, height: 5, borderRadius: 3, bgcolor: n <= score ? COLORS[score] : '#ece8ff', transition: 'background .3s' }} />
                ))}
              </Box>
              <Typography sx={{ width: 46, fontSize: '0.78rem', fontWeight: 700, color: COLORS[score] === '#e5e5ee' ? '#9a9ab0' : COLORS[score] }}>
                {LABELS[score]}
              </Typography>
            </Box>
            <Typography sx={{ mt: 0.6, fontSize: '0.78rem', color: '#8a8aa0' }}>
              Use 8 to 64 characters with upper and lower case, a number and a symbol.
            </Typography>
          </Box>

          <Button type="submit" variant="contained" size="large" fullWidth disabled={isSubmitting} sx={submitSx}>
            {isSubmitting ? 'Creating account...' : 'Get Started Free'}
          </Button>
        </Stack>
      </form>
    </AuthLayout>
  );
}
