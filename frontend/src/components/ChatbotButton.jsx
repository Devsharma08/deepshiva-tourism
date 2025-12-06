import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChatbotButton() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        className="bg-orange-600 hover:bg-orange-700 text-white p-4 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate('/chat')}
      >
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 3.04 1.05 4.35L1 22l5.65-2.05C8.96 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          {isHovered && (
            <span className="text-sm font-medium whitespace-nowrap animate-fade-in">
              Chat Now
            </span>
          )}
        </div>
      </button>
      
      {/* Pulse animation */}
      <div className="absolute inset-0 bg-orange-600 rounded-full animate-ping opacity-20"></div>
    </div>
  );
}

export default ChatbotButton;