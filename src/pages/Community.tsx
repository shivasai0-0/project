import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import apiService from '../services/api';

interface User {
  id: string;
  name: string;
  skills: string[];
  online: boolean;
}

interface Message {
  id: string;
  sender: {
    id: string;
    name: string;
    isBot: boolean;
  };
  content: string;
  timestamp: Date;
}

const Community: React.FC = () => {
  const { currentUser } = useAuth();
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch online users and initialize chat
  useEffect(() => {
    const fetchOnlineUsers = async () => {
      try {
        // In a real app, we would fetch online users from an API
        // For this demo, we'll use mock data
        setOnlineUsers([
          { id: '456', name: 'Jane Smith', skills: ['Python', 'Machine Learning', 'Data Science'], online: true },
          { id: '789', name: 'Mike Johnson', skills: ['Python', 'Django', 'SQL'], online: true },
          { id: '101', name: 'Sarah Williams', skills: ['Python', 'Flask', 'AWS'], online: true },
          { id: '202', name: 'Alex Brown', skills: ['Java', 'Spring', 'Hibernate'], online: true },
        ]);
        
        // Initialize with a welcome message
        setMessages([
          {
            id: '1',
            sender: { id: 'bot', name: 'BarterBot', isBot: true },
            content: 'Welcome to the community chat! Ask me anything about learning or connect with other users.',
            timestamp: new Date()
          }
        ]);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching online users:', error);
        setLoading(false);
      }
    };

    fetchOnlineUsers();
    
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

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;
    
    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: {
        id: currentUser.uid,
        name: currentUser.displayName || 'You',
        isBot: false
      },
      content: newMessage,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    try {
      // Get bot response
      const response = await apiService.getChatbotResponse(newMessage);
      
      // Add bot response to chat
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: {
          id: 'bot',
          name: 'BarterBot',
          isBot: true
        },
        content: response.message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // If there are suggestions, add them as a separate message
      if (response.suggestions && response.suggestions.length > 0) {
        const suggestionsMessage: Message = {
          id: (Date.now() + 2).toString(),
          sender: {
            id: 'bot',
            name: 'BarterBot',
            isBot: true
          },
          content: `Suggestions: ${response.suggestions.join(', ')}`,
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, suggestionsMessage]);
      }
    } catch (error) {
      console.error('Error getting chatbot response:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: {
          id: 'bot',
          name: 'BarterBot',
          isBot: true
        },
        content: 'Sorry, I encountered an error processing your request. Please try again later.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto px-4 py-12">
        <div className="bg-secondary rounded-xl shadow-soft overflow-hidden">
          <div className="flex flex-col md:flex-row h-[600px]">
            {/* Online Users Sidebar */}
            <div className="w-full md:w-1/4 bg-primary p-4 overflow-y-auto">
              <h2 className="text-xl font-semibold text-accent mb-4">Online Users</h2>
              
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {onlineUsers.map(user => (
                    <div key={user.id} className="flex items-start">
                      <div className="relative mr-3 flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-text font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-primary"></span>
                      </div>
                      <div>
                        <h3 className="text-text font-medium">{user.name}</h3>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {user.skills.slice(0, 2).map((skill, index) => (
                            <span key={index} className="px-2 py-0.5 text-xs rounded-full bg-secondary text-gray-400">
                              {skill}
                            </span>
                          ))}
                          {user.skills.length > 2 && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-secondary text-gray-400">
                              +{user.skills.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {onlineUsers.length === 0 && (
                    <p className="text-gray-400 text-center py-4">No users online</p>
                  )}
                </div>
              )}
            </div>
            
            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="bg-primary p-4 border-b border-gray-700">
                <h2 className="text-xl font-semibold text-accent">Community Chat</h2>
                <p className="text-gray-400 text-sm">
                  Chat with our AI assistant or connect with other learners
                </p>
              </div>
              
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto bg-secondary">
                <div className="space-y-4">
                  {messages.map(message => (
                    <div 
                      key={message.id} 
                      className={`flex ${message.sender.id === currentUser?.uid ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender.isBot 
                            ? 'bg-blue-900 bg-opacity-30 border border-blue-800' 
                            : message.sender.id === currentUser?.uid
                              ? 'bg-accent bg-opacity-20 border border-accent'
                              : 'bg-primary border border-gray-700'
                        }`}
                      >
                        {message.sender.id !== currentUser?.uid && (
                          <div className="font-medium text-sm mb-1">
                            {message.sender.isBot ? (
                              <span className="text-blue-400">{message.sender.name}</span>
                            ) : (
                              <span className="text-gray-400">{message.sender.name}</span>
                            )}
                          </div>
                        )}
                        <p className="text-text">{message.content}</p>
                        <div className="text-right mt-1">
                          <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              
              {/* Message Input */}
              <div className="p-4 bg-primary border-t border-gray-700">
                <div className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 bg-secondary border border-gray-700 rounded-l-lg px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    className="bg-accent text-primary px-4 py-2 rounded-r-lg font-medium hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Community Guidelines */}
        <div className="bg-secondary rounded-xl shadow-soft p-6 mt-8">
          <h2 className="text-2xl font-semibold text-accent mb-4">Community Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary rounded-lg p-4">
              <h3 className="text-accent font-medium mb-2">Be Respectful</h3>
              <p className="text-text text-sm">
                Treat all community members with respect. No harassment, hate speech, or inappropriate content.
              </p>
            </div>
            
            <div className="bg-primary rounded-lg p-4">
              <h3 className="text-accent font-medium mb-2">Stay On Topic</h3>
              <p className="text-text text-sm">
                Keep discussions related to learning and skill development. Use appropriate channels for different topics.
              </p>
            </div>
            
            <div className="bg-primary rounded-lg p-4">
              <h3 className="text-accent font-medium mb-2">Protect Privacy</h3>
              <p className="text-text text-sm">
                Don't share personal information. Respect others' privacy and maintain confidentiality during barter sessions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;

