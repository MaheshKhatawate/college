import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const AyurvedaChat = () => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { type: 'user', text: question, timestamp: new Date() };
    setChatHistory(prev => [...prev, userMessage]);
    setLoading(true);
    setQuestion('');

    try {
      const res = await axios.post('http://localhost:5000/api/chatbot/ayurveda-chat', { question });
      const botMessage = { 
        type: 'bot', 
        text: res.data.answer || 'No answer received.',
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = { 
        type: 'error', 
        text: 'Error: ' + (err.response?.data?.error || err.message),
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }
    setLoading(false);
  };

  const clearChat = (e) => {
    e.preventDefault()
    setChatHistory([])
  }

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickQuestions = [
    "What are the three doshas?",
    "Best herbs for digestion",
    "How to reduce stress naturally?",
    "Ayurvedic morning routine"
  ];

  const handleQuickQuestion = (q) => {
    setQuestion(q);
  };

  return (
    <div className="h-96 md:h-[550px] flex flex-col bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 rounded-xl shadow-2xl overflow-hidden border border-green-100">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-4 md:p-5 flex justify-between items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-teal-600/20 backdrop-blur-sm"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl">🤖</span>
            </div>
            <div>
              <h3 className="font-bold text-lg md:text-xl text-white">Ayurveda Assistant</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
                <p className="text-xs md:text-sm text-green-100">Online • Ready to help</p>
              </div>
            </div>
          </div>
        </div>
        {chatHistory.length > 0 && (
          <button 
            onClick={clearChat}
            className="relative z-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-white/20 hover:border-white/40 hover:scale-105"
          >
            🗑️ Clear
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 bg-gradient-to-b from-transparent to-white/30">
        {chatHistory.length === 0 ? (
          <div className="text-center text-gray-600 mt-8 md:mt-12">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-4xl">🌿</span>
            </div>
            <h4 className="text-lg md:text-xl font-semibold text-gray-800 mb-2">Welcome to Ayurveda Wisdom</h4>
            <p className="text-sm md:text-base text-gray-600 mb-6">Discover ancient healing knowledge tailored for modern wellness</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
              {quickQuestions.map((q, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickQuestion(q)}
                  className="text-xs md:text-sm bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 text-green-700 px-3 py-2 rounded-lg border border-green-200 hover:border-green-300 transition-all duration-200 hover:shadow-md hover:scale-105"
                >
                  💡 {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {chatHistory.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[85%] lg:max-w-md relative group ${
                  message.type === 'user' ? 'order-1' : 'order-2'
                }`}>
                  {message.type !== 'user' && (
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <span className="text-xs">🤖</span>
                      </div>
                      <span className="text-xs text-gray-500 font-medium">Ayurveda Bot</span>
                    </div>
                  )}
                  <div className={`px-4 py-3 rounded-2xl shadow-lg relative ${
                    message.type === 'user' 
                      ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white ml-auto' 
                      : message.type === 'error'
                      ? 'bg-gradient-to-br from-red-50 to-red-100 text-red-700 border border-red-200'
                      : 'bg-gradient-to-br from-white to-gray-50 text-gray-800 border border-gray-200'
                  }`}>
                    <p className="text-sm md:text-base leading-relaxed whitespace-pre-wrap">{message.text}</p>
                    <span className={`text-xs mt-2 block ${
                      message.type === 'user' ? 'text-blue-200' : 'text-gray-400'
                    }`}>
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-fade-in">
                <div className="max-w-md">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <span className="text-xs">🤖</span>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">Ayurveda Bot</span>
                  </div>
                  <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 px-4 py-3 rounded-2xl shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-gray-600 font-medium">Consulting ancient wisdom...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 md:p-5 bg-white/80 backdrop-blur-sm border-t border-gray-200/50">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative flex items-center space-x-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Ask about doshas, herbs, treatments, wellness tips..."
                className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200 text-sm md:text-base placeholder-gray-400 shadow-sm"
                disabled={loading}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-gray-400">🌿</span>
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading || !question.trim()}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 flex items-center gap-2 min-w-[100px] justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>Send</span>
                  <span className="text-lg">✨</span>
                </>
              )}
            </button>
          </div>
          {!loading && question.trim() && (
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <span>💡</span>
              <span>Press Enter to send or click the Send button</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AyurvedaChat;
