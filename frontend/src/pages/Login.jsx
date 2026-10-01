import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button, TextField, Typography, Stack, InputAdornment, IconButton, Alert } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import MailOutlineIcon from '@mui/icons-material/MailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout, { fieldSx, submitSx } from '../components/Auth/AuthLayout';
import api, { errorMessage } from '../api/client';

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Please enter your password"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const justRegistered = location.state?.registered;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const res = await api.post('/auth/login', data);
      localStorage.setItem('inklock_token', res.data.access_token);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(errorMessage(err));
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to open your notebooks and vault."
      footer={
        <Typography variant="body2" color="text.secondary">
          New to InkLock?{' '}
          <Link to="/register" style={{ color: '#7c6cff', textDecoration: 'none', fontWeight: 700 }}>Create an account</Link>
        </Typography>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={2.5}>
          {justRegistered && !serverError && (
            <Alert severity="success" sx={{ borderRadius: 3 }}>Account created. Please sign in.</Alert>
          )}
          {serverError && <Alert severity="error" sx={{ borderRadius: 3 }}>{serverError}</Alert>}

          <TextField
            fullWidth label="Email address" type="email" {...register('email')}
            error={!!errors.email} helperText={errors.email?.message} autoFocus sx={fieldSx}
            slotProps={{ input: { startAdornment: <InputAdornment position="start"><MailOutlineIcon sx={{ color: '#9a8fe0' }} /></InputAdornment> } }}
          />

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

          <Button type="submit" variant="contained" size="large" fullWidth disabled={isSubmitting} sx={submitSx}>
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        </Stack>
      </form>
    </AuthLayout>
  );
}
