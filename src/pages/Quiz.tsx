import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../services/api';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer?: number;
}

interface QuizData {
  id: string;
  title: string;
  questions: Question[];
  points: number;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  pointsEarned: number;
  feedback: { questionId: string; correct: boolean }[];
}

const Quiz: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch quiz data on component mount
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!quizId) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const data = await apiService.getQuiz(quizId);
        setQuiz(data);
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError('Failed to load quiz. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Handle option selection
  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (quizCompleted) return;
    
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: optionIndex
    });
  };

  // Navigate to next question
  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit quiz answers
  const handleSubmitQuiz = async () => {
    if (!quiz || !quizId) return;
    
    // Check if all questions are answered
    const answeredQuestions = Object.keys(selectedAnswers).length;
    if (answeredQuestions < quiz.questions.length) {
      const unansweredCount = quiz.questions.length - answeredQuestions;
      if (!window.confirm(`You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`)) {
        return;
      }
    }
    
    setSubmitting(true);
    
    try {
      // Format answers for submission
      const answers = quiz.questions.map(question => ({
        questionId: question.id,
        selectedOption: selectedAnswers[question.id] !== undefined ? selectedAnswers[question.id] : null
      }));
      
      const result = await apiService.submitQuiz(quizId, answers);
      setQuizResult(result);
      setQuizCompleted(true);
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Return to quizzes page
  const handleReturnToQuizzes = () => {
    navigate('/quizzes');
  };

  // Current question
  const currentQuestion = quiz?.questions[currentQuestionIndex];

  // Check if current question is answered
  const isCurrentQuestionAnswered = currentQuestion ? selectedAnswers[currentQuestion.id] !== undefined : false;

  // Progress percentage
  const progressPercentage = quiz ? (Object.keys(selectedAnswers).length / quiz.questions.length) * 100 : 0;

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
              onClick={handleReturnToQuizzes} 
              className="block mx-auto mt-4 px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-700"
            >
              Return to Quizzes
            </button>
          </div>
        ) : quiz ? (
          <div className="bg-secondary rounded-xl shadow-soft p-8">
            {!quizCompleted ? (
              <>
                {/* Quiz Header */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-accent mb-2">{quiz.title}</h1>
                  <div className="flex justify-between items-center">
                    <p className="text-text">
                      Question {currentQuestionIndex + 1} of {quiz.questions.length}
                    </p>
                    <span className="bg-accent text-primary px-3 py-1 rounded-full font-medium">
                      {quiz.points} points possible
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-primary rounded-full h-2.5 mt-4">
                    <div 
                      className="bg-accent h-2.5 rounded-full transition-all duration-300" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Current Question */}
                {currentQuestion && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold text-text mb-6">{currentQuestion.question}</h2>
                    
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <div 
                          key={index}
                          onClick={() => handleSelectOption(currentQuestion.id, index)}
                          className={`p-4 rounded-lg cursor-pointer transition-all ${
                            selectedAnswers[currentQuestion.id] === index
                              ? 'bg-accent bg-opacity-20 border border-accent'
                              : 'bg-primary border border-gray-700 hover:border-accent'
                          }`}
                        >
                          <div className="flex items-center">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                              selectedAnswers[currentQuestion.id] === index
                                ? 'bg-accent text-primary'
                                : 'bg-gray-700 text-gray-300'
                            }`}>
                              {String.fromCharCode(65 + index)}
                            </div>
                            <span className="text-text">{option}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Navigation Buttons */}
                <div className="flex justify-between">
                  <button
                    onClick={handlePrevQuestion}
                    disabled={currentQuestionIndex === 0}
                    className={`px-4 py-2 rounded-lg font-medium ${
                      currentQuestionIndex === 0
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-secondary border border-gray-600 text-text hover:bg-gray-800'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {currentQuestionIndex < quiz.questions.length - 1 ? (
                    <button
                      onClick={handleNextQuestion}
                      disabled={!isCurrentQuestionAnswered}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        !isCurrentQuestionAnswered
                          ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                          : 'bg-accent text-primary hover:bg-opacity-90'
                      }`}
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      onClick={handleSubmitQuiz}
                      disabled={submitting}
                      className="px-4 py-2 bg-accent text-primary rounded-lg font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Submitting...
                        </span>
                      ) : 'Submit Quiz'}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Quiz Results */}
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-accent mb-4">Quiz Completed!</h1>
                  <div className="inline-block bg-primary rounded-full px-6 py-3 mb-6">
                    <span className="text-text text-lg">Your Score: </span>
                    <span className="text-accent text-2xl font-bold">
                      {quizResult?.score} / {quizResult?.totalQuestions}
                    </span>
                  </div>
                  
                  <div className="bg-accent bg-opacity-20 rounded-xl p-6 mb-8">
                    <h2 className="text-accent text-xl font-semibold mb-2">Points Earned</h2>
                    <div className="text-4xl font-bold text-accent">
                      +{quizResult?.pointsEarned}
                    </div>
                  </div>
                </div>
                
                {/* Question Feedback */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-accent mb-4">Question Review</h2>
                  
                  <div className="space-y-6">
                    {quiz.questions.map((question, index) => {
                      const feedback = quizResult?.feedback.find(f => f.questionId === question.id);
                      const isCorrect = feedback?.correct;
                      const selectedOption = selectedAnswers[question.id];
                      
                      return (
                        <div key={index} className="bg-primary rounded-lg p-4">
                          <div className="flex items-start">
                            <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                              isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                            }`}>
                              {isCorrect ? '✓' : '✗'}
                            </div>
                            <div>
                              <h3 className="text-text font-medium mb-2">
                                {index + 1}. {question.question}
                              </h3>
                              
                              <div className="ml-2 space-y-2">
                                {question.options.map((option, optIndex) => (
                                  <div 
                                    key={optIndex}
                                    className={`p-2 rounded ${
                                      question.correctAnswer === optIndex
                                        ? 'bg-green-900 bg-opacity-20 border border-green-800'
                                        : selectedOption === optIndex && selectedOption !== question.correctAnswer
                                          ? 'bg-red-900 bg-opacity-20 border border-red-800'
                                          : 'bg-gray-800'
                                    }`}
                                  >
                                    <div className="flex items-center">
                                      <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 text-sm ${
                                        question.correctAnswer === optIndex
                                          ? 'bg-green-500 text-white'
                                          : selectedOption === optIndex && selectedOption !== question.correctAnswer
                                            ? 'bg-red-500 text-white'
                                            : 'bg-gray-700 text-gray-300'
                                      }`}>
                                        {String.fromCharCode(65 + optIndex)}
                                      </div>
                                      <span className="text-text text-sm">{option}</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <button
                    onClick={handleReturnToQuizzes}
                    className="px-6 py-2 bg-accent text-primary rounded-lg font-medium hover:bg-opacity-90"
                  >
                    Return to Quizzes
                  </button>
                </div>
              </>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Quiz;

