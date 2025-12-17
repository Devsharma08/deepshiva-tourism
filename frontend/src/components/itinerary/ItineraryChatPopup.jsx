import React, { useState, useRef, useEffect } from 'react';

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyA2mIvVw_C-1d8ubev_4dAnJG820Nbff58';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

function ItineraryChatPopup({ isOpen, onClose, tripContext, destinations }) {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const conversationHistory = useRef([]);

    // Build system context for the AI
    const buildSystemContext = () => {
        const scheduled = destinations.filter(d => d.scheduledDay !== null);
        const pending = destinations.filter(d => d.scheduledDay === null);

        const scheduledList = scheduled.map(d => `${d.name} (Day ${d.scheduledDay}, ${d.scheduledTime || 'TBD'})`).join(', ');
        const pendingList = pending.map(d => d.name).join(', ');

        return `You are a helpful travel assistant for planning a trip. Here's the trip context:

Trip: ${tripContext.title}
Dates: ${tripContext.dateRange.start} to ${tripContext.dateRange.end}
Party Size: ${tripContext.partySize} people
Transport: ${tripContext.transportMode}
Pace: ${tripContext.pace}

Scheduled destinations: ${scheduledList || 'None yet'}
Pending destinations to schedule: ${pendingList || 'None'}

Help the user with scheduling, local tips, best times to visit, travel logistics, and recommendations. Be concise, friendly, and practical.`;
    };

    // Helper function to delay
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Call Gemini API with retry logic for rate limits
    const callGeminiAPI = async (userMessage, retryCount = 0) => {
        const MAX_RETRIES = 3;
        const BASE_DELAY = 2000; // 2 seconds

        // Add user message to history (only on first attempt)
        if (retryCount === 0) {
            conversationHistory.current.push({
                role: 'user',
                parts: [{ text: userMessage }]
            });
        }

        // Build the request with system instruction and conversation history
        const requestBody = {
            system_instruction: {
                parts: [{ text: buildSystemContext() }]
            },
            contents: conversationHistory.current
        };

        try {
            const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            // Handle rate limit (429) with retry
            if (response.status === 429) {
                if (retryCount < MAX_RETRIES) {
                    const waitTime = BASE_DELAY * Math.pow(2, retryCount);
                    console.log(`Rate limited. Retrying in ${waitTime / 1000}s... (attempt ${retryCount + 1}/${MAX_RETRIES})`);
                    await delay(waitTime);
                    return callGeminiAPI(userMessage, retryCount + 1);
                } else {
                    throw new Error('Rate limit exceeded. Please wait a moment and try again.');
                }
            }

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I couldn\'t generate a response.';

            // Add AI response to history
            conversationHistory.current.push({
                role: 'model',
                parts: [{ text: aiResponse }]
            });

            return aiResponse;
        } catch (error) {
            // Remove the user message from history if we fail completely
            if (retryCount === 0 || retryCount >= MAX_RETRIES) {
                conversationHistory.current.pop();
            }
            throw error;
        }
    };

    // Initialize chat when popup opens
    useEffect(() => {
        if (isOpen && !isReady) {
            // Reset conversation history
            conversationHistory.current = [];

            // Set welcome message
            setMessages([{
                id: 'welcome',
                type: 'assistant',
                content: `Hi! 👋 I'm your travel assistant for **${tripContext.title}**!\n\nI can help you with:\n• Scheduling and timing suggestions\n• Local tips and recommendations\n• Best times to visit attractions\n• Travel logistics and routes\n\nHow can I help with your trip planning?`,
                timestamp: new Date()
            }]);
            setIsReady(true);
        }
    }, [isOpen, isReady, tripContext.title]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input when ready
    useEffect(() => {
        if (isReady && isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isReady, isOpen]);

    const sendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: inputValue.trim(),
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const aiResponse = await callGeminiAPI(userMessage.content);

            setMessages(prev => [...prev, {
                id: Date.now().toString() + '_response',
                type: 'assistant',
                content: aiResponse,
                timestamp: new Date()
            }]);
        } catch (error) {
            console.error('Gemini API error:', error);
            setMessages(prev => [...prev, {
                id: Date.now().toString() + '_error',
                type: 'error',
                content: error.message || 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Chat Popup */}
            <div className="fixed bottom-24 left-6 z-50 animate-in slide-in-from-bottom-5 duration-300">
                <div className="w-[380px] h-[520px] bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold text-sm">Trip Assistant</h3>
                                <p className="text-white/80 text-xs">{tripContext.title}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-200"
                        >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Context Badge */}
                    <div className="px-4 py-2 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
                        <div className="flex items-center gap-2 text-xs text-orange-700">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>
                                {destinations.filter(d => d.scheduledDay !== null).length} scheduled •
                                {destinations.filter(d => d.scheduledDay === null).length} pending
                            </span>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white">
                        {/* Chat Messages */}
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] px-4 py-3 rounded-2xl ${message.type === 'user'
                                        ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-br-md'
                                        : message.type === 'error'
                                            ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-md'
                                            : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-md'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap leading-relaxed">
                                        {message.content}
                                    </p>
                                    {message.duration && (
                                        <p className="text-[10px] opacity-60 mt-1">
                                            Response time: {message.duration}ms
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}

                        {/* Loading indicator */}
                        {isReady && isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-md shadow-sm border border-gray-100">
                                    <div className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-gray-100 bg-white">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 relative">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask about your trip..."
                                    disabled={isLoading}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all duration-200 disabled:opacity-50"
                                />
                            </div>
                            <button
                                onClick={sendMessage}
                                disabled={!inputValue.trim() || isLoading}
                                className="w-11 h-11 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 text-center mt-2">
                            Powered by Gemini • Press Enter to send
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

// Chat Button Component
export function ItineraryChatButton({ onClick }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div className="fixed bottom-6 left-6 z-40">
            {/* Tooltip */}
            <div
                className={`absolute left-full ml-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'
                    }`}
            >
                <div className="relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full">
                        <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-transparent border-r-orange-500" />
                    </div>
                    <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-4 py-2 rounded-xl shadow-lg shadow-orange-500/30 whitespace-nowrap">
                        <span className="text-sm font-semibold">Need help planning?</span>
                    </div>
                </div>
            </div>

            {/* Button */}
            <button
                className="relative group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onClick={onClick}
            >
                {/* Pulse animation */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-amber-400 rounded-full animate-ping opacity-30" />

                {/* Glow on hover */}
                <div
                    className={`absolute inset-0 bg-orange-400 rounded-full blur-xl transition-all duration-500 ${isHovered ? 'opacity-40 scale-150' : 'opacity-0 scale-100'
                        }`}
                />

                {/* Main button */}
                <div className={`relative w-14 h-14 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center shadow-xl shadow-orange-500/30 transition-all duration-300 ${isHovered ? 'scale-110' : 'scale-100'
                    }`}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
            </button>
        </div>
    );
}

export default ItineraryChatPopup;
