import express from "express";
import morgan from "morgan";
import agentRouter from "./routes/agentRoutes.js"

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.get("/api/status/health", (req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use("/api/ai", agentRouter)

export default app;
