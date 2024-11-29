import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from '../../api/axios'

const Navbar = () => {
  const navigate = useNavigate();

  // Check for user authentication
  const token = localStorage.getItem('token');
  const userName = localStorage.getItem('userName') || 'guest';

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove JWT token
    localStorage.removeItem('userName'); // Remove userName
    navigate('/login'); // Redirect to the login page
  };
  const handleDeleteAccount = async () => {
    const userConfirmed = await Swal.fire({
      title: 'Are you sure?',
      text: "Once deleted, you won't be able to recover your account!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e50914',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete my account!'
    });

    if (userConfirmed.isConfirmed) {
      try {
        // Send a DELETE request to your backend to delete the user account
        const response = await axios.delete('/auth/delete', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT token in the request header
          },
        });

        // On successful deletion, log the user out and redirect to login
        if (response.status === 200) {
          Swal.fire('Deleted!', 'Your account has been deleted.', 'success');
          handleLogout(); // Log out the user
        }
      } catch (err) {
        Swal.fire('Error!', 'There was a problem deleting your account. Please try again.', 'error');
        console.error(err);
      }
    }
  };



  return (
    <AppBar position="static" sx={{ backgroundColor: '#141414' }}>
      <Toolbar>
        {/* Netflix Logo */}
        <Box
          component="img"
          src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
          alt="Netflix Logo"
          sx={{ height: '40px', cursor: 'pointer' }}
          onClick={() => navigate('/')} // Redirect to the home page or dashboard
        />

        {/* Spacer to push content to the right */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Navigation Buttons */}
        {token ? (
          <>
            <Button
              variant="text"
              sx={{ color: '#fff', marginRight: 2 }}
              onClick={() => navigate('/dashboard')}
            >
              Home
            </Button>
            <Button
              variant="text"
              sx={{ color: '#fff', marginRight: 2 }}
              onClick={() => navigate('/favorites')}
            >
              Favorites
            </Button>
            <Typography variant="h6" sx={{ color: '#fff', marginRight: 2 }}>
              Welcome, {userName}
            </Typography>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#e50914',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#e50914',
                  color: '#fff',
                },
              }}
              onClick={handleDeleteAccount} // Trigger account deletion
            >
              Delete Account
            </Button>

            <Button
              variant="outlined"
              sx={{
                borderColor: '#e50914',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#e50914',
                  color: '#fff',
                },
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="text"
              sx={{ color: '#fff', marginRight: 2 }}
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button
              variant="outlined"
              sx={{
                borderColor: '#e50914',
                color: '#fff',
                '&:hover': {
                  backgroundColor: '#e50914',
                  color: '#fff',
                },
              }}
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
