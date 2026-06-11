import express from 'express';
import morgan from "morgan"
import { v4 as uuid } from "uuid"
import { createPod } from "./kubernetes/pods.js"
import { createService } from "./kubernetes/service.js"
import { isKubernetesConfigured } from "./kubernetes/config.js"

const app = express()

app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get("/api/sandbox/health", (req, res)=>{
    res.status(200).json({
        message: "Sandbox API is healthy",
        status: "ok"
    })

})

app.get("/api/sandbox/ready", (req, res)=>{
    res.status(200).json({
        message: "Sandbox API is ready",
        status: "ready"
    })
})

app.post("/api/sandbox/start", async (req, res) => {
    if (!isKubernetesConfigured) {
        return res.status(503).json({
            message: "Kubernetes is not configured for sandbox provisioning on this machine.",
            status: "unavailable"
        })
    }

    const sandboxId = uuid()

    try {
        await Promise.all([
            createPod(sandboxId),
            createService(sandboxId)
        ])
    } catch (error) {
        console.error("Error creating Kubernetes resources:", error);
        return res.status(500).json({
            message: "Failed to create sandbox environment",
            status: "error",
            error: error.message || error.toString()
        })
    }

    return res.status(201).json({
        message: "Sandbox environment created successfully",
        sandboxId: sandboxId,
        previewUrl: `http://${sandboxId}.preview.localhost`
    })
})

export default app