import { BaseMessageChunk } from "@langchain/core/messages";
import { DynamicStructuredTool } from "langchain/tools";

import type { BaseLanguageModelInput } from "@langchain/core/language_models/base";

abstract class LLM {
  public abstract invokeWithTools(
    prompt: BaseLanguageModelInput,
    tools: DynamicStructuredTool[]
  ): Promise<BaseMessageChunk>;

  public abstract invoke(
    prompt: BaseLanguageModelInput
  ): Promise<BaseMessageChunk>;
}

export { LLM };
