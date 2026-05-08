const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.send({ status: 'Step 0 Server is running!' });
});

// The /api/chat route will be implemented in Step 3.

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log('Follow workshop.md to implement the ADK agent endpoints.');
});

// Increase timeout for long-running LLM requests (5 minutes)
server.timeout = 300000;
server.keepAliveTimeout = 300000;
