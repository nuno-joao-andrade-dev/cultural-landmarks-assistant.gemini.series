const request = require('supertest');
const express = require('express');

// Create a mock factory function outside to avoid scope issues
const mockRunEphemeral = function() {
  return (async function* () {
    yield { author: 'ai', content: { parts: [{ text: "This is a mocked answer from ADK" }] } };
  })();
};

// Mock ADK
jest.mock('@google/adk', () => ({
  Runner: jest.fn().mockImplementation(() => ({
    runEphemeral: mockRunEphemeral
  })),
  InMemorySessionService: jest.fn(),
  stringifyContent: (event) => event.content.parts[0].text
}));

const app = express();
app.use(express.json());

// Simplified version of your chat route
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).send({ error: 'Prompt is required' });
  
  const { Runner, stringifyContent } = require('@google/adk');
  const runner = new Runner({});
  const events = runner.runEphemeral({});
  
  let text = "";
  for await (const event of events) { text += stringifyContent(event); }

  res.send({ response: text });
});

describe('Chat API (ADK Test)', () => {
  test('POST /api/chat returns a response from ADK mock', async () => {
    const response = await request(app).post('/api/chat').send({ prompt: 'Test' });
    expect(response.status).toBe(200);
    expect(response.body.response).toBe('This is a mocked answer from ADK');
  });
});
