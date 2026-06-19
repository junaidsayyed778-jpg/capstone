import express from "express";
import { v4 as uuid } from "uuid";
import { createPod } from "../kubernetes/pods.js";
import { createService } from "../kubernetes/service.js";
import { isKubernetesConfigured } from "../kubernetes/config.js";
import { createSandboxKey } from "../config/redis.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import Project from "../models/projectModel.js";

const router = express.Router();

router.get("/ready", (req, res) => {
  res.status(200).json({
    status: "ready"
  });
});

router.get("/health", (req, res) => {
  res.status(200).json({
    message: "Sandbox API is healthy",
    status: "ok",
  });
});

router.post("/project", authMiddleware, async (req, res) => {
  const { title } = req.body;

  const newProject = new Project({
    user: req.user.id,
    title,
  });

  await newProject.save();

  return res.status(201).json({
    message: "Project created successfully",
    project: newProject,
  });
});

router.post("/start", authMiddleware, async (req, res) => {
  if (!isKubernetesConfigured) {
    return res.status(503).json({
      message:
        "Kubernetes is not configured for sandbox provisioning on this machine.",
      status: "unavailable",
    });
  }

  const projectId = req.body.projectId;

  const project = await Project.findOne({
    _id: projectId,
    user: req.user.id,
  });

  if (!project) {
    return res.status(404).json({
      message: "Project not found or access denied",
    });
  }

  const sandboxId = uuid();

  try {
    await Promise.all([
      createPod(sandboxId),
      createService(sandboxId),
      createSandboxKey(sandboxId),
    ]);
  } catch (error) {
    console.error("Error creating Kubernetes resources:", error);

    return res.status(500).json({
      message: "Failed to create sandbox environment",
      status: "error",
      error: error.message || error.toString(),
    });
  }

  return res.status(201).json({
    message: "Sandbox environment created successfully",
    sandboxId,
    previewUrl: `http://${sandboxId}.preview.localhost`,
  });
});

router.get("/projects", authMiddleware, async (req, res) => {
  const projects = await Project.find({
    user: req.user.id,
  });

  return res.status(200).json({
    message: "Projects retrieved successfully",
    projects,
  });
});

export default router;