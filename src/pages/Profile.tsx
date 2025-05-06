import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

const Profile: React.FC = () => {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'skills' | 'history'>('overview');

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await apiService.getProfile(currentUser.uid);
        setProfileData(data);
      } catch (err) {
        console.error('Error fetching profile data:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [currentUser]);

  // Mock activity history data
  const activityHistory = [
    { id: '1', type: 'quiz', title: 'Completed Python Basics Quiz', points: 15, date: '2023-05-10' },
    { id: '2', type: 'teaching', title: 'Taught JavaScript to Jane Smith', points: 25, date: '2023-05-08' },
    { id: '3', type: 'learning', title: 'Learned React from Mike Johnson', points: 10, date: '2023-05-05' },
    { id: '4', type: 'content', title: 'Uploaded Machine Learning PDF', points: 15, date: '2023-05-03' },
    { id: '5', type: 'quiz', title: 'Completed JavaScript Fundamentals Quiz', points: 20, date: '2023-04-28' },
  ];

  // Get activity icon based on type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return (
          <div className="w-10 h-10 rounded-full bg-purple-900 bg-opacity-30 border border-purple-800 flex items-center justify-center text-purple-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        );
      case 'teaching':
        return (
          <div className="w-10 h-10 rounded-full bg-green-900 bg-opacity-30 border border-green-800 flex items-center justify-center text-green-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
        );
      case 'learning':
        return (
          <div className="w-10 h-10 rounded-full bg-blue-900 bg-opacity-30 border border-blue-800 flex items-center justify-center text-blue-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          </div>
        );
      case 'content':
        return (
          <div className="w-10 h-10 rounded-full bg-yellow-900 bg-opacity-30 border border-yellow-800 flex items-center justify-center text-yellow-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-12">
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
        ) : profileData ? (
          <>
            {/* Profile Header */}
            <div className="bg-secondary rounded-xl shadow-soft overflow-hidden mb-8">
              <div className="h-32 bg-gradient-to-r from-blue-900 to-purple-900"></div>
              <div className="px-6 pb-6">
                <div className="flex flex-col md:flex-row items-center md:items-end -mt-16 mb-6">
                  <div className="w-32 h-32 rounded-full border-4 border-secondary overflow-hidden bg-primary">
                    <img 
                      src={profileData.profilePicture || 'https://via.placeholder.com/150'} 
                      alt={profileData.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="md:ml-6 mt-4 md:mt-0 text-center md:text-left">
                    <h1 className="text-3xl font-bold text-accent">{profileData.name}</h1>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                      <span className="bg-primary text-text px-3 py-1 rounded-full text-sm">
                        {profileData.points} points
                      </span>
                      <span className="bg-green-900 bg-opacity-30 text-green-400 px-3 py-1 rounded-full text-sm border border-green-800">
                        Active Learner
                      </span>
                    </div>
                  </div>
                  <div className="md:ml-auto mt-4 md:mt-0">
                    <button className="bg-accent text-primary px-4 py-2 rounded-lg font-medium hover:bg-opacity-90">
                      Edit Profile
                    </button>
                  </div>
                </div>
                
                {/* Profile Tabs */}
                <div className="border-b border-gray-700">
                  <nav className="flex space-x-8">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`py-4 px-1 font-medium text-sm border-b-2 ${
                        activeTab === 'overview'
                          ? 'border-accent text-accent'
                          : 'border-transparent text-gray-400 hover:text-text'
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab('skills')}
                      className={`py-4 px-1 font-medium text-sm border-b-2 ${
                        activeTab === 'skills'
                          ? 'border-accent text-accent'
                          : 'border-transparent text-gray-400 hover:text-text'
                      }`}
                    >
                      Skills
                    </button>
                    <button
                      onClick={() => setActiveTab('history')}
                      className={`py-4 px-1 font-medium text-sm border-b-2 ${
                        activeTab === 'history'
                          ? 'border-accent text-accent'
                          : 'border-transparent text-gray-400 hover:text-text'
                      }`}
                    >
                      Activity History
                    </button>
                  </nav>
                </div>
              </div>
            </div>
            
            {/* Tab Content */}
            <div className="bg-secondary rounded-xl shadow-soft p-6">
              {activeTab === 'overview' && (
                <div>
                  <h2 className="text-2xl font-semibold text-accent mb-6">Profile Overview</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-primary rounded-lg p-6">
                      <h3 className="text-accent font-medium mb-3">Points Summary</h3>
                      <div className="text-4xl font-bold text-accent mb-4">{profileData.points}</div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Teaching</span>
                          <span className="text-text">75 pts</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Quizzes</span>
                          <span className="text-text">45 pts</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Content</span>
                          <span className="text-text">30 pts</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-primary rounded-lg p-6">
                      <h3 className="text-accent font-medium mb-3">Teaching Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData.skills.map((skill: string, index: number) => (
                          <span key={index} className="bg-secondary text-text px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                        {profileData.skills.length === 0 && (
                          <p className="text-gray-500 text-sm">No teaching skills added yet.</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="bg-primary rounded-lg p-6">
                      <h3 className="text-accent font-medium mb-3">Learning Interests</h3>
                      <div className="flex flex-wrap gap-2">
                        {profileData.learning.map((skill: string, index: number) => (
                          <span key={index} className="bg-secondary text-text px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                        {profileData.learning.length === 0 && (
                          <p className="text-gray-500 text-sm">No learning interests added yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-primary rounded-lg p-6">
                    <h3 className="text-accent font-medium mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {activityHistory.slice(0, 3).map(activity => (
                        <div key={activity.id} className="flex items-start">
                          {getActivityIcon(activity.type)}
                          <div className="ml-4">
                            <p className="text-text">{activity.title}</p>
                            <div className="flex items-center mt-1 text-sm">
                              <span className="text-gray-400">{activity.date}</span>
                              <span className="mx-2 text-gray-600">•</span>
                              <span className="text-accent">+{activity.points} points</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'skills' && (
                <div>
                  <h2 className="text-2xl font-semibold text-accent mb-6">Skills Management</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Teaching Skills */}
                    <div className="bg-primary rounded-lg p-6">
                      <h3 className="text-xl font-medium text-accent mb-4">Skills I Can Teach</h3>
                      
                      <div className="mb-6">
                        <div className="flex mb-4">
                          <input
                            type="text"
                            placeholder="Add a new teaching skill..."
                            className="flex-1 bg-secondary border border-gray-700 rounded-l-lg px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                          <button className="bg-accent text-primary px-4 py-2 rounded-r-lg font-medium hover:bg-opacity-90">
                            Add
                          </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {profileData.skills.map((skill: string, index: number) => (
                            <div key={index} className="bg-secondary text-text px-3 py-1 rounded-full text-sm flex items-center">
                              {skill}
                              <button className="ml-2 text-gray-400 hover:text-red-400">
                                &times;
                              </button>
                            </div>
                          ))}
                          {profileData.skills.length === 0 && (
                            <p className="text-gray-500 text-sm">No teaching skills added yet.</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-secondary bg-opacity-50 rounded-lg p-4">
                        <h4 className="text-accent font-medium mb-2">Skill Verification</h4>
                        <p className="text-gray-400 text-sm mb-3">
                          Verify your teaching skills to earn a badge and increase your visibility in matches.
                        </p>
                        <button className="bg-blue-900 bg-opacity-30 text-blue-400 px-4 py-2 rounded-lg border border-blue-800 text-sm hover:bg-opacity-40">
                          Start Verification Process
                        </button>
                      </div>
                    </div>
                    
                    {/* Learning Skills */}
                    <div className="bg-primary rounded-lg p-6">
                      <h3 className="text-xl font-medium text-accent mb-4">Skills I Want to Learn</h3>
                      
                      <div className="mb-6">
                        <div className="flex mb-4">
                          <input
                            type="text"
                            placeholder="Add a new learning interest..."
                            className="flex-1 bg-secondary border border-gray-700 rounded-l-lg px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-accent"
                          />
                          <button className="bg-accent text-primary px-4 py-2 rounded-r-lg font-medium hover:bg-opacity-90">
                            Add
                          </button>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {profileData.learning.map((skill: string, index: number) => (
                            <div key={index} className="bg-secondary text-text px-3 py-1 rounded-full text-sm flex items-center">
                              {skill}
                              <button className="ml-2 text-gray-400 hover:text-red-400">
                                &times;
                              </button>
                            </div>
                          ))}
                          {profileData.learning.length === 0 && (
                            <p className="text-gray-500 text-sm">No learning interests added yet.</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-secondary bg-opacity-50 rounded-lg p-4">
                        <h4 className="text-accent font-medium mb-2">Recommended Skills</h4>
                        <p className="text-gray-400 text-sm mb-3">
                          Based on your profile, you might be interested in learning:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button className="bg-blue-900 bg-opacity-30 text-blue-400 px-3 py-1 rounded-full border border-blue-800 text-sm hover:bg-opacity-40">
                            TypeScript
                          </button>
                          <button className="bg-blue-900 bg-opacity-30 text-blue-400 px-3 py-1 rounded-full border border-blue-800 text-sm hover:bg-opacity-40">
                            Redux
                          </button>
                          <button className="bg-blue-900 bg-opacity-30 text-blue-400 px-3 py-1 rounded-full border border-blue-800 text-sm hover:bg-opacity-40">
                            Next.js
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'history' && (
                <div>
                  <h2 className="text-2xl font-semibold text-accent mb-6">Activity History</h2>
                  
                  <div className="bg-primary rounded-lg p-6">
                    <div className="space-y-6">
                      {activityHistory.map(activity => (
                        <div key={activity.id} className="flex items-start">
                          {getActivityIcon(activity.type)}
                          <div className="ml-4 flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                              <p className="text-text">{activity.title}</p>
                              <span className="bg-accent text-primary px-3 py-1 rounded-full text-sm font-medium mt-2 sm:mt-0">
                                +{activity.points} points
                              </span>
                            </div>
                            <p className="text-gray-400 text-sm mt-1">{activity.date}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-8 text-center">
                      <button className="bg-secondary hover:bg-opacity-80 text-text px-4 py-2 rounded-lg">
                        Load More Activity
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Profile;

