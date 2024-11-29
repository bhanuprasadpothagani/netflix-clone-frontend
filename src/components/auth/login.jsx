import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress, // Material-UI Spinner
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/authstyle.css';
import axios from '../../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Spinner state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Show spinner
    try {
      const response = await axios.post('/auth/login', { email, password });
      const token = response.data.token;

      // Extract user name from the email and store it in localStorage
      const userName = email.split('@')[0];
      localStorage.setItem('token', token);
      localStorage.setItem('userName', userName);

      setIsLoading(false); // Hide spinner
      navigate('/dashboard'); // Redirect to the dashboard
    } catch (err) {
      console.error(err.response?.data || 'Login failed');
      setIsLoading(false); // Hide spinner on error
    }
  };

  return (
    <div className="auth-bg">
      <Container maxWidth="xs" className="auth-container">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.75)',
            padding: 4,
            borderRadius: 2,
          }}
        >
          <Typography variant="h4" sx={{ color: '#fff', marginBottom: 2 }}>
            Sign In
          </Typography>
          <TextField
            label="Email"
            variant="filled"
            fullWidth
            margin="normal"
            InputProps={{ style: { color: '#fff', backgroundColor: '#333' } }}
            InputLabelProps={{ style: { color: '#bbb' } }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading} // Disable input while loading
          />
          <TextField
            label="Password"
            type="password"
            variant="filled"
            fullWidth
            margin="normal"
            InputProps={{ style: { color: '#fff', backgroundColor: '#333' } }}
            InputLabelProps={{ style: { color: '#bbb' } }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading} // Disable input while loading
          />
          {isLoading ? (
            <CircularProgress sx={{ color: '#e50914', mt: 2 }} /> // Show spinner
          ) : (
            <Button
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: '#e50914',
                color: '#fff',
                mt: 2,
                '&:hover': { backgroundColor: '#f40612' },
              }}
              onClick={handleSubmit}
            >
              Sign In
            </Button>
          )}
          <Typography sx={{ color: '#bbb', marginTop: 2 }}>
            New to Netflix?{' '}
            <span
              style={{ color: '#fff', cursor: 'pointer' }}
              onClick={() => navigate('/signup')}
            >
              Sign up now.
            </span>
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
