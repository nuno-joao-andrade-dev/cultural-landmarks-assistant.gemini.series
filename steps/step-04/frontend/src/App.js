import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './App.css';
import { saveMessage, getAllMessages, clearHistory } from './storage';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getAllMessages().then(setMessages);
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    await saveMessage(userMsg);
    
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input }),
      });
      const data = await response.json();

      if (response.status === 429) {
        setMessages(prev => [...prev, { role: 'ai', content: "**Too many requests.** The AI model is currently busy. Please wait a few seconds and try again." }]);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || 'Chat failed');
      }

      const aiMsg = { role: 'ai', content: data.response };
      setMessages(prev => [...prev, aiMsg]);
      await saveMessage(aiMsg);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'error', content: 'Chat failed. ' + error.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <header>
        <h1>Cultural Landmarks Workshop</h1>
        <button className="clear-btn" onClick={() => clearHistory().then(() => setMessages([]))}>Clear History</button>
      </header>
      <div className="messages">
        {messages.map((m, i) => (
          <div key={i} className={`msg ${m.role}`}>
            {m.role === 'ai' ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
            ) : (
              m.content
            )}
          </div>
        ))}
        {isLoading && <div className="msg ai">...</div>}
      </div>
      <div className="input-area">
        <input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && sendMessage()} />
        <button onClick={sendMessage} disabled={isLoading}>Send</button>
      </div>
    </div>
  );
};

export default App;
