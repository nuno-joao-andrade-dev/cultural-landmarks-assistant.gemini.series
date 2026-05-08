const request = require('supertest');
const express = require('express');

// Mock ADK
jest.mock('@google/adk', () => ({
  LlmAgent: jest.fn().mockImplementation(() => ({
    createSession: jest.fn().mockReturnValue({
      chat: jest.fn().mockResolvedValue({ content: "This is a mocked answer from ADK" })
    })
  }))
}));

const app = express();
app.use(express.json());

// Simplified version of the chat route for testing
app.post('/api/chat', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).send({ error: 'Prompt is required' });
  
  const { LlmAgent } = require('@google/adk');
  const agent = new LlmAgent({});
  const session = agent.createSession();
  const response = await session.chat(prompt);

  res.send({ response: response.content });
});

describe('Chat API (ADK Boilerplate Test)', () => {
  test('POST /api/chat should return a response from ADK mock', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({ prompt: 'Test question' });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('response');
    expect(response.body.response).toBe('This is a mocked answer from ADK');
  });

  test('POST /api/chat should return 400 if prompt missing', async () => {
    const response = await request(app)
      .post('/api/chat')
      .send({});
    
    expect(response.status).toBe(400);
  });
});
