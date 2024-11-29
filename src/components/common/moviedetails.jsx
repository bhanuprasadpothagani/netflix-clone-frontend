import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Chip, Divider } from '@mui/material';
import axios from '../../api/axios';
import Navbar from './navbar';

const MovieDetails = () => {
  const { title } = useParams();
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login'); // Redirect unauthenticated users to login page
          return;
        }
        const response = await axios.get(`/movies/title/${encodeURIComponent(title)}`, {
          headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache', // Disable caching
        Pragma: 'no-cache', },
        });
        setMovie(response.data);
      } catch (err) {
        setError('Failed to load movie details');
      }
    };

    fetchMovieDetails();
  }, [title, navigate]);

  if (error) return <Typography>{error}</Typography>;
  if (!movie) return <Typography>Loading...</Typography>;

  return (
    <div>
      <Navbar />
      <Box sx={{ padding: 4, color: '#fff', backgroundColor: '#141414', minHeight: '100vh' }}>
        {/* Movie Title */}
        <Typography variant="h4" sx={{ color: '#fff', marginBottom: 3, textAlign: 'center' }}>
          {movie.title} ({movie.year})
        </Typography>

        {/* Movie Poster and Details */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
          {/* Movie Poster */}
          <Box
            component="img"
            src={movie.info.image_url || 'https://via.placeholder.com/400x600'}
            alt={movie.title}
            sx={{
              width: { xs: '100%', md: '400px' },
              height: 'auto',
              borderRadius: 2,
              objectFit: 'cover',
            }}
          />

          {/* Movie Info */}
          <Box sx={{ flex: 1 }}>
            {/* Rating */}
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Rating: <strong>{movie.info.rating || 'N/A'}</strong>
            </Typography>

            {/* Release Date */}
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Release Date: <strong>{new Date(movie.info.release_date).toLocaleDateString()}</strong>
            </Typography>

            {/* Directors */}
            <Typography variant="h6" sx={{ marginBottom: 2 }}>
              Directors: <strong>{movie.info.directors.join(', ')}</strong>
            </Typography>

            {/* Genres */}
            <Typography variant="h6" sx={{ marginBottom: 2 }}>Genres:</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {movie.info.genres.map((genre, index) => (
                <Chip
                  key={index}
                  label={genre}
                  sx={{ backgroundColor: '#e50914', color: '#fff' }}
                />
              ))}
            </Box>

            {/* Plot */}
            <Divider sx={{ my: 4, borderColor: '#e50914' }} />
            <Typography variant="h6">Plot:</Typography>
            <Typography sx={{ lineHeight: 1.8 }}>{movie.info.plot}</Typography>

            {/* Actors */}
            {movie.info.actors && (
              <>
                <Divider sx={{ my: 4, borderColor: '#e50914' }} />
                <Typography variant="h6">Actors:</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginTop: 2 }}>
                  {movie.info.actors.map((actor, index) => (
                    <Chip
                      key={index}
                      label={actor}
                      sx={{
                        backgroundColor: '#333',
                        color: '#fff',
                        padding: 1,
                        fontSize: '0.9rem',
                      }}
                    />
                  ))}
                </Box>
              </>
            )}
          </Box>
        </Box>
      </Box>
    </div>
  );

};

export default MovieDetails;
