import { LLM } from "../abstract/llm.ts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { DynamicStructuredTool } from "langchain/tools";
import { BaseMessageChunk } from "@langchain/core/messages";

import type { BaseLanguageModelInput } from "@langchain/core/language_models/base";

class GoogleLLM extends LLM {
  private llm: ChatGoogleGenerativeAI;

  constructor() {
    super();
    this.llm = new ChatGoogleGenerativeAI({
      model: "gemini-2.0-flash",
      temperature: 0,
    });
  }

  public invokeWithTools(
    prompt: BaseLanguageModelInput,
    tools: DynamicStructuredTool[]
  ): Promise<BaseMessageChunk> {
    const llmWithTools = this.llm.bindTools(tools);
    return llmWithTools.invoke(prompt);
  }

  public invoke(prompt: BaseLanguageModelInput): Promise<BaseMessageChunk> {
    return this.llm.invoke(prompt);
  }
}

export { GoogleLLM };
