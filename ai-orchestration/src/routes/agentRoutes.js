import { Router } from "express";
import agent from "../agents/codeAgent.js"

const agentRouter = Router();

agentRouter.post("/invoke", (req, res) => {
    try {
        const { messages} = req.body
        const response = await agent.invoke({ messages: [{
            role: "user",
            content: message
        }] })
        res.json({ response })
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})
export default agentRouter;
