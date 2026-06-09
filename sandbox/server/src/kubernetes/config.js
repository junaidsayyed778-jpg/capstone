import * as K8sApi from "@kubernetes/client-node";

let kc = new K8sApi.KubeConfig();
let isKubernetesConfigured = false;

try {
  kc.loadFromCluster();

  const currentCluster = kc.getCurrentCluster();
  if (!currentCluster?.server || currentCluster.server.includes("undefined")) {
    throw new Error("Invalid in-cluster Kubernetes configuration");
  }

  console.log("Current cluster:", currentCluster);
  console.log("Current context:", kc.getCurrentContext());

  if (currentCluster.server.startsWith("http://") && !currentCluster.skipTLSVerify) {
    console.warn("Cluster server uses HTTP; enabling skipTLSVerify for Kubernetes client.");
    currentCluster.skipTLSVerify = true;
  }

  isKubernetesConfigured = true;
} catch (clusterError) {
  kc = new K8sApi.KubeConfig();

  try {
    kc.loadFromDefault();
    isKubernetesConfigured = true;
    console.log("Loaded Kubernetes config from local kubeconfig.");
  } catch (defaultError) {
    console.warn("Kubernetes config unavailable for sandbox provisioning.");
    console.warn(defaultError.message);
  }
}

export { isKubernetesConfigured };
export const k8sCoreV1Api = isKubernetesConfigured ? kc.makeApiClient(K8sApi.CoreV1Api) : null;