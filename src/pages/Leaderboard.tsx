import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

interface LeaderboardUser {
  id: string;
  name: string;
  skills: string[];
  points: number;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch leaderboard data on component mount
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await apiService.getLeaderboard();
        setUsers(data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-secondary rounded-xl shadow-soft p-8">
          <h1 className="text-3xl font-bold text-accent mb-6">Leaderboard</h1>
          <p className="text-text mb-8">
            Top learners and teachers in our community. Points are earned through teaching, learning, and completing quizzes.
          </p>
          
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900 bg-opacity-20 border border-red-800 text-red-300 px-6 py-4 rounded-lg text-center">
              {error}
              <button 
                onClick={() => window.location.reload()} 
                className="block mx-auto mt-4 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Skills</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Points</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {users.map((user, index) => (
                    <tr 
                      key={user.id} 
                      className={`hover:bg-primary transition-colors ${index < 3 ? 'bg-primary bg-opacity-50' : ''}`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                          index === 0 ? 'bg-accent text-primary' : 
                          index === 1 ? 'bg-gray-400 text-gray-900' : 
                          index === 2 ? 'bg-yellow-700 text-yellow-100' : 
                          'bg-gray-700 text-gray-300'
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-text">{user.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {user.skills.slice(0, 3).map((skill, skillIndex) => (
                            <span key={skillIndex} className="px-2 py-1 text-xs rounded-full bg-primary text-text">
                              {skill}
                            </span>
                          ))}
                          {user.skills.length > 3 && (
                            <span className="px-2 py-1 text-xs rounded-full bg-primary text-text">
                              +{user.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-text font-bold">
                          {index < 3 ? (
                            <span className="text-accent">{user.points}</span>
                          ) : (
                            user.points
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                        No leaderboard data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Leaderboard Info */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary rounded-lg p-6">
              <h3 className="text-accent font-medium text-lg mb-3">How Points Work</h3>
              <ul className="text-text space-y-2">
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Teaching sessions: 10-50 points</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Quiz completion: 5-35 points</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Content uploads: 5-15 points</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Daily login streak: 1-5 points</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-primary rounded-lg p-6">
              <h3 className="text-accent font-medium text-lg mb-3">Leaderboard Benefits</h3>
              <ul className="text-text space-y-2">
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Top 3: Gold profile badge</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Top 10: Silver profile badge</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>Top 20: Bronze profile badge</span>
                </li>
                <li className="flex items-start">
                  <span className="text-accent mr-2">•</span>
                  <span>All ranks: Higher visibility in matches</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-primary rounded-lg p-6">
              <h3 className="text-accent font-medium text-lg mb-3">Leaderboard Resets</h3>
              <p className="text-text mb-4">
                The leaderboard resets at the beginning of each month. Your lifetime points are still tracked in your profile.
              </p>
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-sm text-gray-400">Next reset in:</p>
                <p className="text-accent font-medium">
                  {new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;

