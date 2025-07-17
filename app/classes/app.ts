import { GoogleEmbedding } from "./google-embedding.ts";
import { GoogleLLM } from "./google-llm.ts";
import { KnowledgeBaseGraph } from "./knowledge-base-graph.ts";
import { MemoryVectorStore } from "./memory-vector-store.ts";
import { Utils } from "../lib/utils.ts";

class App {
  private static FINISH: string = "goodbye";

  private graph: KnowledgeBaseGraph;
  private llm: GoogleLLM;
  private embedding: GoogleEmbedding;
  private vectorStore: MemoryVectorStore;

  constructor() {
    this.llm = new GoogleLLM();
    this.embedding = new GoogleEmbedding();
    this.vectorStore = new MemoryVectorStore(this.embedding);
    this.graph = new KnowledgeBaseGraph(this.vectorStore, this.llm);
  }

  public async start(): Promise<void> {
    console.log("Welcome to a simple RAG implementation.");
    console.log(
      `Please type '${App.FINISH}' at any point to finish the conversation.`
    );
    const input = await Utils.askForUserInput(
      "Please enter the path to the knowledge base PDF: "
    );
    console.log("Thank you. Lets get started\n\n");

    await this.vectorStore.addDocument(input);

    while (true) {
      const message = await Utils.askForUserInput();

      if (message === App.FINISH) {
        break;
      }

      const response = await this.graph.invoke(message);

      console.log(`\nAI: ${response}\n`);
    }

    console.log("\n\nGoodbye! Hope to see you soon. ");
  }
}

export { App };
