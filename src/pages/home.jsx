import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import Navbar from '../components/common/navbar'; // Reuse the existing Navbar
import '../assets/css/dashboard.css'; // Include the CSS for styling (same as Dashboard)

const Home = () => {
  const [groupedMovies, setGroupedMovies] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('/movies'); // Fetch movies grouped by genre
        setGroupedMovies(response.data); // Set the grouped movie data
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data.error || 'Failed to fetch movies');
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const handleViewMore = (title) => {
    // Check if the user is authenticated before navigating to the movie details page
    const token = localStorage.getItem('token');
    if (token) {
      navigate(`/movie/${encodeURIComponent(title)}`); // Navigate to movie details page
    } else {
      navigate('/login'); // Redirect to login if the user is not authenticated
    }
  };

  return (
    <div className="dashboard">
      <Navbar />
      <Box className="dashboard-content">
        <Typography variant="h4" sx={{ color: '#fff', textAlign: 'center', mb: 3 }}>
          Movies 
        </Typography>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress sx={{ color: '#e50914' }} />
          </Box>
        ) : error ? (
          <Typography sx={{ color: '#e50914', textAlign: 'center' }}>{error}</Typography>
        ) : (
          Object.entries(groupedMovies).map(([genre, movies]) => (
            <Box className="movie-row-container" key={genre}>
              <Typography variant="h5" sx={{ color: '#fff', mb: 2 }}>
                {genre.charAt(0).toUpperCase() + genre.slice(1)} {/* Capitalize genre */}
              </Typography>
              <Box className="movie-row">
                {movies.map((movie) => (
                  <Box className="movie-card" key={movie.id}>
                    <img
                      src={movie.info.image_url || 'https://via.placeholder.com/200x300'}
                      alt={movie.title}
                      className="movie-image"
                    />
                    <Box className="movie-info">
                      <Typography variant="h6" className="movie-title">
                        {movie.title}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          mt: 1,
                          backgroundColor: '#e50914',
                          '&:hover': { backgroundColor: '#f40612' },
                        }}
                        onClick={() => handleViewMore(movie.title)} // View movie details
                      >
                        View More
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          ))
        )}
      </Box>
    </div>
  );
};

export default Home;
