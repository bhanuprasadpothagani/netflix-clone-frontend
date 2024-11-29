import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/auth/login';
import Signup from './components/auth/signup';
import Dashboard from './pages/dashboard';
import Favorites from './components/common/favorites';
import MovieDetails from './components/common/moviedetails';
import Home from './pages/home';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/movies/title/:title" element={<MovieDetails />} />

      </Routes>
    </Router>
  );
}

export default App;
