import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProfileSetup from './pages/ProfileSetup';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Barter from './pages/Barter';
import LearningContent from './pages/LearningContent';
import Quizzes from './pages/Quizzes';
import Quiz from './pages/Quiz';
import Leaderboard from './pages/Leaderboard';
import Community from './pages/Community';

// Styles
import './theme.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              {/* Protected Routes */}
              <Route 
                path="/profile-setup" 
                element={
                  <ProtectedRoute>
                    <ProfileSetup />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute requireProfile>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute requireProfile>
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/barter" 
                element={
                  <ProtectedRoute requireProfile>
                    <Barter />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/learning-content" 
                element={
                  <ProtectedRoute requireProfile>
                    <LearningContent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/quizzes" 
                element={
                  <ProtectedRoute requireProfile>
                    <Quizzes />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/quiz/:quizId" 
                element={
                  <ProtectedRoute requireProfile>
                    <Quiz />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/leaderboard" 
                element={
                  <ProtectedRoute requireProfile>
                    <Leaderboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/community" 
                element={
                  <ProtectedRoute requireProfile>
                    <Community />
                  </ProtectedRoute>
                } 
              />
              
              {/* Redirect any unknown routes to home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

