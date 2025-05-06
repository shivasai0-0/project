import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { login, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Validate form
    if (!email || !password) {
      setFormError('Please fill in all fields');
      return;
    }
    
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      // Error is handled by the auth context
    }
  };

  // Clear auth context error when inputs change
  const handleInputChange = () => {
    if (error) {
      clearError();
    }
    if (formError) {
      setFormError('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary px-4">
      <div className="max-w-md w-full bg-secondary rounded-xl shadow-soft p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-accent">Welcome Back</h1>
          <p className="text-text mt-2">Sign in to continue your learning journey</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {(error || formError) && (
            <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-300 px-4 py-3 rounded-lg">
              {error || formError}
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-text mb-2">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                handleInputChange();
              }}
              className="input w-full"
              placeholder="you@example.com"
            />
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <label htmlFor="password" className="block text-text">Password</label>
              <Link to="/forgot-password" className="text-accent text-sm hover:underline">
                Forgot Password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                handleInputChange();
              }}
              className="input w-full"
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <button 
              type="submit" 
              className="btn btn-primary w-full"
            >
              Sign In
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-text">
            Don't have an account?{' '}
            <Link to="/signup" className="text-accent hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

