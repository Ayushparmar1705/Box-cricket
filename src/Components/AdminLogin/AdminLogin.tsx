import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, TextField, Button, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    // Set token in localStorage for authentication check
    localStorage.setItem('token', 'sample_admin_token');
    navigate('/admindashboard');
  };

  const handleDemoLogin = () => {
    localStorage.setItem('token', 'sample_admin_token');
    navigate('/admindashboard');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f1f5f9',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 420, width: '100%', borderRadius: 3, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: '50%',
                bgcolor: 'rgba(16, 185, 129, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <SportsCricketIcon sx={{ color: '#10b981', fontSize: 32 }} />
            </Box>
            <Typography variant="h5" fontWeight="bold" color="#1e293b">
              Admin Login
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              BoxCricket Management Portal
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              size="small"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              size="small"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                bgcolor: '#10b981',
                '&:hover': { bgcolor: '#059669' },
                py: 1.2,
                fontWeight: 'bold',
                textTransform: 'none',
                borderRadius: 2,
                mt: 1,
              }}
            >
              Sign In
            </Button>
            <Button
              type="button"
              variant="outlined"
              fullWidth
              onClick={handleDemoLogin}
              sx={{
                color: '#10b981',
                borderColor: '#10b981',
                '&:hover': { borderColor: '#059669', bgcolor: 'rgba(16,185,129,0.05)' },
                py: 1,
                textTransform: 'none',
                borderRadius: 2,
              }}
            >
              Quick Demo Access
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
