import dotenv from "dotenv";
dotenv.config();

import { createAgent } from "langchain";
import { ChatMistralAI } from "@langchain/mistralai";

import { listFiles, readfiles, updateFiles } from "./tools.js";

const model = new ChatMistralAI({
  model: "mistral-medium-latest",
  apiKey: process.env.MISTRALAPI_KEY,
});

const agent = createAgent({
  model,
  tools: [listFiles, readfiles, updateFiles],
});

const result = await agent.invoke({
  messages: [
    {
      role: "user",
      content: "update the theme of the project to light",
    },
  ],
});

console.log(result);