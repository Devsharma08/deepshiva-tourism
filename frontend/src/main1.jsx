// src/App.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Configuration
const API_BASE_URL = "http://localhost:5000/api"; 

export default function App1() {
  const [userId, setUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const messagesEndRef = useRef(null);

  // --- 1. IDENTITY MANAGEMENT (Client Side) ---
  useEffect(() => {
    // Check if we have a User ID stored
    let storedId = localStorage.getItem('tourism_app_user_id');
    
    if (!storedId) {
      // Create a random ID (e.g., "550e8400-e29b...")
      storedId = crypto.randomUUID();
      localStorage.setItem('tourism_app_user_id', storedId);
      console.log("Created new User ID:", storedId);
    } else {
      console.log("Found existing User ID:", storedId);
    }
    
    setUserId(storedId);
  }, []);

  // --- 2. LOAD HISTORY ---
  useEffect(() => {
    if (userId) {
      fetchChatHistory(userId);
    }
  }, [userId]);

  const fetchChatHistory = async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/history?userId=${id}`);
      setMessages(response.data);
    } catch (err) {
      console.error("Failed to load history:", err);
      // Don't show error to user immediately, just log it
    }
  };

  // --- 3. SEND MESSAGE ---
  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !userId) return;

    const userText = input;
    setInput(''); // Clear input
    setError(null);

    // Optimistic Update
    setMessages(prev => [...prev, { sender: 'user', text: userText }]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, {
        message: userText,
        userId: userId // Send our persistent ID
      });

      // Handle JSON Plans vs Regular Text
      let botReply = response.data.reply;
      
      // If the bot sends a JSON plan code block, clean it up for display
      if (botReply.includes("```json")) {
         // (Optional) You could parse this here to render a nice UI Card
         // For now, we just strip the markdown to make it readable
         botReply = botReply.replace(/```json|```/g, ''); 
      }

      setMessages(prev => [...prev, { sender: 'bot', text: botReply }]);
      
    } catch (err) {
      console.error("Chat Error:", err);
      setError("Server disconnected. Is the backend running?");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="app-container">
      {/* Styles are included here for single-file convenience */}
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Segoe UI', sans-serif; background-color: #f0f2f5; }
        
        .app-container {
          max-width: 900px;
          margin: 0 auto;
          height: 100vh;
          display: flex;
          flex-direction: column;
          background: #fff;
          box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }

        header {
          padding: 1rem;
          background: #4f46e5;
          color: white;
          font-weight: 600;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .user-badge {
          font-size: 0.75rem;
          background: rgba(255,255,255,0.2);
          padding: 4px 8px;
          border-radius: 4px;
        }

        .chat-window {
          flex: 1;
          overflow-y: auto;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 15px;
          background-color: #f9fafb;
        }

        .message {
          max-width: 80%;
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 0.95rem;
          line-height: 1.5;
          white-space: pre-wrap; /* Preserves formatting */
        }

        .message.user {
          align-self: flex-end;
          background-color: #4f46e5;
          color: white;
          border-bottom-right-radius: 2px;
        }

        .message.bot {
          align-self: flex-start;
          background-color: #e5e7eb;
          color: #1f2937;
          border-bottom-left-radius: 2px;
        }

        .typing-indicator {
          display: flex;
          gap: 5px;
          padding: 10px;
          background: #e5e7eb;
          border-radius: 12px;
          align-self: flex-start;
          width: fit-content;
        }
        .dot { width: 8px; height: 8px; background: #6b7280; border-radius: 50%; animation: bounce 1.4s infinite ease-in-out both; }
        .dot:nth-child(1) { animation-delay: -0.32s; }
        .dot:nth-child(2) { animation-delay: -0.16s; }
        @keyframes bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

        .input-area {
          padding: 20px;
          background: white;
          border-top: 1px solid #e5e7eb;
          display: flex;
          gap: 10px;
        }
        input { flex: 1; padding: 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 1rem; outline: none; }
        input:focus { border-color: #4f46e5; }
        button { padding: 0 25px; background: #4f46e5; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; }
        button:disabled { background: #9ca3af; }
        .error-banner { background: #fee2e2; color: #991b1b; padding: 8px; text-align: center; font-size: 0.9rem; }
      `}</style>

      <header>
        <span>AI Travel Guide</span>
        <span className="user-badge">
          ID: {userId ? userId.slice(0, 8) : '...'}...
        </span>
      </header>

      {error && <div className="error-banner">{error}</div>}

      <div className="chat-window">
        {messages.length === 0 && !isLoading && (
          <div style={{textAlign: 'center', marginTop: '50px', color: '#9ca3af'}}>
            <p>Welcome! I am your personalized guide.</p>
            <p>Tell me what you like, or ask for a plan.</p>
          </div>
        )}

        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
        
        {isLoading && (
          <div className="typing-indicator">
            <div className="dot"></div><div className="dot"></div><div className="dot"></div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className="input-area" onSubmit={handleSend}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about places, plans, or weather..."
          disabled={isLoading}
        />
        <button type="submit" disabled={isLoading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}