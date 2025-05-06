// src/components/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../service/authService';
import { TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';

// Optional: Pass an onLoginSuccess callback if using Context API or similar
function LoginForm({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userData = await authService.login(email, password);
            console.log('Login successful:', userData);
            // Call the callback if provided (e.g., to update global state)
            if (onLoginSuccess) {
                 onLoginSuccess(userData);
            }
             // Redirect to a protected area, e.g., dashboard or profile
            navigate('/profile'); // Adjust the target route as needed
        } catch (err) {
             const message = err.response?.data?.message || 'Login failed. Please check credentials.';
            setError(message);
             console.error("Login error details:", err.response || err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Typography component="h1" variant="h5">
                Log In
            </Typography>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
            />
            {/* Add "Remember Me" checkbox here if implementing */}
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading || !email || !password}
            >
                 {loading ? <CircularProgress size={24} /> : 'Log In'}
            </Button>
        </Box>
    );
}

export default LoginForm;