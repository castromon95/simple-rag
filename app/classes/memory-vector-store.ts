import { VectorStore } from "../abstract/vector-store.ts";
import { MemoryVectorStore as LangchainMemoryVectorStore } from "langchain/vectorstores/memory";
import { Embedding } from "../abstract/embedding.ts";

import type { DocumentInterface } from "@langchain/core/documents";

class MemoryVectorStore extends VectorStore {
  private vectorStore: LangchainMemoryVectorStore;

  constructor(embedding: Embedding) {
    super();
    this.vectorStore = new LangchainMemoryVectorStore(embedding);
  }

  public async addDocument(path: string): Promise<void> {
    const allSplits = await this.loadAndSplitPDF(path);
    await this.vectorStore.addDocuments(allSplits);
  }

  public async similaritySearch(query: string): Promise<DocumentInterface[]> {
    return this.vectorStore.similaritySearch(query, 1);
  }
}

export { MemoryVectorStore };
