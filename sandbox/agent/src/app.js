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

app.get("/read-file", async (req, res) => {
  if (!file) {
    return res.status(400).json({
      message: "No file specific in query paramters",
      status: "error",
    });
  }

  const fileList = files.split(",");

  const results = await Promise.all(
    fileList.map(async (file) => {
      const filePath = `${WORKING_DIR}/${file}`;

      try {
        const content = await fs.promises.readFile(FilePath, "utf-8");
        return {
          [filePath]: content,
        };
      } catch (err) {
        return {
          [filePath]: `Error reading file: ${err.message}`,
        };
      }
    }),
  );
});

app.patch("/update-files", async (req, res) => {
  const updates = req.body.updates;

  if (!updates || !Array.isArray(updates)) {
    return res.status(400).json({
      message:
        "Invalid request body. 'updates' should be an array of {file, content} objects.",
      status: "error",
    });
  }

  const results = await Promise.all(
    updates.map(async (update) => {
      const { file, content } = update;
      const filePath = `${WORKING_DIR}/${file}`;

      try {
        await fs.promises.writeFile(filePath, content, "utf-8");
        return {
          [filePath]: "File updated successfully",
        };
      } catch (err) {
        return {
          [filePath]: `Error updating file: ${err.message}`,
        };
      }
    }),
  );

  res.status(200).json({
    message: "File update results",
    results,
  });
});

app.post("/create-file", async (req, res) => {
  const files = req.body.files;

  if (!files || !Array.isArray(files)) {
    return res.status(400).json({
      message:
        "Invalid request body. 'files' should be an array of {file, content} objects.",
      status: "error",
    });
  }

  const results = await Promise.all(
    files.map(async (fileObj) => {
      const { file, content } = fileObj;
      const filePath = `${WORKING_DIR}/${file}`;

      try {
        await fs.promises.writeFile(filePath, content, "utf-8");
        return {
          [filePath]: "File created successfully",
        };
      } catch (err) {
        return {
          [filePath]: `Error creating file: ${err.message}`,
        };
      }
    }),
  );
});
export default app;
