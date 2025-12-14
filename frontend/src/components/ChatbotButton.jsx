import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ChatbotButton() {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Tooltip - appears on hover */}
      <div
        className={`absolute right-full mr-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${isHovered
            ? 'opacity-100 translate-x-0'
            : 'opacity-0 translate-x-4 pointer-events-none'
          }`}
      >
        <div className="relative">
          {/* Tooltip Arrow */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
            <div className="w-0 h-0 border-t-8 border-b-8 border-l-8 border-transparent border-l-orange-500"></div>
          </div>

          {/* Tooltip Content */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-3 rounded-xl shadow-lg shadow-orange-500/30">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-sm font-semibold whitespace-nowrap">Chat with AI</span>
            </div>
            <p className="text-xs text-white/80 mt-1">Plan your perfect trip!</p>
          </div>
        </div>
      </div>

      {/* Main Button with Chakra */}
      <button
        className="relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => navigate('/chat')}
      >
        {/* Glow effect on hover */}
        <div className={`absolute inset-0 bg-orange-400 rounded-full blur-xl transition-all duration-500 ${isHovered ? 'opacity-40 scale-150' : 'opacity-0 scale-100'
          }`}></div>

        {/* Rotating Ashoka Chakra Image */}
        <img
          src="/pngegg.png"
          alt="Chat"
          className={`relative w-14 h-14 object-contain transition-all duration-500 ${isHovered ? 'scale-110' : 'scale-100'
            }`}
          style={{
            animation: 'spin 8s linear infinite',
            filter: isHovered ? 'drop-shadow(0 0 12px rgba(249, 115, 22, 0.6))' : 'none'
          }}
        />
      </button>
    </div>
  );
}

export default ChatbotButton;