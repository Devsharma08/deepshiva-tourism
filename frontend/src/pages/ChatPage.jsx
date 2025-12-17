import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, Sparkles, Trash2, Bot, User, Settings, Mic, MicOff, Loader2, AlertCircle, Mountain } from 'lucide-react';
import { saveMessageToHistory, getChatHistory, clearHistory } from "../utils/ContextManager";
import TrekAnalyzerPopup from '../components/TrekAnalyzerPopup';

const API_BASE = 'http://localhost:5000';

// Streaming chat API call
const fetchStreamingResponse = async (message, options, onChunk, onFollowUps) => {
    const response = await fetch(`${API_BASE}/chat-stream`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message,
            userId: options.userId || 'anonymous',
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 1024
        })
    });

    if (!response.ok) throw new Error('Stream failed');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let fullText = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
            if (line.startsWith('data: ')) {
                const data = line.slice(6);
                if (data === '[END_OF_STREAM]') continue;

                try {
                    const parsed = JSON.parse(data);
                    if (parsed.text) {
                        fullText += parsed.text;
                        onChunk(fullText);
                    }
                    if (parsed.followUps) {
                        onFollowUps(parsed.followUps);
                    }
                } catch (e) {
                    // Skip invalid JSON
                }
            }
        }
    }

    return fullText;
};

// Regular JSON chat API call
const fetchChatResponse = async (message, options) => {
    const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            message,
            userId: options.userId || 'anonymous',
            temperature: options.temperature || 0.7,
            max_tokens: options.maxTokens || 1024,
            location: options.location
        })
    });

    if (!response.ok) throw new Error('Chat failed');
    return response.json();
};

// Fetch quick questions
const fetchQuickQuestions = async () => {
    try {
        const response = await fetch(`${API_BASE}/quick-questions`);
        const data = await response.json();
        return data.questions || [];
    } catch {
        return ["Suggest a trip", "Safety tips", "Local cuisine", "Budget planning"];
    }
};

const ChatPage = ({ activeState }) => {
    const navigate = useNavigate();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [streamingText, setStreamingText] = useState('');
    const [quickQuestions, setQuickQuestions] = useState([]);
    const [showSettings, setShowSettings] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [micError, setMicError] = useState(null);
    const [interimTranscript, setInterimTranscript] = useState('');
    const [settings, setSettings] = useState({
        temperature: 0.7,
        maxTokens: 1024,
        useStreaming: true,
        userId: `user_${Date.now()}`
    });
    const [showTrekAnalyzer, setShowTrekAnalyzer] = useState(false);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const recognitionRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping, streamingText]);

    // Load history and quick questions on mount
    useEffect(() => {
        const init = async () => {
            const [history, questions] = await Promise.all([
                getChatHistory(),
                fetchQuickQuestions()
            ]);

            if (history?.length > 0) setMessages(history);
            if (questions?.length > 0) setQuickQuestions(questions);
        };
        init();
    }, []);

    // Initialize Web Speech API
    useEffect(() => {
        // Check for browser support
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.warn('⚠️ Web Speech API not supported in this browser');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN'; // Indian English
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            console.log('🎤 Speech recognition started');
            setIsListening(true);
            setMicError(null);
            setInterimTranscript('');
        };

        recognition.onresult = (event) => {
            let interim = '';
            let final = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    final += transcript;
                } else {
                    interim += transcript;
                }
            }

            // Show interim results while speaking
            if (interim) {
                setInterimTranscript(interim);
            }

            // When we get final results, add to input
            if (final) {
                setInputMessage(prev => {
                    const newText = prev ? `${prev} ${final}` : final;
                    return newText.trim();
                });
                setInterimTranscript('');
            }
        };

        recognition.onerror = (event) => {
            console.error('❌ Speech recognition error:', event.error);

            switch (event.error) {
                case 'not-allowed':
                    setMicError('Microphone access denied. Please allow microphone permission.');
                    break;
                case 'no-speech':
                    setMicError('No speech detected. Please try again.');
                    break;
                case 'audio-capture':
                    setMicError('No microphone found. Please connect a microphone.');
                    break;
                case 'network':
                    setMicError('Network error. Please check your connection.');
                    break;
                default:
                    setMicError(`Speech error: ${event.error}`);
            }

            setIsListening(false);
            setInterimTranscript('');
        };

        recognition.onend = () => {
            console.log('⏹️ Speech recognition ended');
            setIsListening(false);
            setInterimTranscript('');
        };

        recognitionRef.current = recognition;

        // Cleanup
        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.stop();
                } catch (e) {
                    // Ignore errors on cleanup
                }
            }
        };
    }, []);

    const handleClearHistory = async () => {
        await clearHistory();
        setMessages([]);
    };

    const handleSendMessage = async (message = inputMessage) => {
        if (!message.trim()) return;

        // Stop listening if active
        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
        }

        const userMessage = {
            role: 'user',
            text: message,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsTyping(true);
        setStreamingText('');

        try {
            await saveMessageToHistory('user', message);

            let botResponse;

            if (settings.useStreaming) {
                let followUps = [];
                const finalText = await fetchStreamingResponse(
                    message,
                    settings,
                    (text) => setStreamingText(text),
                    (suggestions) => { followUps = suggestions; }
                );

                botResponse = {
                    role: 'ai',
                    text: finalText,
                    timestamp: new Date().toISOString(),
                    suggestions: followUps
                };
                setStreamingText('');
            } else {
                const responseData = await fetchChatResponse(message, {
                    ...settings,
                    location: activeState
                });

                botResponse = {
                    role: 'ai',
                    text: responseData.reply,
                    timestamp: new Date().toISOString(),
                    suggestions: responseData.suggestions || [],
                    source: responseData.source
                };
            }

            setMessages(prev => [...prev, botResponse]);
            await saveMessageToHistory('ai', botResponse.text);

        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                role: 'ai',
                text: "I'm having trouble connecting. Please try again. 🔄",
                timestamp: new Date().toISOString()
            }]);
        } finally {
            setIsTyping(false);
            setStreamingText('');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Toggle voice recognition
    const toggleListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setMicError('Voice input is not supported in your browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        if (!recognitionRef.current) {
            setMicError('Voice recognition failed to initialize. Please refresh the page.');
            return;
        }

        setMicError(null);

        if (isListening) {
            // Stop listening
            try {
                recognitionRef.current.stop();
                console.log('⏹️ Stopped listening');
            } catch (e) {
                console.error('Error stopping recognition:', e);
            }
        } else {
            // Start listening
            try {
                recognitionRef.current.start();
                console.log('🎤 Started listening');
            } catch (e) {
                console.error('Error starting recognition:', e);
                if (e.message.includes('already started')) {
                    recognitionRef.current.stop();
                    setTimeout(() => {
                        recognitionRef.current.start();
                    }, 100);
                } else {
                    setMicError(`Failed to start: ${e.message}`);
                }
            }
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
                                {settings.useStreaming && <span className="ml-2 text-orange-500">• Streaming</span>}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowTrekAnalyzer(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:shadow-lg hover:shadow-emerald-200 transition-all font-medium text-sm"
                            title="Trek Analyzer"
                        >
                            <Mountain className="w-4 h-4" />
                            <span className="hidden sm:inline">Trek Analyzer</span>
                        </button>
                        <button
                            onClick={() => setShowSettings(!showSettings)}
                            className={`p-2 rounded-lg transition-colors ${showSettings ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
                            title="Settings"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
                        <button onClick={handleClearHistory} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Clear History">
                            <Trash2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Settings Panel */}
                {showSettings && (
                    <div className="max-w-5xl mx-auto px-6 pb-4">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-4">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium text-gray-700">Streaming Mode</label>
                                <button
                                    onClick={() => setSettings(s => ({ ...s, useStreaming: !s.useStreaming }))}
                                    className={`relative w-12 h-6 rounded-full transition-colors ${settings.useStreaming ? 'bg-orange-500' : 'bg-gray-300'}`}
                                >
                                    <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${settings.useStreaming ? 'left-7' : 'left-1'}`} />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Temperature: {settings.temperature}</label>
                                <input
                                    type="range" min="0" max="1" step="0.1"
                                    value={settings.temperature}
                                    onChange={(e) => setSettings(s => ({ ...s, temperature: parseFloat(e.target.value) }))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                                <p className="text-xs text-gray-500">Lower = focused, Higher = creative</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Max Tokens: {settings.maxTokens}</label>
                                <input
                                    type="range" min="256" max="4096" step="256"
                                    value={settings.maxTokens}
                                    onChange={(e) => setSettings(s => ({ ...s, maxTokens: parseInt(e.target.value) }))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Microphone Error Banner */}
            {micError && (
                <div className="bg-red-50 border-b border-red-200 px-4 py-3">
                    <div className="max-w-5xl mx-auto flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-sm text-red-700 flex-1">{micError}</p>
                        <button onClick={() => setMicError(null)} className="text-red-500 hover:text-red-700 text-sm font-medium">Dismiss</button>
                    </div>
                </div>
            )}

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 scroll-smooth">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-80">
                        <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                            <Sparkles className="w-10 h-10 text-orange-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">Hello!</h2>
                        <p className="text-gray-500 max-w-md">I am your AI travel guide powered by Local LLM with Gemini fallback. Ask me anything about India!</p>
                        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                            {quickQuestions.map((q, i) => (
                                <button key={i} onClick={() => handleSendMessage(q)} className="p-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:border-orange-300 hover:bg-orange-50 transition-all text-left">
                                    {q}
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
                                    <div className={`p-4 rounded-2xl shadow-sm ${message.role === 'user' ? 'bg-gray-900 text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'}`}>
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                                        {message.source && <p className="text-xs mt-2 opacity-50">via {message.source}</p>}
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

                        {/* Streaming response */}
                        {isTyping && streamingText && (
                            <div className="flex gap-4 justify-start">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-sm">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="max-w-[80%] bg-white border border-gray-100 text-gray-800 p-4 rounded-2xl rounded-tl-sm shadow-sm">
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{streamingText}<span className="animate-pulse">▊</span></p>
                                </div>
                            </div>
                        )}

                        {/* Enhanced Thinking Indicator */}
                        {isTyping && !streamingText && (
                            <div className="flex gap-4 justify-start">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center shadow-sm animate-pulse">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div className="bg-white border border-gray-100 px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-orange-500 animate-spin" style={{ animationDuration: '3s' }} />
                                            <span className="text-sm font-medium text-gray-700">Treveor is thinking</span>
                                        </div>
                                        <div className="flex gap-1">
                                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce"></div>
                                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                            <div className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                        </div>
                                    </div>
                                    <div className="mt-2 h-1 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full animate-pulse" style={{ width: '60%', animation: 'thinking-progress 2s ease-in-out infinite' }}></div>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">Analyzing your query with local AI...</p>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 p-4 md:p-6 shadow-lg">
                <div className="max-w-5xl mx-auto">
                    {/* Listening indicator with interim results */}
                    {isListening && (
                        <div className="mb-3 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                            <span className="text-red-600 font-medium text-sm">Listening...</span>
                            {interimTranscript && (
                                <span className="text-gray-500 text-sm italic flex-1 truncate">
                                    "{interimTranscript}"
                                </span>
                            )}
                        </div>
                    )}

                    <div className="flex gap-3 items-end">
                        {/* Voice Button */}
                        <button
                            onClick={toggleListening}
                            className={`p-4 rounded-2xl transition-all duration-200 flex-shrink-0 ${isListening
                                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
                                }`}
                            title={isListening ? 'Stop listening' : 'Start voice input'}
                        >
                            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                        </button>

                        <textarea
                            ref={inputRef}
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={isListening ? "Speak now... I'm listening" : "Ask about travel, food, or history..."}
                            className="flex-1 px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 resize-none min-h-[56px] max-h-32 shadow-inner transition-all placeholder-gray-400 text-gray-700"
                            rows="1"
                        />

                        <button
                            onClick={() => handleSendMessage()}
                            disabled={!inputMessage.trim() || isTyping}
                            className="p-4 bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-2xl hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 flex-shrink-0"
                        >
                            {isTyping ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        </button>
                    </div>

                    {/* Voice help text */}
                    <p className="text-xs text-gray-400 text-center mt-2">
                        {isListening
                            ? "Speak clearly. Your words will appear in the text box."
                            : "Click the 🎤 button to speak your question"
                        }
                    </p>
                </div>
            </div>

            {/* Trek Analyzer Popup */}
            <TrekAnalyzerPopup
                isOpen={showTrekAnalyzer}
                onClose={() => setShowTrekAnalyzer(false)}
            />
        </div>
    );
};

export default ChatPage;
