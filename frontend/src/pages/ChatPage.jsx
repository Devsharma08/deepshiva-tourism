import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Sparkles, MapPin, Calendar, Users, Star, Compass, Trash2, Bot, User } from 'lucide-react';
import { buildContextAwarePrompt, saveMessageToHistory, getChatHistory, clearHistory } from "../utils/ContextManager";

// Mock API Call (Simulating AI latency)
const fetchAIResponse = async (fullPrompt) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        content: "I've checked the archives! Based on your love for history, this destination offers 16th-century forts that are perfect for sunset photography. Would you like a list of heritage hotels nearby?",
        suggestions: ["Heritage Hotels", "Sunset Spots", "Local History", "Photography Tours"]
      });
    }, 1500);
  });
};

const ChatPage = ({ activeState }) => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // --- UPDATED: Load History from IndexedDB (Async) ---
    useEffect(() => {
        const loadHistory = async () => {
            const history = await getChatHistory();
            if (history && history.length > 0) {
                setMessages(history);
            }
        };
        loadHistory();
    }, []);

    // --- UPDATED: Clear History from IndexedDB ---
    const handleClearHistory = async () => {
        await clearHistory();
        setMessages([]);
    };

    const handleSendMessage = async (message = inputMessage) => {
        if (!message.trim()) return;

        // 1. Optimistic UI Update (Show user message immediately)
        const userMessage = {
            role: 'user', // 'role' matches DB schema
            text: message,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);

        try {
            // 2. Save User Message to IndexedDB
            await saveMessageToHistory('user', message);

            // 3. Build Prompt (Fetches latest DB history internally)
            const intelligentPrompt = await buildContextAwarePrompt(message, activeState);
            console.log("AI CONTEXT:", intelligentPrompt);

            // 4. Fetch AI Response
            const responseData = await fetchAIResponse(intelligentPrompt);

            const botResponse = {
                role: 'ai',
                text: responseData.content,
                timestamp: new Date().toISOString(),
                suggestions: responseData.suggestions || []
            };

            // 5. Update UI & Save AI Response to DB
            setMessages(prev => [...prev, botResponse]);
            await saveMessageToHistory('ai', responseData.content);

        } catch (error) {
            console.error('Error:', error);
            // Fallback UI
            setMessages(prev => [...prev, {
                role: 'ai',
                text: "I'm having trouble accessing my travel journals. Please try again.",
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex flex-col relative font-sans">
            {/* Header */}
            <div className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200 group">
                            <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-gray-800" />
                        </button>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900">Travel Companion</h1>
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                {activeState ? `Exploring ${activeState}` : "Ready to plan"}
                            </p>
                        </div>
                    </div>
                    <button onClick={handleClearHistory} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Clear History">
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-80">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                            <Sparkles className="w-10 h-10 text-orange-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Hello!</h2>
                        <p className="text-gray-500 max-w-md">I am your persistent AI guide. I remember our conversations even if you close the browser.</p>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                            {["Suggest a trip", "Safety tips", "Local cuisine", "Budget planning"].map((s, i) => (
                                <button key={i} onClick={() => handleSendMessage(s)} className="p-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-orange-300 hover:bg-orange-50 transition-all text-left">
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto space-y-6">
                        {messages.map((message, index) => (
                            <div key={index} className={`flex gap-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {message.role === 'ai' && (
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-sm flex-shrink-0">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                )}
                                <div className={`max-w-[80%] space-y-2 ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`p-4 rounded-2xl shadow-sm ${
                                        message.role === 'user' 
                                        ? 'bg-gray-900 text-white rounded-tr-sm' 
                                        : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                                    }`}>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                                    </div>
                                    {message.suggestions && message.suggestions.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {message.suggestions.map((suggestion, idx) => (
                                                <button key={idx} onClick={() => handleSendMessage(suggestion)} className="px-3 py-1.5 bg-orange-50 text-orange-700 text-xs font-medium rounded-lg border border-orange-100 hover:bg-orange-100 transition-colors">
                                                    {suggestion}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {message.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shadow-sm flex-shrink-0">
                                        <User className="w-5 h-5 text-gray-600" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex gap-4 justify-start">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-sm">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 md:p-6 shadow-lg">
                <div className="max-w-5xl mx-auto flex gap-4 items-end">
                    <textarea
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask about travel, food, or history..."
                        className="flex-1 px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-none min-h-[56px] max-h-32 shadow-inner transition-all placeholder-gray-400 text-gray-700"
                        rows="1"
                    />
                    <button onClick={() => handleSendMessage()} disabled={!inputMessage.trim()} className="p-4 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-2xl hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatPage;