import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { apiMessage } from '../utils/apiMessage';

export default function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = 'Email is required';
    if (!password) next.password = 'Password is required';
    setFieldErrors(next);
    if (Object.keys(next).length) {
      toast.error('Email and password are required');
      return false;
    }
    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const payload = await login({ email, password });
      toast.success(`Welcome ${payload.user?.name || ''}`.trim());
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast.error(apiMessage(err, 'Login failed'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        p: 2,
        backgroundImage: 'linear-gradient(rgba(15, 32, 56, 0.62), rgba(15, 32, 56, 0.62)), url(/login-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Paper sx={{ width: '100%', maxWidth: 420, p: { xs: 2.5, sm: 4 } }} elevation={8}>
        <Typography variant="h5" align="center" sx={{ mb: 3, fontWeight: 700 }}>
          MINI CRM
        </Typography>
        <Box component="form" onSubmit={onSubmit} noValidate>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={Boolean(fieldErrors.email)}
            helperText={fieldErrors.email}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={Boolean(fieldErrors.password)}
            helperText={fieldErrors.password}
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} disabled={submitting}>
            {submitting ? 'Logging in…' : 'Login'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
