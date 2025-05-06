import axios from 'axios';
import { auth } from '../firebase/config';

// Create an axios instance with base URL
const api = axios.create({
  baseURL: 'https://api.barterlearning.com/v1', // This would be your actual API URL in production
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Mock API responses for development
const mockResponses = {
  // Authentication
  login: { success: true, user: { id: '123', name: 'John Doe', points: 150 } },
  signup: { success: true, user: { id: '123', name: 'John Doe', points: 0 } },
  
  // Profile
  setupProfile: { success: true },
  getProfile: { 
    id: '123', 
    name: 'John Doe', 
    skills: ['JavaScript', 'React', 'Node.js'], 
    learning: ['Python', 'Machine Learning'], 
    points: 150,
    profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  
  // Recommendations
  recommendations: [
    { 
      id: '456', 
      name: 'Jane Smith', 
      skills: ['Python', 'Machine Learning', 'Data Science'], 
      points: 230, 
      online: true,
      profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg'
    },
    { 
      id: '789', 
      name: 'Mike Johnson', 
      skills: ['Python', 'Django', 'SQL'], 
      points: 180, 
      online: true,
      profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg'
    },
    { 
      id: '101', 
      name: 'Sarah Williams', 
      skills: ['Python', 'Flask', 'AWS'], 
      points: 210, 
      online: false,
      profilePicture: 'https://randomuser.me/api/portraits/women/4.jpg'
    }
  ],
  
  // Heartbeat
  heartbeat: { online: true },
  
  // Learning Content
  videoSummary: { 
    summary: 'This video covers the basics of Python programming, including variables, data types, and control structures. The instructor demonstrates how to write simple Python scripts and explains key concepts with practical examples.',
    points: 10
  },
  pdfNotes: { 
    notes: [
      'Chapter 1: Introduction to Machine Learning',
      'Chapter 2: Supervised Learning Algorithms',
      'Chapter 3: Unsupervised Learning Techniques',
      'Chapter 4: Neural Networks and Deep Learning',
      'Chapter 5: Practical Applications and Case Studies'
    ],
    points: 15
  },
  
  // Quizzes
  getQuizzes: [
    { id: '1', title: 'Python Basics', points: 20 },
    { id: '2', title: 'JavaScript Fundamentals', points: 25 },
    { id: '3', title: 'React Components', points: 30 },
    { id: '4', title: 'Machine Learning Concepts', points: 35 }
  ],
  getQuiz: {
    id: '1',
    title: 'Python Basics',
    questions: [
      {
        id: '1',
        question: 'What is the correct way to create a variable in Python?',
        options: [
          'var x = 5;',
          'x = 5',
          'let x = 5;',
          'const x = 5;'
        ],
        correctAnswer: 1
      },
      {
        id: '2',
        question: 'Which of the following is a valid Python data type?',
        options: [
          'integer',
          'floating',
          'dictionary',
          'array'
        ],
        correctAnswer: 2
      },
      {
        id: '3',
        question: 'How do you create a list in Python?',
        options: [
          'list = (1, 2, 3)',
          'list = [1, 2, 3]',
          'list = {1, 2, 3}',
          'list = <1, 2, 3>'
        ],
        correctAnswer: 1
      }
    ],
    points: 20
  },
  submitQuiz: { 
    score: 2, 
    totalQuestions: 3, 
    pointsEarned: 15,
    feedback: [
      { questionId: '1', correct: true },
      { questionId: '2', correct: true },
      { questionId: '3', correct: false }
    ]
  },
  
  // Leaderboard
  leaderboard: [
    { id: '789', name: 'Mike Johnson', skills: ['Python', 'Django', 'SQL'], points: 320 },
    { id: '456', name: 'Jane Smith', skills: ['Python', 'Machine Learning', 'Data Science'], points: 290 },
    { id: '101', name: 'Sarah Williams', skills: ['Python', 'Flask', 'AWS'], points: 275 },
    { id: '123', name: 'John Doe', skills: ['JavaScript', 'React', 'Node.js'], points: 150 },
    { id: '202', name: 'Alex Brown', skills: ['Java', 'Spring', 'Hibernate'], points: 130 }
  ],
  
  // Chat
  chatbotResponse: { 
    message: 'Based on your learning patterns, I recommend focusing on Python libraries like NumPy and Pandas next. These will complement your Machine Learning interests well.',
    suggestions: ['Try the Python Libraries quiz', 'Connect with Jane Smith who excels in this area']
  }
};

// API service functions
const apiService = {
  // Authentication
  login: async (email: string, password: string) => {
    try {
      // In a real app, this would call the actual API
      // const response = await api.post('/login', { email, password });
      // return response.data;
      
      // For demo, return mock data
      return mockResponses.login;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  signup: async (email: string, password: string) => {
    try {
      // In a real app, this would call the actual API
      // const response = await api.post('/signup', { email, password });
      // return response.data;
      
      // For demo, return mock data
      return mockResponses.signup;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  },
  
  // Profile
  setupProfile: async (profileData: any) => {
    try {
      // In a real app, this would call the actual API
      // const response = await api.post('/setup-profile', profileData);
      // return response.data;
      
      // For demo, return mock data
      return mockResponses.setupProfile;
    } catch (error) {
      console.error('Setup profile error:', error);
      throw error;
    }
  },
  
  getProfile: async (userId: string) => {
    try {
      // In a real app, this would call the actual API
      // const response = await api.get(`/profile/${userId}`);
      // return response.data;
      
      // For demo, return mock data
      return mockResponses.getProfile;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },
  
  // Recommendations
  getRecommendations: async (skills: string[]) => {
    try {
      // In a real app, this would call the actual API
      // const response = await api.post('/recommendations', { skills });
      // return response.data;
      
      // For demo, return mock data
      return mockResponses.recommendations;
    } catch (error) {
      console.error('Get recommendations error:', error);
      throw error;
    }
  },
  
  // Heartbeat
  sendHeartbeat: async () => {
    try {
      // In a real app, this would call the actual API
      // const response = await api.post('/heartbeat');
      // return response.data;
      
      // For demo, return mock data
      return mockResponses.heartbeat;
    } catch (error) {
      console.error('Heartbeat error:', error);
      throw error;
    }
  },
  
  // Learning Content
  getVideoSummary: async (videoData: FormData) => {
    try {
      // In a real app, this would call the actual API
      // const response = await api.post('/video-summary', videoData);
      // return response.data;
      
      // For demo, return mock data
      return mockResponses.videoSummary;
    } catch (error) {
      console.error('Video summary error:', error);
      throw error;
    }
  },
  
  getPdfNotes: async (pdfData: FormData) => {
    try {
      // In a real app, this would call the actual API
      // const response = await api.post('/pdf-notes', pdfData);
      // return response.data;
      
      // For demo, return mock data
      return mockResponses.pdfNotes;
    } catch (error) {
      console.error('PDF notes error:', error);
      throw error;
    }
  },
  
  // Quizzes
  getQuizzes: async () => {
    try {
      // In a real app, this would call the actual API
      // const response = await api.get('/get-quiz');
      // return response.data;
      
      // For demo, return mock data
      return mockResponses.getQuizzes;
    } catch (error) {
      console.error('Get quizzes error:', error);
      throw error;
    }
  },
  
  getQuiz: async (quizId: string) => {
    try {
      // In a real app, this would call the actual API
      // const response = await api.get(`/get-quiz/${quizId}`);
      // return response.data;
      
      // For demo, return mock data
      return mockResponses.getQuiz;
    } catch (error) {
      console.error('Get quiz error:', error);
      throw error;
    }
  },
  
  submitQuiz: async (quizId: string, answers: any[]) => {
    try {
      // In a real app, this would call the actual API
      // const response = await api.post(`/submit-quiz/${quizId}`, { answers });
      // return response.data;
      
      // For demo, return mock data
      return mockResponses.submitQuiz;
    } catch (error) {
      console.error('Submit quiz error:', error);
      throw error;
    }
  },
  
  // Leaderboard
  getLeaderboard: async () => {
    try {
      // In a real app, this would call the actual API
      // const response = await api.get('/leaderboard');
      // return response.data;
      
      // For demo, return mock data
      return mockResponses.leaderboard;
    } catch (error) {
      console.error('Leaderboard error:', error);
      throw error;
    }
  },
  
  // Chat
  getChatbotResponse: async (message: string) => {
    try {
      // In a real app, this would call the actual API
      // const response = await api.post('/chatbot-response', { message });
      // return response.data;
      
      // For demo, return mock data
      return mockResponses.chatbotResponse;
    } catch (error) {
      console.error('Chatbot response error:', error);
      throw error;
    }
  }
};

export default apiService;

