# Cultural Landmarks Assistant: Building a Cultural Landmarks Agent with Google ADK

This project is a professional prototype of an AI-powered assistant designed for people interested in Cultural Landmarks to explore the history and culture of landmarks. It leverages the **Google Agent Development Kit (ADK)** to provide real-time, grounded answers directly from historical and cultural data.

---

## Project Overview

The **Cultural Landmarks Assistant** solves the common challenge of "knowledge cutoffs" in traditional LLMs by connecting a high-performance model (**Gemini 3.1 Flash-Lite**) to a historical data source. The system is designed to be lightweight, secure, and fully containerized for cloud deployment.

### Core Value Props:
- **Historical Accuracy**: Every response is informed by historical data retrieved.
- **Privacy-First Persistence**: Conversation history is stored entirely in the user's browser using **IndexedDB**, reducing server-side state and costs.
- **Low Latency**: Powered by `gemini-3.1-flash-lite-preview` for near-instant responses.

---

## Guardrails & Security

To ensure a safe and reliable learning environment, the assistant follows strict architectural guardrails:

- **Read-Only Access**: The agent has read-only access to the knowledge. It cannot modify documentation or perform administrative actions.
- **Client-Side State**: By offloading session history to **IndexedDB**, the backend remains stateless, simplifying scaling on Google Cloud Run.
- **IAM-Based AI Access**: The backend communicates with Vertex AI using standard Application Default Credentials (ADC), ensuring no long-lived API keys are hardcoded in the container.

---

## Technology Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React (v18+) | Interactive Chat UI & Markdown Rendering |
| **Storage** | IndexedDB (`idb` library) | Client-side session persistence |
| **Backend** | Node.js / Express | API Orchestration & Static File Serving |
| **Agent Logic** | Google ADK (`@google/adk`) | Agent definition, tool execution, and session management |
| **LLM** | Gemini 3.1 Flash-Lite | The underlying reasoning engine (Vertex AI) |

| **DevOps** | Docker / Cloud Run | Containerization and serverless hosting |

---

## System Architecture & Agents

### The "Pax Julia" Agent
Named after the ancient Roman title for the city of Beja, the core agent is configured to be a precise, evidence-based cultural specialist using a **Local Knowledge Base**.

**Agent Configuration:**
```javascript
const agent = new LlmAgent({
  name: 'Pax Julia',
  description: 'Expert Cultural Landmarks Assistant',
  model: 'gemini-3.1-flash-lite-preview',
  provider: 'vertexai', 
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
  ]
});
```

### Execution Flow
1. **User Query**: The cultural landmark asks a question like "What is the history of the Eiffel Tower?".
2. **ADK Runner**: The Express backend invokes the `Runner`.
3. **Intelligent Reasoning**: The agent synthesizes the retrieved landmark details into a clear, Markdown-formatted guide.
4. **Streaming Response**: The response is streamed back to the React UI for immediate feedback.

---

## Implementation: Session Persistence

One unique aspect of this project is the use of **IndexedDB** for persistence. Instead of a centralized database (like MongoDB or Firestore), we utilize the browser's native storage to keep the workshop "serverless" and private.

**Storage Logic (`storage.js`):**
```javascript
import { openDB } from 'idb';

export const saveMessage = async (message) => {
 const db = await openDB('gcp_workshop_db', 1);
 return db.add('messages', { ...message, timestamp: Date.now() });
};
```
This approach allows cultural landmarks to refresh their browser or return to the workshop later without losing their progress, all without the instructor needing to manage a database.

---

## Deployment & Operation

The project is designed to be deployed to **Google Cloud Run** using a multi-stage Dockerfile. This ensures that the frontend is built and served statically by the same Node.js process that handles the ADK agent logic.

### Directory Structure:
```text
/
 base/
 agents/ # ADK Agent definitions
 backend/ # Express.js API
 frontend/ # React source code
 tests/ # Jest test suite
 steps/ # Reference code for workshop stages
 Dockerfile # Production build configuration
 README.md # Getting started guide
```

### Deployment Command:
```bash
gcloud run deploy cultural-landmarks-assistant \
 --source . \
 --env-vars-file .env.yaml \
 --allow-unauthenticated
```

---

## Key Takeaways

1. **Grounded Knowledge is King**: Designing a precise persona drastically reduces hallucinations compared to raw LLM prompting.
2. **Flash Models are the Future**: The speed and cost-efficiency of `gemini-3.1-flash-lite` make it perfect for high-frequency interactive tools like documentation assistants.
3. **ADK Simplifies Orchestration**: The Google ADK abstracts away the complexity of tool-calling loops and session management, allowing developers to focus on the persona and the knowledge source.

---

*This project was developed as part of the **Assistant Cultural Landmarks Workshop Series**. For the full source code and step-by-step guide, visit the [GitHub Repository](https://github.com/nuno-joao-andrade-dev/cultural-landmarks-assistant.gemini.series.git).*
