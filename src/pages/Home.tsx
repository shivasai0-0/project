import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

const Home: React.FC = () => {
  const { currentUser } = useAuth();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle skill selection
  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  // Start barter process
  const handleStartBarter = async () => {
    if (selectedSkills.length === 0) {
      return; // Don't proceed if no skills selected
    }
    
    setIsLoading(true);
    try {
      await apiService.getRecommendations(selectedSkills);
      navigate('/barter');
    } catch (error) {
      console.error('Error starting barter:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="bg-secondary rounded-xl shadow-soft p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3">
              <h1 className="text-3xl md:text-4xl font-bold text-accent mb-4">
                Welcome, {currentUser?.displayName || 'Learner'}!
              </h1>
              <p className="text-text text-lg mb-6">
                Ready to exchange knowledge? You currently have <span className="text-accent font-bold">{currentUser?.points || 0} points</span> to spend on learning new skills.
              </p>
              <p className="text-gray-400 mb-4">
                Select the skills you want to learn below and click "Start Barter" to find your perfect learning match.
              </p>
            </div>
            <div className="md:w-1/3 flex justify-center mt-6 md:mt-0">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-accent">
                <img 
                  src={currentUser?.photoURL || 'https://via.placeholder.com/150'} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Skills Selection Section */}
        <div className="bg-secondary rounded-xl shadow-soft p-8 mb-8">
          <h2 className="text-2xl font-bold text-accent mb-6">Skills You Want to Learn</h2>
          
          <div className="mb-6">
            <p className="text-text mb-4">Select from your learning wishlist:</p>
            <div className="flex flex-wrap gap-3">
              {currentUser?.learning?.map((skill, index) => (
                <button
                  key={index}
                  onClick={() => handleSkillToggle(skill)}
                  className={`px-4 py-2 rounded-full transition-all ${
                    selectedSkills.includes(skill)
                      ? 'bg-accent text-primary'
                      : 'bg-primary text-text hover:bg-gray-800'
                  }`}
                >
                  {skill}
                </button>
              ))}
              {(!currentUser?.learning || currentUser.learning.length === 0) && (
                <p className="text-gray-500">No learning skills added to your profile yet.</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-center mt-8">
            <button
              onClick={handleStartBarter}
              disabled={selectedSkills.length === 0 || isLoading}
              className={`btn btn-primary flex items-center ${
                selectedSkills.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Finding Matches...
                </>
              ) : (
                <>
                  Start Barter
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
        
        {/* Quick Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-secondary rounded-xl shadow-soft p-6">
            <h3 className="text-xl font-semibold text-accent mb-3">Your Teaching Skills</h3>
            <div className="flex flex-wrap gap-2">
              {currentUser?.skills?.map((skill, index) => (
                <span key={index} className="bg-primary text-text px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
              {(!currentUser?.skills || currentUser.skills.length === 0) && (
                <p className="text-gray-500 text-sm">No teaching skills added yet.</p>
              )}
            </div>
          </div>
          
          <div className="bg-secondary rounded-xl shadow-soft p-6">
            <h3 className="text-xl font-semibold text-accent mb-3">Recent Activity</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-text">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                <span>Completed Python Basics quiz</span>
              </li>
              <li className="flex items-center text-text">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                <span>Uploaded new learning material</span>
              </li>
              <li className="flex items-center text-text">
                <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                <span>Earned 15 points from teaching</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-secondary rounded-xl shadow-soft p-6">
            <h3 className="text-xl font-semibold text-accent mb-3">Mini Leaderboard</h3>
            <ul className="space-y-3">
              <li className="flex items-center justify-between text-text">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-accent text-primary rounded-full flex items-center justify-center mr-2">1</span>
                  <span>Mike Johnson</span>
                </div>
                <span className="font-semibold">320 pts</span>
              </li>
              <li className="flex items-center justify-between text-text">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-gray-600 text-gray-300 rounded-full flex items-center justify-center mr-2">2</span>
                  <span>Jane Smith</span>
                </div>
                <span className="font-semibold">290 pts</span>
              </li>
              <li className="flex items-center justify-between text-text">
                <div className="flex items-center">
                  <span className="w-6 h-6 bg-yellow-700 text-yellow-200 rounded-full flex items-center justify-center mr-2">3</span>
                  <span>Sarah Williams</span>
                </div>
                <span className="font-semibold">275 pts</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

