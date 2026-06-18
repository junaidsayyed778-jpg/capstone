import express from "express";
import morgan from "morgan";

const app = express();
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Hello from Notification Service!");
});

app.get("/_status/readyz", (req, res) => {
  res.status(200).json({
    status: "ready",
  });
});

app.get("/_status/healthz", (req, res) => {
  res.status(200).json({ status: "ok" });
});

export default app;
