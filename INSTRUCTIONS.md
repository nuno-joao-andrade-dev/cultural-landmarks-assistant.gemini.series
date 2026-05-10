# Cultural Landmarks Workshop: ADK Boilerplate Edition

Build a professional AI assistant using the **Google Agent Development Kit (ADK)**.

## Workshop Stages

### Stage 1: The ADK Boilerplate
- Explore `base/agents/run-agent.js`.
- Run `node base/agents/run-agent.js` to chat with the agent in your terminal.
- Learn about `LlmAgent`, `Runner`, and `InMemorySessionService`.

### Stage 2: Integrating the Local Knowledge Base
- Use a **Local Knowledge Base** (`FunctionTool`) with the `base/culturallandmarks.md` file instead of a remote MCP server.
- The agent now provides a "Cultural Curiosity" in each response.

### Stage 3: Professional Web Interface
- Build a React frontend that connects to your ADK backend.
- Stages are located in `steps/step-03/`.

### Stage 4: Session Persistence (IndexedDB)
- Use browser-side IndexedDB to save conversation history.
- Check `steps/step-04/frontend/src/storage.js`.

### Stage 5: Containerization (Docker)
- Prepare your agent for the cloud.
- See the `Dockerfile` in `steps/step-05/`.

### Stage 6: Automated Testing
- Verify your agent logic with Jest.
- Check `steps/step-06/tests/`.

## Key Features
- **Markdown Support**: The agent returns responses in Markdown, and the frontend renders them using `react-markdown`.
- **IndexedDB**: Conversations are saved locally in your browser.
- **Local Knowledge Base**: Powered by `FunctionTool` and `base/culturallandmarks.md`.
- **Vertex AI**: Powered by `gemini-3.1-flash-lite-preview`.

## Running Locally
1. `npm install`
2. Create `.env` from `.env.example`.
3. `npm run dev` for the full Web UI (React + Node).
4. `npm run web` for the built-in ADK Interactive Dev UI (localhost:8000).
5. `npm run agent` for the CLI-only experience.
