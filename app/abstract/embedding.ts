import { Utils } from "../lib/utils.ts";

abstract class Embedding {
  private chunkSize: number;

  constructor(chunkSize: number = 100) {
    this.chunkSize = chunkSize;
  }

  public abstract calculate(contents: string | string[]): Promise<number[][]>;

  public embedDocuments = async (documents: string[]): Promise<number[][]> => {
    const embeddings = await Promise.all(
      Utils.chunkArray(documents, this.chunkSize).map((docs) =>
        this.calculate(docs)
      )
    );
    return embeddings.flatMap((e) => e);
  };

  public embedQuery = async (document: string): Promise<number[]> => {
    const embeddings = await this.calculate(document);
    return embeddings[0] || [];
  };
}

export { Embedding };
