import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState('');
  const { signup, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    
    // Validate form
    if (!email || !password || !confirmPassword) {
      setFormError('Please fill in all fields');
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters');
      return;
    }
    
    try {
      await signup(email, password);
      navigate('/profile-setup');
    } catch (err) {
      console.error('Signup error:', err);
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
          <h1 className="text-3xl font-bold text-accent">Create Account</h1>
          <p className="text-text mt-2">Join our barter-based learning community</p>
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
            <label htmlFor="password" className="block text-text mb-2">Password</label>
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
            <label htmlFor="confirmPassword" className="block text-text mb-2">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
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
              Create Account
            </button>
          </div>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-text">
            Already have an account?{' '}
            <Link to="/login" className="text-accent hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;

