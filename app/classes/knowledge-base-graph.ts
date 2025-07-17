import { Graph } from "../abstract/graph.ts";
import { DynamicStructuredTool, tool } from "@langchain/core/tools";
import { VectorStore } from "../abstract/vector-store.ts";
import {
  BinaryOperatorAggregate,
  CompiledStateGraph,
  MemorySaver,
  MessagesAnnotation,
  StateGraph,
} from "@langchain/langgraph";
import { ToolNode, toolsCondition } from "@langchain/langgraph/prebuilt";
import {
  AIMessage,
  BaseMessage,
  HumanMessage,
  SystemMessage,
  ToolMessage,
} from "@langchain/core/messages";
import z from "zod";
import { LLM } from "../abstract/llm.ts";
import { Utils } from "../lib/utils.ts";

import type { Messages, StateType, UpdateType } from "@langchain/langgraph";

class KnowledgeBaseGraph extends Graph {
  private graph: CompiledStateGraph<
    StateType<{ messages: BinaryOperatorAggregate<BaseMessage[], Messages> }>,
    UpdateType<{ messages: BinaryOperatorAggregate<BaseMessage[], Messages> }>,
    "__start__" | "queryOrRespond" | "tools" | "generate"
  >;
  private retrieve: DynamicStructuredTool;
  private threadConfig = {
    configurable: { thread_id: Utils.generateRandomAlphaNumeric(8) },
    streamMode: "values" as const,
  };

  constructor(vectorStore: VectorStore, llm: LLM) {
    super(vectorStore, llm);

    this.retrieve = tool(this.toolCall, {
      name: "retrieve",
      description: "Retrieve information related to a query.",
      schema: z.object({ query: z.string() }),
      responseFormat: "content_and_artifact",
    });

    this.graph = new StateGraph(MessagesAnnotation)
      .addNode("queryOrRespond", this.queryOrRespond)
      .addNode("tools", new ToolNode([this.retrieve]))
      .addNode("generate", this.generate)
      .addEdge("__start__", "queryOrRespond")
      .addConditionalEdges("queryOrRespond", toolsCondition, {
        __end__: "__end__",
        tools: "tools",
      })
      .addEdge("tools", "generate")
      .addEdge("generate", "__end__")
      .compile({ checkpointer: new MemorySaver() });
  }

  public async invoke(message: string): Promise<string> {
    const result = await this.graph.invoke(
      { messages: [new HumanMessage(message)] },
      this.threadConfig
    );
    return result.messages[result.messages.length - 1].content;
  }

  // Step 1: Generate an AIMessage that may include a tool-call to be sent.
  private queryOrRespond = async (state: typeof MessagesAnnotation.State) => {
    const response = await this.llm.invokeWithTools(state.messages, [
      this.retrieve,
    ]);
    return { messages: [response] }; // MessagesState appends messages to state instead of overwriting
  };

  // Step 3: Generate a response using the retrieved content.
  private generate = async (state: typeof MessagesAnnotation.State) => {
    // Get generated ToolMessages
    let recentToolMessages: ToolMessage[] = [];
    for (let i = state["messages"].length - 1; i >= 0; i--) {
      let message = state["messages"][i];
      if (message instanceof ToolMessage) {
        recentToolMessages.push(message);
      } else {
        break;
      }
    }
    let toolMessages = recentToolMessages.reverse();

    // Format into prompt
    const docsContent = toolMessages.map((doc) => doc.content).join("\n");
    const systemMessageContent =
      "You are an assistant for question-answering tasks. " +
      "Use the following pieces of retrieved context to answer " +
      "the question. If you don't know the answer, say that you " +
      "don't know. Use three sentences maximum and keep the " +
      "answer concise." +
      "\n\n" +
      `${docsContent}`;

    const conversationMessages = state.messages.filter(
      (message) =>
        message instanceof HumanMessage ||
        message instanceof SystemMessage ||
        (message instanceof AIMessage && message.tool_calls?.length == 0)
    );
    const prompt = [
      new SystemMessage(systemMessageContent),
      ...conversationMessages,
    ];

    // Run
    const response = await this.llm.invoke(prompt);
    return { messages: [response] };
  };

  private toolCall = async ({ query }) => {
    const retrievedDocs = await this.vectorStore.similaritySearch(query);
    const serialized = retrievedDocs
      .map(
        (doc) => `Source: ${doc.metadata.source}\nContent: ${doc.pageContent}`
      )
      .join("\n");
    return [serialized, retrievedDocs];
  };
}

export { KnowledgeBaseGraph };
