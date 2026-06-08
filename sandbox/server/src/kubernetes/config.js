import * as K8sApi from "@kubernetes/client-node";

const kc = new K8sApi.KubeConfig();
kc.loadFromCluster();

const currentCluster = kc.getCurrentCluster();
if (currentCluster) {
  console.log("Current cluster:", currentCluster);
  console.log("Current context:", kc.getCurrentContext());

  if (currentCluster.server?.startsWith("http://") && !currentCluster.skipTLSVerify) {
    console.warn("Cluster server uses HTTP; enabling skipTLSVerify for Kubernetes client.");
    currentCluster.skipTLSVerify = true;
  }
}

export const k8sCoreV1Api = kc.makeApiClient(K8sApi.CoreV1Api);