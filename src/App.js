import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';

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
        </Routes>
      </Router>
  );
}

export default App;