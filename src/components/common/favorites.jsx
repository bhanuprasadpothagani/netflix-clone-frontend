import React, { useEffect, useState } from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import axios from '../../api/axios';
import Navbar from '../../components/common/navbar';
const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/favorites', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error(err.response?.data);
        setError(err.response?.data.error || 'Failed to fetch favorites');
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  return (
    <div className="favorites">
      <Navbar />
      <Box className="favorites-content">
        <Typography variant="h4" sx={{ color: '#fff', textAlign: 'center', mb: 3 }}>
          My Favorites
        </Typography>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <CircularProgress sx={{ color: '#e50914' }} />
          </Box>
        ) : error ? (
          <Typography sx={{ color: '#e50914', textAlign: 'center' }}>{error}</Typography>
        ) : favorites.length === 0 ? (
          <Typography sx={{ color: '#fff', textAlign: 'center' }}>No favorites found</Typography>
        ) : (
          <Box className="movies-grid">
            {favorites.map((movie) => (
              <Box className="movie-card" key={movie._id}>
                <img
                  src={movie.info.image_url || 'https://via.placeholder.com/200x300'}
                  alt={movie.title}
                  className="movie-image"
                />
                <Box className="movie-info">
                  <Typography variant="h6" className="movie-title">
                    {movie.title}
                  </Typography>
                  <Typography className="movie-plot">{movie.info.plot}</Typography>
                  <Typography className="movie-rating">Rating: {movie.info.rating}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </div>
  );
};

export default Favorites;
