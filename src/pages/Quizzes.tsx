import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';

interface Quiz {
  id: string;
  title: string;
  points: number;
}

const Quizzes: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch quizzes on component mount
  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await apiService.getQuizzes();
        setQuizzes(data);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setError('Failed to load quizzes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // Handle quiz selection
  const handleQuizSelect = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-secondary rounded-xl shadow-soft p-8 mb-8">
          <h1 className="text-3xl font-bold text-accent mb-6">Knowledge Quizzes</h1>
          <p className="text-text mb-8">
            Test your knowledge and earn points by completing quizzes on various topics.
            Each quiz has a different point value based on its difficulty.
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
              {quizzes.map((quiz) => (
                <div 
                  key={quiz.id} 
                  className="bg-primary rounded-xl overflow-hidden shadow-md transition-all hover:shadow-lg cursor-pointer"
                  onClick={() => handleQuizSelect(quiz.id)}
                >
                  <div className="h-32 bg-gradient-to-r from-blue-900 to-purple-900 flex items-center justify-center">
                    <span className="text-4xl text-white font-bold opacity-30">Q</span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-accent mb-2">{quiz.title}</h3>
                    <div className="flex justify-between items-center">
                      <span className="text-text">Earn up to:</span>
                      <span className="bg-accent text-primary px-3 py-1 rounded-full font-medium">
                        {quiz.points} points
                      </span>
                    </div>
                    <button 
                      className="w-full mt-4 py-2 bg-secondary hover:bg-opacity-80 text-text rounded-lg transition-colors"
                    >
                      Start Quiz
                    </button>
                  </div>
                </div>
              ))}
              
              {quizzes.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-400 text-lg">No quizzes available at the moment. Check back later!</p>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Quiz Information Section */}
        <div className="bg-secondary rounded-xl shadow-soft p-8">
          <h2 className="text-2xl font-semibold text-accent mb-6">How Quizzes Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary rounded-lg p-6">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary font-bold text-xl mb-4">
                1
              </div>
              <h3 className="text-accent font-medium text-lg mb-2">Choose a Quiz</h3>
              <p className="text-text">
                Select a quiz from the available options based on your interests and skills.
                Each quiz shows the potential points you can earn.
              </p>
            </div>
            
            <div className="bg-primary rounded-lg p-6">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary font-bold text-xl mb-4">
                2
              </div>
              <h3 className="text-accent font-medium text-lg mb-2">Answer Questions</h3>
              <p className="text-text">
                Each quiz contains multiple-choice questions. Read carefully and select the best answer.
                Some quizzes may have time limits.
              </p>
            </div>
            
            <div className="bg-primary rounded-lg p-6">
              <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-primary font-bold text-xl mb-4">
                3
              </div>
              <h3 className="text-accent font-medium text-lg mb-2">Earn Points</h3>
              <p className="text-text">
                Points are awarded based on the number of correct answers. 
                Complete quizzes to climb the leaderboard and unlock new opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quizzes;

