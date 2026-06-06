import axios from "axios";
import { tool } from "langchain";
import * as z from "zod";

export const listFiles = tool(
  async ({}, config) => {
    const response = await axios.get(
      `http://sandbox-service-${config.context.projectId}:3000/list-files`,
    );

    return JSON.stringify(response.data.files);
  },
  {
    name: "list_files",
    description:
      "List all the files on the project directory. This is useful for understanding what files are available to  work with",
    schema: z.object({}),
  },
);

export const readFiles = tool(
  async ({ files: [] }, config) => {
    const response = await axios.get(
      `http://sandbox-service-${config.context.projectId}:3000/read-files` +
        files.join(","),
    );

    return JSON.stringify(response.data);
  },
  {
    name: "read_files",
    description:
      "Read the contents of specified files. This is useful for understanding the content of files that are relevant to the task at hand.",
    schema: z.object({
      files: z
        .array(z.string())
        .nonempty(
          "The list of files absoluute paths to read . These should be files that were listen using the list_files tool or created later",
        ),
    }),
  },
);

export const updateFiles = tool(
  async ({ files }, config) => {
    const response = await axios.post(
      `http://sandbox-service-${config.context.projectId}:3000/update-files`,
      {
        updates: files,
      },
    );
    return JSON.stringify(response.data);
  },
  {
    name: "update_files",
    description:
      "Update the content of specified files. This is useful for modifying existing files based on the requirements of the task. The input should be a list of objects, each containing a 'file' field with the absolute path of the file to update and a 'content' field with the new content for that file. this tool also can use to create new files by providing a new file name in the file field and the content to the added in the content field.",
    schema: z.object({
      files: z
        .array(
          z.object({
            file: z.string().nonempty("File path is required"),
            content: z.string().nonempty("Content is required"),
          }),
        )
        .describe("At least one file update is required"),
    }),
  },
);
