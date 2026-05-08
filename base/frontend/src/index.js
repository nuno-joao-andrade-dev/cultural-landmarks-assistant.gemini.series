import React from 'react';
import { createRoot } from 'react-dom/client';

const App = () => (
  <div style={{ padding: '40px', textAlign: 'center', fontFamily: 'sans-serif' }}>
    <h1>Welcome to the Cultural Landmarks Workshop!</h1>
    <p>This is the ADK Boilerplate (Step 0).</p>
    <p>Follow the instructions in <code>workshop.md</code> to start building your AI Assistant!</p>
  </div>
);

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);
