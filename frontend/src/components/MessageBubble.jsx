import React from 'react';
import { MessageCircle, User, Copy, ThumbsUp, ThumbsDown } from 'lucide-react';
import FormattedText from './FormattedText';

const MessageBubble = ({ message, onSuggestionClick }) => {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-8`}>
      <div className={`flex gap-4 max-w-4xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          {message.type === 'bot' ? (
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 via-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-md">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-600 rounded-2xl flex items-center justify-center shadow-md">
              <User className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col ${message.type === 'user' ? 'items-end' : 'items-start'}`}>
          <div className={`group relative px-6 py-4 shadow-sm ${
            message.type === 'user' 
              ? 'bg-gradient-to-br from-orange-400 via-amber-400 to-orange-500 text-white rounded-2xl rounded-br-md' 
              : 'bg-white border border-gray-100 rounded-2xl rounded-tl-md'
          }`}>
            {message.type === 'user' ? (
              <p className="leading-relaxed text-white">
                {message.content}
              </p>
            ) : (
              <FormattedText 
                content={message.content} 
                className="text-gray-800"
              />
            )}
            
            {/* Message Actions for Bot Messages */}
            {message.type === 'bot' && (
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="flex gap-1">
                  <button
                    onClick={() => copyToClipboard(message.content)}
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
                    title="Copy message"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-green-600 transition-colors"
                    title="Helpful"
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-600 transition-colors"
                    title="Not helpful"
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Suggestions */}
          {message.suggestions && (
            <div className="mt-4 flex flex-wrap gap-2 max-w-lg">
              {message.suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick(suggestion)}
                  className="px-4 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300 transform hover:scale-105 shadow-sm hover:shadow-md font-medium"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
          
          <span className="text-xs text-gray-400 mt-3 font-medium">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;