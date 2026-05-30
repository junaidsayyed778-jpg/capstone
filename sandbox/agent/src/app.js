import express from "express";
import morgan from "morgan";
import fs from "fs";
import path from "path";

const WORKING_DIR = "/workspace";

const app = express();

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.status(200).json({
    message: "Hello from sandbox agent",
    status: "ok",
  });
});

/**
 * @route GET /list-files
 * @description List all files in the working directory and its subdirectories. Returns a JSON object with the file paths relative to the working directory. exclude directories like node_modules, .git , dist etc
 * -eg ,{
 * "files": [
 * "file1.txt",
 * "src/file2.txt",
 * "src/utils/file3.txt"]
 * }
 */
app.get("/list-files", async (req, res) => {
  const listFiles = async (dir, baseDir) => {
    const entries = await fs.promises.readdir(dir, { withFileTypes: true });
    const files = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath);

      if (
        entry.isDirectory() &&
        !["node_modules", ".git", "dist"].includes(entry.name)
      ) {
        // Exclude directories like node_modules, .git, dist etc.
        continue;
      }

      if (entry.isDirectory()) {
        files.push(...(await listFiles(fullPath, baseDir)));
      } else {
        files.push(relativePath);
      }
    }
    return files;
  };

  try {
    const files = await listFiles(WORKING_DIR, WORKING_DIR);
    res.status(200).json({
      message: "Files listed successfully",
      status: "ok",
      files,
    });
  } catch (err) {
    res.status(500).json({
      message: `Error listing files: ${err.message}`,
      status: "error",
    });
  }
});

/**
 * @route GET /read-files
 * @description Reads the content of all files requested in the query parameters "files" and return them as a JSON object with the file paths as keys and their content as values. If a file cannot be read, return an error message for that file instead of its content.
 * -eg , /read-files?files=file1.txt,src/file2.txt
 *
 */
app.get("/read-file", async (req, res) => {
  const files = req.query.files;
  if (!files) {
    return res.status(400).json({
      message: "No file(s) specified in query parameters",
      status: "error",
    });
  }

  const fileList = files.split(",");

  const results = await Promise.all(
    fileList.map(async (file) => {
      const filePath = path.join(WORKING_DIR, file);
      try {
        const content = await fs.promises.readFile(filePath, "utf-8");
        return {
          [filePath.replace(WORKING_DIR, "")]: content,
        };
      } catch (err) {
        return {
          [filePath.replace(WORKING_DIR, "")]:
            `Error reading file: ${err.message}`,
        };
      }
    }),
  );

  res.status(200).json({
    message: "File(s) read results",
    results,
  });
});

/**
 * @route PATCH /update-files
 * @description Updates the content of files specified in the request body. The request body should be a JSON object with an "updates" field, which is an array of objects containing "file" and "content" fields. The "file" field specifies the path to the file relative to the working directory, and the "content" field contains the new content for that file. The endpoint should return a JSON object with the status of each file update, indicating whether it was successful or if there was an error.
 */
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

app.post("/create-files", async (req, res) => {
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
        await fs.promises.mkdir(path.dirname(filePath), { recursive: true });

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

  res.status(200).json({
    message: "File creation results",
    results,
  });
});
export default app;
