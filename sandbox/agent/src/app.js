import express from "express";
import morgan from "morgan";
import fs from "fs";

const WORKING_DIR = "/workspace";

const app = express();

app.use(morgan("dev"));

app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Hello from sandbox agent",
    status: "ok",
  });
});

app.get("/list-files", async (req, res) => {
  const element = await fs.promises.readdir(WORKING_DIR, {
    withFileTypes: true,
  });
  res.status(200).json({
    message: "Element in working directory",
    files: element,
  });
});
export default app;
