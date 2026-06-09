import { Router } from "express";
import agent from "../agents/codeAgent.js"

const agentRouter = Router();
agentRouter.post("/invoke", async (req, res) => {
  try {
    const { messages, message, projectId } = req.body;
    const userMessage = messages ?? message;

    const response = await agent.invoke(
      {
        messages: [
          {
            role: "user",
            content: userMessage,
          },
        ],
      },
      {
        context: {
          projectId,
        },
      }
    );

    const reply =
      response?.content ??
      response?.output ??
      response?.messages?.at?.(-1)?.content ??
      response?.messages?.at?.(-1)?.text ??
      response;

    res.json({ reply, response });
  } catch (error) {
    console.error("Error invoking agent:", error);
    res.status(500).json({ error: error.message });
  }
});
export default agentRouter;
