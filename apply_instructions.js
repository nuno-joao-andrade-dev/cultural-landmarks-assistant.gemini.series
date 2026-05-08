const fs = require('fs');
const path = require('path');

const instructions = JSON.parse(fs.readFileSync('test_instructions.json', 'utf8'));

// Special handling to map files correctly into test_folder/base
// The file path in the JSON is like "agents/run-agent.js" which means "test_folder/base/agents/run-agent.js"

for (const mod of instructions) {
  const filePath = path.join('test_folder/base', mod.file);
  const code = mod.code;
  
  // Make sure directory exists
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  // For backend/index.js, there are multiple code blocks. 
  // Let's just do naive concatenation for now, but be careful with repeated imports.
  // Actually, the easiest way is to overwrite for the first one, and append for the others.
  // We need to see if the file exists.
  
  if (filePath.endsWith('tests/server.test.js') && mod.code.includes('supertest')) {
     fs.writeFileSync('test_folder/base/tests/server.test.js', code);
  }
}

