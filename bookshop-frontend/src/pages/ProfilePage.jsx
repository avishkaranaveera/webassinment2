import React, { useState, useEffect } from 'react';
import { Typography, Container, Alert, CircularProgress, Button } from '@mui/material';
import axios from 'axios';
import authService from '../service/authService';
import { useNavigate } from 'react-router-dom';


function ProfilePage() {
    const [profileData, setProfileData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
     const token = authService.getCurrentUserToken();


    useEffect(() => {
         if (!token) {
            setError('Not authorized. Redirecting to login...');
            setLoading(false);
            setTimeout(() => navigate('/login'), 1500);
            return;
        }


        const fetchProfile = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await axios.get('http://localhost:3001/api/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setProfileData(response.data);
            } catch (err) {
                 console.error("Profile fetch error:", err.response || err);
                 if (err.response?.status === 401 || err.response?.status === 403) {
                     setError(err.response.data.message + ' Please log in again.');
                     authService.logout(); // Clear invalid token
                     setTimeout(() => navigate('/login'), 2000);
                 } else {
                    setError('Failed to fetch profile data.');
                 }
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
     }, [token, navigate]); // Rerun effect if token or navigate changes


     const handleLogout = () => {
         authService.logout();
         navigate('/login');
     };


     if (loading) {
        return <Container sx={{display: 'flex', justifyContent: 'center', mt: 5}}><CircularProgress /></Container>;
    }

    return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                User Profile
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {profileData && !error && (
                <>
                    <Typography variant="body1">{profileData.message}</Typography>
                    {/* Display more user details if available */}
                </>
            )}
             <Button variant="outlined" color="secondary" onClick={handleLogout} sx={{ mt: 3 }}>
                Logout
            </Button>
        </Container>
    );
}

export default ProfilePage;