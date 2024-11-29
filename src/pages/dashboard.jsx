import React, { useEffect, useState, useRef } from 'react';
import Navbar from '../components/common/navbar';
import { Box, Typography, IconButton, Button } from '@mui/material';
import { Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon } from '@mui/icons-material';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import '../assets/css/dashboard.css';

const Dashboard = () => {
  const [groupedMovies, setGroupedMovies] = useState({});
  const [favorites, setFavorites] = useState([]); // Store favorite movie IDs
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const rowRefs = useRef({}); // Refs for horizontal scrolling

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get('/movies'); // Fetch grouped movies
        setGroupedMovies(response.data); // Set the grouped movie data
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data.error || 'Failed to fetch movies');
        setIsLoading(false);
      }
    };

    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('/favorites', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setFavorites(response.data.map((movie) => movie._id)); // Extract favorite movie IDs
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchMovies();
    fetchFavorites();
  }, []);

  const handleAddToFavorites = async (movieId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to add to favorites');
      return;
    }

    // Optimistic UI update: update favorites state immediately
    setFavorites((prev) => {
      if (prev.includes(movieId)) {
        return prev.filter((id) => id !== movieId); // Remove movie from favorites
      } else {
        return [...prev, movieId]; // Add movie to favorites
      }
    });

    try {
      if (favorites.includes(movieId)) {
        // Remove from favorites (optimistically already updated in the state)
        await axios.post(
          '/favorites/remove',
          { movieId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Add to favorites (optimistically already updated in the state)
        await axios.post(
          '/favorites',
          { movieId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (err) {
      // Rollback the optimistic UI change if the request fails
      setFavorites((prev) => {
        if (prev.includes(movieId)) {
          return prev.filter((id) => id !== movieId); // Rollback on failure
        } else {
          return [...prev, movieId]; // Rollback on failure
        }
      });
      console.error('Error adding to favorites:', err.response?.data || err.message);
    }
  };

  const handleViewMore = (title) => {
    navigate(`/movie/${encodeURIComponent(title)}`); // Navigate to the movie details page
  };

  return (
    <div className="dashboard">
      <Navbar />
      <Box className="dashboard-content">
        <Typography variant="h4" sx={{ color: '#fff', textAlign: 'center', mb: 3 }}>
          Movies by Genre
        </Typography>
        {isLoading ? (
          <Typography sx={{ color: '#e50914', textAlign: 'center' }}>Loading...</Typography>
        ) : error ? (
          <Typography sx={{ color: '#e50914', textAlign: 'center' }}>{error}</Typography>
        ) : (
          Object.entries(groupedMovies).map(([genre, movies]) => (
            <Box className="movie-row-container" key={genre}>
              <Typography variant="h5" sx={{ color: '#fff', mb: 2 }}>
                {genre.charAt(0).toUpperCase() + genre.slice(1)} {/* Capitalize genre */}
              </Typography>
              <Box className="movie-row" ref={(el) => (rowRefs.current[genre] = el)}>
                {movies.map((movie) => (
                  <Box className="movie-card" key={movie.id}>
                    <img
                      src={movie.info.image_url || 'https://via.placeholder.com/200x300'}
                      alt={movie.title}
                      className="movie-image"
                    />
                    {/* Add to Favorites Icon */}
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 10,
                        right: 10,
                        color: favorites.includes(movie._id) ? '#e50914' : '#bbb',
                      }}
                      onClick={() => handleAddToFavorites(movie._id)} // Use _id for consistency
                    >
                      {favorites.includes(movie._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                    </IconButton>
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
                        onClick={() => handleViewMore(movie.title)} // View more by title
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

export default Dashboard;
