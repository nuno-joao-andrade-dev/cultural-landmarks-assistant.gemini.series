const fs = require('fs');
const path = require('path');

const instructions = JSON.parse(fs.readFileSync('test_instructions.json', 'utf8'));

// Build Step 1 & 2
let agentCode = instructions[0].code;
fs.writeFileSync('test_folder/base/agents/run-agent.js', agentCode);
console.log('Step 1 applied.');

agentCode = instructions[1].code + '\n' + agentCode.substring(agentCode.indexOf('async function main() {'));
fs.writeFileSync('test_folder/base/agents/run-agent.js', agentCode);
console.log('Step 2 applied.');

// Build Step 3
fs.mkdirSync('test_folder/base/backend', { recursive: true });
fs.writeFileSync('test_folder/base/backend/index.js', instructions[2].code);

fs.mkdirSync('test_folder/base/frontend/src', { recursive: true });
fs.writeFileSync('test_folder/base/frontend/src/App.js', instructions[3].code);
fs.writeFileSync('test_folder/base/frontend/src/index.js', instructions[4].code);
fs.writeFileSync('test_folder/base/frontend/src/App.css', instructions[5].code);

// Build Step 4
fs.writeFileSync('test_folder/base/frontend/src/storage.js', instructions[6].code);
// Instruction 7 is a snippet to replace in backend/index.js
let backendCode = fs.readFileSync('test_folder/base/backend/index.js', 'utf8');
backendCode = backendCode.replace(/} catch \(error\) {[\s\S]*?}\n}\);/, "} catch (error) {\n console.error('CRITICAL ERROR with ADK:', error);\n // Detect rate limit errors from the Gemini model\n if (error.message.includes('429') || error.message.toLowerCase().includes('too many requests')) {\n return res.status(429).send({ error: 'The AI model is receiving too many requests. Please wait a moment and try again.' });\n }\n res.status(500).send({ error: 'Failed to process chat: ' + error.message });\n }\n});");
fs.writeFileSync('test_folder/base/backend/index.js', backendCode);

fs.writeFileSync('test_folder/base/frontend/src/App.js', instructions[8].code);

// Build Step 5
backendCode = fs.readFileSync('test_folder/base/backend/index.js', 'utf8');
backendCode += '\n\n' + instructions[9].code;
fs.writeFileSync('test_folder/base/backend/index.js', backendCode);

// Build Step 6
fs.mkdirSync('test_folder/base/tests', { recursive: true });
fs.writeFileSync('test_folder/base/tests/server.test.js', instructions[10].code);

console.log('All code blocks applied.');
