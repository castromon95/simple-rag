import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

import type { DocumentInterface } from "@langchain/core/documents";

abstract class VectorStore {
  public abstract addDocument(path: string): Promise<void>;

  public abstract similaritySearch(query: string): Promise<DocumentInterface[]>;

  protected loadAndSplitPDF = async (path: string): Promise<Document[]> => {
    const loader = new PDFLoader(path);
    const docs = await loader.load();
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    return await splitter.splitDocuments(docs);
  };
}

export { VectorStore };
