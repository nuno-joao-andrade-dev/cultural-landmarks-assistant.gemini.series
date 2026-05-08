const { LlmAgent, Runner, InMemorySessionService, stringifyContent } = require('@google/adk');
const dotenv = require('dotenv');
const readline = require('readline');

dotenv.config();

// Step 1: Basic Agent Configuration
const agent = new LlmAgent({
  name: 'PaxJulia',
  description: 'The spirit of Beja, named after its ancient Roman roots. How can I help you?',
  model: 'gemini-3.1-flash-lite-preview',
  provider: 'vertexai',
  timeout: 300000,
  instruction: 'Respond in a clear way.'
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

  console.log('--- ADK Agent CLI ---');
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