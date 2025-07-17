import { LLM } from "./llm.ts";
import { VectorStore } from "./vector-store.ts";

abstract class Graph {
  protected llm: LLM;
  protected vectorStore: VectorStore;

  constructor(vectorStore: VectorStore, llm: LLM) {
    this.vectorStore = vectorStore;
    this.llm = llm;
  }

  public abstract invoke(message: string): Promise<string>;
}

export { Graph };
