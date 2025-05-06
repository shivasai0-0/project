import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

interface User {
  id: string;
  name: string;
  skills: string[];
  points: number;
  online: boolean;
  profilePicture: string;
}

const Barter: React.FC = () => {
  const [recommendations, setRecommendations] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch recommendations on component mount
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // In a real app, we would get the selected skills from state/context
        // For this demo, we'll just pass an empty array to get all recommendations
        const data = await apiService.getRecommendations([]);
        setRecommendations(data);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
        setError('Failed to load recommendations. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();

    // Set up heartbeat interval to check online status
    const heartbeatInterval = setInterval(async () => {
      try {
        await apiService.sendHeartbeat();
        // In a real app, we would update the online status of users here
      } catch (err) {
        console.error('Heartbeat error:', err);
      }
    }, 30000); // Every 30 seconds

    return () => clearInterval(heartbeatInterval);
  }, []);

  // Handle starting a barter session with a user
  const handleStartBarter = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Close the modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  // Confirm barter session
  const handleConfirmBarter = () => {
    // In a real app, we would initiate a barter session here
    // For this demo, we'll just close the modal
    setShowModal(false);
    setSelectedUser(null);
    
    // Show a success message or redirect to a chat page
    alert(`Barter request sent to ${selectedUser?.name}!`);
  };

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-secondary rounded-xl shadow-soft p-8 mb-8">
          <h1 className="text-3xl font-bold text-accent mb-6">Find Your Learning Match</h1>
          <p className="text-text mb-8">
            Below are users who can teach you the skills you want to learn. 
            Only online users are available for immediate bartering.
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((user) => (
                <div key={user.id} className="bg-primary rounded-xl overflow-hidden shadow-md transition-transform hover:transform hover:scale-105">
                  <div className="relative">
                    {/* Banner image - could be a gradient or pattern */}
                    <div className="h-24 bg-gradient-to-r from-blue-900 to-purple-900"></div>
                    
                    {/* Profile picture */}
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
                      <div className="relative">
                        <img 
                          src={user.profilePicture} 
                          alt={user.name} 
                          className="w-20 h-20 rounded-full border-4 border-primary object-cover"
                        />
                        <span className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-primary ${
                          user.online ? 'bg-green-500' : 'bg-gray-500'
                        }`}></span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-12 p-6">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-semibold text-accent">{user.name}</h3>
                      <p className="text-text">{user.points} points</p>
                      <p className="text-sm text-gray-400 mt-1">
                        {user.online ? 'Online now' : 'Currently offline'}
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <h4 className="text-accent font-medium mb-2">Skills:</h4>
                      <div className="flex flex-wrap gap-2 justify-center">
                        {user.skills.map((skill, index) => (
                          <span key={index} className="bg-secondary text-text px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleStartBarter(user)}
                      disabled={!user.online}
                      className={`w-full py-2 rounded-lg font-medium transition-all ${
                        user.online
                          ? 'bg-accent text-primary hover:bg-opacity-90'
                          : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {user.online ? 'Start Barter' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              ))}
              
              {recommendations.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400 text-lg">No matching users found. Try selecting different skills.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Barter Confirmation Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4">
          <div className="bg-secondary rounded-xl shadow-lg max-w-md w-full p-6 animate-fadeIn">
            <h3 className="text-2xl font-bold text-accent mb-4">Start Barter Session</h3>
            <p className="text-text mb-6">
              You're about to start a barter session with <span className="text-accent font-semibold">{selectedUser.name}</span>. 
              They will be notified of your request.
            </p>
            
            <div className="bg-primary rounded-lg p-4 mb-6">
              <h4 className="text-accent font-medium mb-2">Skills they can teach you:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedUser.skills.map((skill, index) => (
                  <span key={index} className="bg-secondary text-text px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 border border-gray-600 text-text rounded-lg hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmBarter}
                className="px-4 py-2 bg-accent text-primary rounded-lg hover:bg-opacity-90"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Barter;

