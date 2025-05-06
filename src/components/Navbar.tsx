import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'border-b-2 border-accent' : '';
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  // Don't show navbar on login or signup pages
  if (location.pathname === '/login' || location.pathname === '/signup') {
    return null;
  }

  return (
    <nav className="bg-secondary shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-accent font-bold text-xl">
              BarterLearn
            </Link>
          </div>
          
          {currentUser ? (
            <div className="flex items-center space-x-6">
              <Link to="/" className={`text-text hover:text-accent ${isActive('/')}`}>
                Home
              </Link>
              <Link to="/profile" className={`text-text hover:text-accent ${isActive('/profile')}`}>
                Profile
              </Link>
              <Link to="/barter" className={`text-text hover:text-accent ${isActive('/barter')}`}>
                Barter
              </Link>
              <Link to="/quizzes" className={`text-text hover:text-accent ${isActive('/quizzes')}`}>
                Quizzes
              </Link>
              <Link to="/leaderboard" className={`text-text hover:text-accent ${isActive('/leaderboard')}`}>
                Leaderboard
              </Link>
              <Link to="/community" className={`text-text hover:text-accent ${isActive('/community')}`}>
                Community
              </Link>
              <button 
                onClick={handleLogout}
                className="ml-4 bg-accent text-primary px-3 py-1 rounded-lg hover:bg-opacity-90 transition-all"
              >
                Logout
              </button>
              <div className="flex items-center ml-4">
                <img 
                  src={currentUser.photoURL || 'https://via.placeholder.com/40'} 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border-2 border-accent"
                />
                <span className="ml-2 text-text">{currentUser.points} pts</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-accent hover:text-opacity-90">
                Login
              </Link>
              <Link to="/signup" className="bg-accent text-primary px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

