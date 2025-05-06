import React from 'react';
import LoginForm from '../Components/Auth/LoginForm';
import { Container, Box, Paper } from '@mui/material';
import { Link } from 'react-router-dom';


function LoginPage() {
     // Placeholder for login success handler if needed (e.g., with Context API)
     const handleLoginSuccess = (userData) => {
        console.log("Login successful on page:", userData);
        // Update global state here if needed
    };

    return (
         <Container component="main" maxWidth="xs">
             <Paper elevation={3} sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 3 }}>
                <LoginForm onLoginSuccess={handleLoginSuccess} />
                <Box mt={2}>
                    <Link to="/signup">
                        Don't have an account? Sign Up
                    </Link>
                </Box>
            </Paper>
         </Container>
    );
}

export default LoginPage;