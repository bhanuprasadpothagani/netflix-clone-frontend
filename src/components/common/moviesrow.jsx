import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Favorite as FavoriteIcon, FavoriteBorder as FavoriteBorderIcon } from '@mui/icons-material';
import '../../assets/css/movierow.css';

const MovieRow = ({ genre, movies, favorites, toggleFavorite }) => {
  return (
    <Box className="movie-row">
      <Typography variant="h5" sx={{ color: '#fff', mb: 2 }}>
        {genre}
      </Typography>
      <Box className="movie-row__content">
        {movies.map((movie) => (
          <Box className="movie-card" key={movie._id}>
            <img
              src={movie.info.image_url || 'https://via.placeholder.com/200x300'}
              alt={movie.title}
              className="movie-image"
            />
            {/* Favorite Icon */}
            <IconButton
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                color: favorites.includes(movie._id) ? '#e50914' : '#bbb',
              }}
              onClick={() => toggleFavorite(movie._id)}
            >
              {favorites.includes(movie._id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <Box className="movie-info">
              <Typography variant="h6" className="movie-title">
                {movie.title}
              </Typography>
              <Typography className="movie-rating">Rating: {movie.info.rating}</Typography>
              <Typography className="movie-duration">Duration: {movie.info.duration}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default MovieRow;
