import { k8sCoreV1Api } from "./config.js";

// 1. Added `projectId` to the function parameters
export async function createPod(sandboxId, projectId) {
  const podManifest = {
    // 2. Added required apiVersion and kind for the Kubernetes API
    apiVersion: "v1",
    kind: "Pod",
    metadata: {
      name: `sandbox-${sandboxId}`,
      labels: {
        app: "sandbox",
        sandboxId: sandboxId,
      },
    },
    spec: {
      volumes: [
        {
          name: "workspace-volume",
          emptyDir: {},
        },
      ],
      initContainers: [
        {
          name: "init-container",
          image: "template",
          imagePullPolicy: "IfNotPresent",
          command: ["sh", "-c", "cp -r /workspace/. /seed/"],
          volumeMounts: [
            {
              name: "workspace-volume",
              mountPath: "/seed",
            },
          ],
        },
      ],
      containers: [
        {
          image: "template",
          imagePullPolicy: "IfNotPresent",
          name: "sandbox-container",
          ports: [
            {
              containerPort: 5173,
            },
          ],
          resources: {
            limits: { cpu: "500m", memory: "512Mi" },
            requests: { cpu: "250m", memory: "128Mi" },
          },
          volumeMounts: [
            {
              name: "workspace-volume",
              mountPath: "/workspace",
            },
          ],
          // 3. Cleaned up the env array and ensured PROJECT_ID is a string
          env: [
            {
              name: "PROJECT_ID",
              value: String(projectId), // Kubernetes requires env values to be strings
            },
            {
              name: "AWS_ACCESS_KEY_ID",
              valueFrom: {
                secretKeyRef: {
                  name: "aws",
                  key: "AWS_ACCESS_KEY_ID",
                },
              },
            },
            {
              name: "AWS_SECRET_ACCESS_KEY",
              valueFrom: {
                secretKeyRef: {
                  name: "aws",
                  key: "AWS_SECRET_ACCESS_KEY",
                },
              },
            },
            {
              name: "AWS_REGION",
              valueFrom: {
                secretKeyRef: {
                  name: "aws",
                  key: "AWS_REGION",
                },
              },
            },
          ],
        },
        {
          image: "agent",
          imagePullPolicy: "IfNotPresent",
          name: "agent-container",
          ports: [
            {
              containerPort: 3000,
              name: "http",
            },
          ],
          resources: {
            limits: { cpu: "500m", memory: "512Mi" },
            requests: { cpu: "250m", memory: "128Mi" },
          },
          volumeMounts: [
            {
              name: "workspace-volume",
              mountPath: "/workspace",
            },
          ],
        },
      ],
    },
  };

  const response = await k8sCoreV1Api.createNamespacedPod({
    namespace: "default",
    body: podManifest,
  });

  return response;
}

export async function deletePod(sandboxId) {
  const response = await k8sCoreV1Api.deleteNamespacedPod(
    {
      namespace: "default",
      name: `sandbox-${sandboxId}`,
    },
    {
      gracePeriodSeconds: 0,
    },
  );
  return response;
}