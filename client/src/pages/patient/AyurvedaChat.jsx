import React, { useState } from 'react';
import axios from 'axios';

const AyurvedaChat = () => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { type: 'user', text: question };
    setChatHistory(prev => [...prev, userMessage]);
    setLoading(true);
    setQuestion('');

    try {
      const res = await axios.post('http://localhost:5000/api/chatbot/ayurveda-chat', { question });
      const botMessage = { type: 'bot', text: res.data.answer || 'No answer received.' };
      setChatHistory(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = { 
        type: 'error', 
        text: 'Error: ' + (err.response?.data?.error || err.message)
      };
      setChatHistory(prev => [...prev, errorMessage]);
    }
    setLoading(false);
  };

  const clearChat = () => {
    setChatHistory([]);
  };

  return (
    <div className="h-96 flex flex-col bg-gray-50 rounded-lg">
      {/* Chat Header */}
      <div className="bg-green-600 text-white p-4 rounded-t-lg flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Ayurveda Assistant</h3>
          <p className="text-sm text-green-100">Ask me anything about Ayurveda, herbs, treatments, and wellness</p>
        </div>
        {chatHistory.length > 0 && (
          <button 
            onClick={clearChat}
            className="bg-green-700 hover:bg-green-800 px-3 py-1 rounded text-sm transition-colors"
          >
            Clear Chat
          </button>
        )}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatHistory.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <div className="text-4xl mb-2">🌿</div>
            <p>Welcome! Ask me anything about Ayurveda.</p>
            <div className="mt-4 text-sm">
              <p className="font-medium mb-2">Try asking:</p>
              <ul className="space-y-1 text-gray-400">
                <li>• "What are the three doshas?"</li>
                <li>• "How to deal with stress using Ayurveda?"</li>
                <li>• "What herbs are good for digestion?"</li>
              </ul>
            </div>
          </div>
        ) : (
          chatHistory.map((message, index) => (
            <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : message.type === 'error'
                  ? 'bg-red-100 text-red-800 border border-red-300'
                  : 'bg-white text-gray-800 border border-gray-200'
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-green-600 border-t-transparent"></div>
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t bg-white rounded-b-lg">
        <div className="flex space-x-2">
          <input
            type="text"
            value={question}
            onChange={e => setQuestion(e.target.value)}
            placeholder="Ask about Ayurveda, doshas, herbs, treatments..."
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || !question.trim()}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? '...' : 'Ask'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AyurvedaChat;
