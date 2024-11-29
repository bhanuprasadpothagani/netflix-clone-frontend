import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/authstyle.css'; 
import axios from '../../api/axios';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

//   const handleSignup = async () => {
//     // Simulate signup
//     console.log('Email:', email, 'Password:', password);
//     navigate('/');
//   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/auth/register', { email, password });
      if(response.data.message)
      navigate('/login');
      alert('user created try logging in')
    //   setMessage(response.data.message || 'Registration successful');
    } catch (err) {
      console.error(err.response.data);
    //   setMessage(err.response.data.error || 'Registration failed');
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
            Sign Up
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
          />
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
            Sign Up
          </Button>
          <Typography sx={{ color: '#bbb', marginTop: 2 }}>
            Already a member?{' '}
            <span
              style={{ color: '#fff', cursor: 'pointer' }}
              onClick={() => navigate('/')}
            >
              Sign in now.
            </span>
          </Typography>
        </Box>
      </Container>
    </div>
  );
};

export default Signup;
