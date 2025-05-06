// src/components/SignupForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../../service/authService'; // Ensure path is correct
import { TextField, Button, Box, Typography, Alert, CircularProgress } from '@mui/material';

function SignupForm() {
    // --- ADDED: State for username ---
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setSuccess('');

        // --- ADDED: Basic username validation ---
        if (!username) {
            setError('Username is required.');
            return;
        }
        if (username.length < 3) {
           setError('Username must be at least 3 characters long.');
           return;
       }
        // Keep other validations
        if (password !== confirmPassword) {
            setError("Passwords don't match.");
            return;
        }
         if (password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        // Consider adding email format check here too if needed, though backend handles it
        if (!email) {
             setError('Email is required.');
             return;
        }


        setLoading(true);
        try {
            // --- MODIFIED: Pass username, email, and password ---
            const response = await authService.signup(username, email, password);
            setSuccess(response.data.message + " Redirecting to login...");
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            // Error message could be about email OR username being in use
            const message = err.response?.data?.message || 'Signup failed. Please try again.';
            setError(message);
            console.error("Signup error details:", err.response || err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <Typography component="h1" variant="h5">
                Sign Up
            </Typography>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

            {/* --- ADDED: TextField for Username --- */}
            <TextField
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username (min 3 chars)"
                name="username"
                autoComplete="username"
                autoFocus // You might move autoFocus to username now
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={username.length > 0 && username.length < 3}
                helperText={username.length > 0 && username.length < 3 ? "Username too short" : ""}
                disabled={loading}
            />

            {/* Keep Email TextField */}
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                // Remove autoFocus if moved to username
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
            />
            {/* Keep Password Fields */}
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password (min 6 chars)"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={password.length > 0 && password.length < 6}
                helperText={password.length > 0 && password.length < 6 ? "Password too short" : ""}
                disabled={loading}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPassword.length > 0 && password !== confirmPassword}
                helperText={confirmPassword.length > 0 && password !== confirmPassword ? "Passwords do not match" : ""}
                disabled={loading}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                 // --- MODIFIED: Update disabled condition ---
                disabled={
                    loading ||
                    !username || // Check username
                    username.length < 3 || // Check username length
                    !email || // Check email
                    !password ||
                    password.length < 6 ||
                    password !== confirmPassword
                }
            >
                {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
        </Box>
    );
}

export default SignupForm;