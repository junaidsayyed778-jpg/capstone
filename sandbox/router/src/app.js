import express from "express";
import morgan from "morgan";
import http from "http";
import { createProxyMiddleware } from "http-proxy-middleware";
import { createProxyServer } from "httpxy";
import { refreshTTL } from "./config/redis.js";

const app = express();

app.use(morgan("combined"));

app.get("/api/status/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api/status/ready", (req, res) => {
  res.status(200).json({ status: "ready" });
});

const proxies = {};
const agentProxies = {};

function getProxy(sandboxId) {
  const target = `http://sandbox-service-${sandboxId}`;

  if (!proxies[sandboxId]) {
    proxies[sandboxId] = createProxyMiddleware({
      target,
      changeOrigin: true,
      ws: true,
    });
  }

  return proxies[sandboxId];
}

function getAgentProxy(sandboxId) {
  const target = `http://sandbox-service-${sandboxId}:3000`;

  if (!agentProxies[sandboxId]) {
    agentProxies[sandboxId] = createProxyMiddleware({
      target,
      changeOrigin: true,
      ws: true,
    });
  }

  return agentProxies[sandboxId];
}

const wsProxy = createProxyServer({ changeOrigin: true });
wsProxy.on("error", (err, req, socket) => {
  console.error("ws proxy error: ", err.message);
  socket?.destroy();
});

app.use(async (req, res, next) => {
  const host = req.headers.host;
  const parts = host.split(".");
  const sandboxId = parts[0];

  await refreshTTL(sandboxId);
  if (parts[1] === "agent") {
    return getAgentProxy(sandboxId)(req, res, next);
  }

  if (parts[1] === "preview") {
    return getProxy(sandboxId)(req, res, next);
  }

  return res.status(404).json({
    error: "Invalid subdomain",
  });
});

const server = http.createServer(app);

server.on("upgrade", (req, socket, head) => {
  const host = req.headers.host;
  if (!host) {
    socket.destroy();
    return;
  }

  // Prevent EPIPE and connection-reset errors from crashing the process
  // during the active piped session (after ws() Promise has resolved)
  socket.on("error", () => socket.destroy());

  const sandboxId = host.split(".")[0];
  const type = host.split(".")[1];

  console.log(
    `WS upgrade request: ${host}, sandboxId: ${sandboxId}, type: ${type}`,
  );

  if (type === "agent") {
    wsProxy
      .ws(
        req,
        socket,
        { target: `http://sandbox-service-${sandboxId}:3000` },
        head,
      )
      .catch(() => socket.destroy());
  } else if (type === "preview") {
    wsProxy
      .ws(req, socket, { target: `http://sandbox-service-${sandboxId}` }, head)
      .catch(() => socket.destroy());
  } else {
    socket.destroy();
  }
});
export default app;
