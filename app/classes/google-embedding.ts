import { GoogleGenAI } from "@google/genai";
import { Embedding } from "../abstract/embedding.ts";

class GoogleEmbedding extends Embedding {
  private googleGenAI: GoogleGenAI;

  constructor() {
    super();
    this.googleGenAI = new GoogleGenAI({});
  }

  public calculate = async (
    contents: string | string[]
  ): Promise<number[][]> => {
    const response = await this.googleGenAI.models.embedContent({
      model: "gemini-embedding-001",
      contents,
    });

    return (
      response.embeddings?.map((embedding) => embedding.values || []) || []
    );
  };
}

export { GoogleEmbedding };
