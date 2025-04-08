import React, { useState } from 'react';
import {
    Typography,
    TextField,
    Button,
    Container,
    Paper,
    Link,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import logo from '../assets/frilo-logo.svg'; // Ya process.env.PUBLIC_URL + '/frilo-logo.png' agar public folder se load kar rahe ho

const LogoImage = styled('img')(({ theme }) => ({
    width: '200px', // Size badhaya
    marginBottom: theme.spacing(4),
    animation: 'bounce 2s infinite', // Animation add
}));

const LoginPage = styled(Container)(({ theme }) => ({
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #4FC3F7, #81C784)',
}));

const LoginCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(4),
    borderRadius: '15px',
    textAlign: 'center',
    width: '100%',
    maxWidth: '400px',
}));

// Animation CSS
function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        console.log('Logging in with:', { username, password });
        alert('Login successful! (Dummy)');
    };

    return (
        <LoginPage>
            <LogoImage src={logo} alt="FRILO Logo" /> {/* Animated logo */}
            <LoginCard elevation={3}>
                <Typography variant="h5" gutterBottom>
                    Welcome Back!
                </Typography>
                <TextField
                    label="Nickname"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <TextField
                    label="Secret Code"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    onClick={handleLogin}
                    style={{ marginTop: '20px' }}
                >
                    Login
                </Button>
                <Typography variant="body2" style={{ marginTop: '10px' }}>
                    New here? <Link href="/signup">Sign Up</Link>
                </Typography>
            </LoginCard>
            <Typography variant="h6" style={{ color: '#fff', marginTop: '20px', fontStyle: 'italic' }}>
                Dost Se Udhar, Hass Ke Adaa!
            </Typography>
        </LoginPage>
    );
}

export default Login;