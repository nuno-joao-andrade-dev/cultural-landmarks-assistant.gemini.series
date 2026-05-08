const express = require('express');
const path = require('path');
const cors = require('cors');
const dotenv = require('dotenv');
const { Runner, InMemorySessionService, stringifyContent } = require('@google/adk');
const { agent } = require('../agents/run-agent');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Initialize the Runner
const runner = new Runner({
  appName: 'CulturalLandmarksWorkshop',
  agent,
  sessionService: new InMemorySessionService(),
});

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).send({ error: 'Prompt is required' });

    console.log(`Processing prompt: "${prompt}"`);

    const events = runner.runEphemeral({
      userId: 'web-cultural-landmarks',
      newMessage: { role: 'user', parts: [{ text: prompt }] },
    });

    let fullText = "";
    let toolUsed = false;

    for await (const event of events) {
      if (event.author !== 'user') {
        const text = stringifyContent(event);
        if (text) {
          fullText += text;
        }
        if (event.actions && event.actions.requestedToolConfirmations && Object.keys(event.actions.requestedToolConfirmations).length > 0) {
          toolUsed = true;
        }
        // In some ADK versions, tool calls are in result.toolCalls or event.actions
        if (event.toolCalls && event.toolCalls.length > 0) {
          toolUsed = true;
        }
      }
    }

    if (!fullText) {
      console.error('Empty response received from ADK runner');
      fullText = "I processed your request but couldn't generate a text response. Please try rephrasing your question.";
    }

    res.send({ 
      response: fullText,
      contextUsed: toolUsed
    });
  } catch (error) {
    console.error('CRITICAL ERROR with ADK:', error);
    if (error.message.includes('429') || error.message.toLowerCase().includes('too many requests')) {
      return res.status(429).send({ error: 'The AI model is receiving too many requests. Please wait a moment and try again.' });
    }
    res.status(500).send({ error: 'Failed to process chat: ' + error.message });
  }
});

// Serve static build if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// Increase timeout for long-running LLM requests (5 minutes)
server.timeout = 300000;
server.keepAliveTimeout = 300000;
