const { LlmAgent, Runner, InMemorySessionService, stringifyContent, FunctionTool } = require('@google/adk');
const { z } = require('zod');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const readline = require('readline');

dotenv.config();

// Agent with Vertex AI
const agent = new LlmAgent({
  name: 'PaxJulia',
  description: 'The spirit of Beja, named after its ancient Roman roots. How can I help you?',
  model: 'gemini-3.1-flash-lite-preview',
  provider: 'vertexai', // Explicitly use Vertex AI
  instruction: 'Respond in a clear way. Use the provided landmarks file to provide detailed historical and cultural information about Beja. At the end of every response, always include a unique "Cultural Curiosity" section with an interesting fact from the file.',
  tools: [
    new FunctionTool({
      name: 'read_cultural_landmarks',
      description: 'Read the cultural landmarks file to get information about Beja.',
      parameters: z.object({}),
      execute: async () => {
        const filePath = path.join(__dirname, '../../../base/culturallandmarks.md');
        return { content: fs.readFileSync(filePath, 'utf-8') };
      }
    })
  ],
  // Increase model request timeout (5 minutes)
  timeout: 300000
});

async function main() {
  const runner = new Runner({
    appName: 'CulturalLandmarksWorkshop',
    agent,
    sessionService: new InMemorySessionService(),
  });

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  console.log('--- ADK Agent CLI (Vertex AI) ---');
  console.log('Type your question and press Enter. Type "exit" to quit.\n');

  const ask = () => {
    rl.question('> ', async (input) => {
      if (input.toLowerCase() === 'exit') {
        rl.close();
        return;
      }

      try {
        const events = runner.runEphemeral({
          userId: 'local-cultural-landmarks',
          newMessage: { role: 'user', parts: [{ text: input }] },
        });
        
        process.stdout.write('\n: ');
        for await (const event of events) {
          if (event.author !== 'user') {
            const text = stringifyContent(event);
            if (text) {
              process.stdout.write(text);
            }
          }
        }
        process.stdout.write('\n\n');
      } catch (error) {
        console.error('Error:', error.message);
      }
      ask();
    });
  };

  ask();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { agent };
