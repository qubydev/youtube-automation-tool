import dotenv from "dotenv";
dotenv.config();

import { StateGraph, START, END, MemorySaver } from "@langchain/langgraph";
import { ChatOpenAI } from "@langchain/openai";
import * as z from "zod";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

const model = new ChatOpenAI({
    apiKey: process.env.LLM_API_KEY,
    model: process.env.LLM_MODEL_NAME,
    configuration: {
        baseURL: "https://api.longcat.chat/openai"
    },
});


const outputSchema = z.object({
    continuation: z.string().describe("The newly written continuation of the script"),
    continuation_summary: z.string().describe("A brief summary of the newly written continuation"),
    completed: z.boolean().describe("Whether this is the last step in the script writing process and is somewhat close to the total word limit"),
});
const modelWithStructuredOutput = model.withStructuredOutput(outputSchema);

const State = z.object({
    topic: z.string(),
    max_words: z.number().min(10).max(40000),
    word_count: z.number().min(0),
    word_remaining: z.number(),
    script: z.string(),
    summary: z.string(),
    completed: z.boolean(),
});

async function llmCall(state) {
    const response = await modelWithStructuredOutput.invoke([
        new SystemMessage(`You are a YouTube script continuation agent.

Your task is to generate the next part of an ongoing YouTube script based on the given topic, current word count, maximum word limit, and summary of what has been written so far.

Guidelines:
- If it's the beginning of the script, create an engaging hook to capture viewers' attention.
- **CRITICAL**: Strictly adhere to the maximum word limit. NEVER exceed it.
- Write ONLY the number of words remaining (or fewer). If only n words remain, write AT MOST n words.
- Calculate: Words Remaining = Max Words - Current Word Count. Your continuation MUST be ≤ Words Remaining.
- When the new continuation is word count is very close or equal to the remaining words count, mark the script as completed.
- Try to generate as much content as possible within the remaining word limit.
- When approaching the limit, start wrapping up naturally.

Please respond with the below JSON schema:
{
  "continuation": "The newly written continuation of the script",
  "continuation_summary": "A brief summary of the newly written continuation",
  "completed": "Whether this is the last step in the script writing process and is somewhat close to the total word limit"
}
`),
        new HumanMessage(`Please write me the next part of a YouTube script based on the data given below.
Topic: ${state.topic}
Current Word Count: ${state.word_count}
Maximum Word Limit: ${state.max_words}
**Words Remaining: ${state.word_remaining}** (DO NOT EXCEED THIS!)
Summary of Written Content So Far: ${state.summary}`)
    ]);

    // console.log("[MODEL]:", JSON.stringify(response, null, 2));

    const newWords = response.continuation.split(/\s+/).length;

    const newState = {
        topic: state.topic,
        max_words: state.max_words,
        word_count: state.word_count + newWords,
        word_remaining: state.max_words - (state.word_count + newWords),
        script: state.script + response.continuation + " ",
        summary: state.summary + response.continuation_summary + " ",
        completed: response.completed,
    };

    console.log(`Generating... (max_words: ${state.max_words}, word_count: ${newState.word_count}, word_remaining: ${newState.word_remaining}, completed: ${newState.completed})`);

    // console.log("old state:", state);
    // console.log("new state:", newState);

    return newState;
}


async function shouldContinue(state) {
    if (state.completed) {
        return END;
    } else {
        return "llmCall";
    }
}


const agent = new StateGraph(State)
    .addNode("llmCall", llmCall)
    .addEdge(START, "llmCall")
    .addConditionalEdges("llmCall", shouldContinue, { "llmCall": "llmCall", [END]: END })
    .compile();

export const startAgent = async (topic, maxWords) => {
    const response = await agent.invoke({
        topic: topic,
        max_words: maxWords,
        word_count: 0,
        word_remaining: maxWords,
        script: "",
        summary: "",
        completed: false,
    });

    console.log("Finished!");
    return response;
};