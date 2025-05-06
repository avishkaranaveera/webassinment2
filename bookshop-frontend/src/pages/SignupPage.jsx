import React from 'react';
import SignupForm from '../Components/Auth/SignupForm';
import { Container, Box, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

function SignupPage() {
    return (
        <Container component="main" maxWidth="xs">
             <Paper elevation={3} sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 3 }}>
                 <SignupForm />
                  <Box mt={2}>
                    <Link to="/login">
                        Already have an account? Log In
                    </Link>
                </Box>
            </Paper>
        </Container>
    );
}

export default SignupPage;