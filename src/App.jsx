import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/CalendarPage';
import EventsPage from './pages/EventsPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const isAuthenticated = localStorage.getItem('accessToken');

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/calendar"
          element={isAuthenticated ? <CalendarPage /> : <Navigate to="/" />}
        />
        <Route
          path="/events"
          element={isAuthenticated ? <EventsPage /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={isAuthenticated ? <ProfilePage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
