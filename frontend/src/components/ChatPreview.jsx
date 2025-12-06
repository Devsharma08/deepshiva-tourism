import React, { useState, useEffect } from 'react';

function ChatPreview() {
  const [currentMessage, setCurrentMessage] = useState(0);
  
  const messages = [
    { type: 'bot', text: "Hi! I'm your AI travel assistant. Where would you like to go?" },
    { type: 'user', text: "I want to visit Japan for cherry blossoms" },
    { type: 'bot', text: "Perfect! The best time is late March to early May. I can help you plan the perfect itinerary!" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md mx-auto animate-float">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="ml-4 text-sm text-gray-500 font-medium">Travel Chat Assistant</span>
      </div>
      
      <div className="space-y-3 h-32 overflow-hidden">
        {messages.slice(0, currentMessage + 1).map((message, index) => (
          <div
            key={index}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs p-3 rounded-lg text-sm ${
                message.type === 'user'
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              } ${index === currentMessage ? 'animate-fade-in' : ''}`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
        <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
        <span>AI is typing...</span>
      </div>
    </div>
  );
}

export default ChatPreview;