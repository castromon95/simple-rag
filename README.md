## Goal

Small codebase to showcase a basic Retrieval-Augmented Generation (RAG) implementation with the usage of `langchain`, `gemini` and `GoogleGenAI`. Basic memory vector store usage along with semantic search to enable the context-based conversation with an AI agent that uses tools and history persistance.

## Small demos

- [RAG and AI agent conversation](https://drive.google.com/file/d/14VuUA_qAuBeVZWdNXGH-tnSZoOtfyrG9/view?usp=sharing)

## Run the project locally

First, run the development server:

1. Clone the repo.
2. run `npm i` at the root of the project.
3. Create a `.env` file the root of the directory with the following variables:

```
- LANGSMITH_TRACING=""
- LANGSMITH_API_KEY=""
- GOOGLE_API_KEY=""
```

4. Run `npm run start`
5. Enjoy your conversation with the AI agent.
