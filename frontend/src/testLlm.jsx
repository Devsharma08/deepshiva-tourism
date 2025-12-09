import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('');

  const testApi = async () => {
    try {
      setApiStatus('Testing...');
      
      // 1. First explore
      const explore = await axios.get('http://localhost:5000/api/explore');
      console.log('Explore:', explore.data);
      
      // 2. Check docs
      const docs = await axios.get('http://localhost:5000/api/check-docs');
      console.log('Docs:', docs.data);
      
      // 3. Find endpoint
      const find = await axios.post('http://localhost:5000/api/find-endpoint',{});
      console.log('Find:', find.data);
      
      setApiStatus('Tests completed! Check console for results.');
      
    } catch (error) {
      console.error('API test error:', error);
      setApiStatus('Error testing API');
    }
  };

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    const userMessage = message;
    setMessage('');
    setLoading(true);
    
    // Add user message
    setConversation(prev => [...prev, { user: userMessage, bot: '' }]);
    
    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: userMessage
      });
      
      const botReply = response.data.reply;
      
      // Update last message with bot reply
      setConversation(prev => {
        const newConv = [...prev];
        newConv[newConv.length - 1].bot = botReply;
        newConv[newConv.length - 1].type = response.data.type;
        return newConv;
      });
      
    } catch (error) {
      console.error('Error:', error);
      
      setConversation(prev => {
        const newConv = [...prev];
        newConv[newConv.length - 1].bot = 'Error: Could not connect to assistant';
        newConv[newConv.length - 1].type = 'error';
        return newConv;
      });
    } finally {
      setLoading(false);
    }
  };

  const exampleQuestions = [
    "Where is Nainital?",
    "Best beach destinations",
    "Plan Europe trip",
    "Budget travel tips",
    "When to visit Japan"
  ];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>🧳 Travel Assistant</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testApi}
          style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none' }}
        >
          Discover API Endpoints
        </button>
        {apiStatus && <p style={{ fontSize: '14px', color: '#666' }}>{apiStatus}</p>}
      </div>
      
      <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about travel..."
          style={{ width: '100%', padding: '12px', fontSize: '16px' }}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
        />
        
        <button 
          onClick={sendMessage}
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '12px', 
            marginTop: '10px',
            background: loading ? '#ccc' : '#28a745',
            color: 'white',
            border: 'none',
            fontSize: '16px'
          }}
        >
          {loading ? 'Thinking...' : 'Ask Travel Assistant'}
        </button>
        
        <div style={{ marginTop: '20px' }}>
          <p>Try asking:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {exampleQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => {
                  setMessage(q);
                  setTimeout(sendMessage, 100);
                }}
                style={{ 
                  padding: '8px 12px',
                  background: '#e9ecef',
                  border: '1px solid #dee2e6',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: '30px' }}>
        <h3>Conversation:</h3>
        
        {conversation.length === 0 ? (
          <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>
            Start the conversation!
          </p>
        ) : (
          <div>
            {conversation.map((msg, i) => (
              <div key={i} style={{ marginBottom: '20px' }}>
                <div style={{ 
                  background: '#007bff', 
                  color: 'white',
                  padding: '10px',
                  borderRadius: '8px 8px 8px 0',
                  marginBottom: '5px',
                  maxWidth: '80%'
                }}>
                  <strong>You:</strong> {msg.user}
                </div>
                
                {msg.bot && (
                  <div style={{ 
                    background: '#28a745', 
                    color: 'white',
                    padding: '10px',
                    borderRadius: '8px 8px 0 8px',
                    marginLeft: '20%',
                    maxWidth: '80%'
                  }}>
                    <strong>Assistant:</strong> {msg.bot}
                    {msg.type && msg.type !== 'llm' && (
                      <div style={{ fontSize: '12px', opacity: 0.8 }}>
                        ({msg.type})
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div style={{ 
        marginTop: '20px', 
        fontSize: '12px', 
        color: '#666',
        textAlign: 'center'
      }}>
        <p>Backend: http://localhost:5000</p>
        <p>LLM: https://jayceon-crumblier-unmeaningly.ngrok-free.dev</p>
      </div>
    </div>
  );
}

export default App;