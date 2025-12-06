import React, { useState, useEffect } from "react";
import { buildContextAwarePrompt, saveMessageToHistory, getChatHistory, clearHistory } from "../utils/ContextManager";

// Mock API Call (Replace with your actual Gemini/OpenAI call)
const fetchAIResponse = async (fullPrompt) => {
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // In a real app, you POST 'fullPrompt' to your API here
      resolve("Ah, an adventurer! Since you're a vegetarian interested in history, you absolutely must visit the ancient stepwells... (This is a mock AI response)");
    }, 1000);
  });
};

const ChatPage = ({ activeState }) => { // activeState comes from your Map click
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Load history on mount
  useEffect(() => {
    setMessages(getChatHistory());
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. UI: Show User Message immediately
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    saveMessageToHistory("user", input);
    setInput("");
    setLoading(true);

    try {
      // 2. I -> J: Build the Context-Aware Prompt
      // This injects History + User Prefs + Current Map State into the query
      const intelligentPrompt = buildContextAwarePrompt(input, activeState);
      
      console.log("SENDING TO AI:", intelligentPrompt); // Debugging: See what the AI actually sees

      // 3. L: Call AI Model
      const aiText = await fetchAIResponse(intelligentPrompt);

      // 4. Update UI with AI Response
      const aiMsg = { role: "ai", text: aiText };
      setMessages((prev) => [...prev, aiMsg]);
      saveMessageToHistory("ai", aiText);

    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold font-serif text-amber-800">Travel Companion</h1>
        <button onClick={() => { clearHistory(); setMessages([]); }} className="text-sm text-red-500">
          Clear Memory
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3 p-2">
        {messages.map((msg, i) => (
          <div key={i} className={`p-3 rounded-lg max-w-[80%] ${msg.role === 'user' ? 'bg-blue-100 self-end ml-auto' : 'bg-white shadow-sm border border-amber-100'}`}>
            <p className="text-sm text-gray-800">{msg.text}</p>
          </div>
        ))}
        {loading && <div className="text-gray-400 text-sm italic">Consulting the maps...</div>}
      </div>

      {/* Input Area */}
      <div className="flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:border-amber-500"
          placeholder="Ask me anything..."
        />
        <button onClick={handleSend} className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatPage;