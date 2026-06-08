import * as K8sApi from '@kubernetes/client-node';
const kc = new K8sApi.KubeConfig();
kc.loadFromDefault();
const cluster = kc.getCurrentCluster();
const context = kc.getCurrentContext();
console.log('context=' + context);
console.log('server=' + (cluster ? cluster.server : 'none'));
console.log('skipTLSVerify=' + (cluster ? cluster.skipTLSVerify : 'none'));
console.log('insecureSkipTlsVerify=' + (cluster ? cluster.insecureSkipTlsVerify : 'none'));