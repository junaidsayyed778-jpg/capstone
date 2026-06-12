import Redis from "ioredis";
import deletePod from "../kubernetes/pods.js";
import deleteService from "../kubernetes/service.js";

const redis = new Redis(process.env.REDIS_URL);

const subscriber = new Redis(process.env.REDIS_URL);

export async function createSandboxKey(sandboxId) {
  await redis.set(
    `sandbox:${sandboxId}`,
    JSON.stringify({ status: "active" }),
    "EX",
    120,
  );
}

subscriber
  .config("SET", "notify-keyspace-events", "Ex")
  .then(() => console.log("Redis keyspace notifications enabled"))
  .catch((err) => console.error("CONFIG SET failed:", err));
  
subscriber.subscribe("__keyevent@0__:expired");

subscriber.on("message", async (channel, key) => {
  console.log(`Key expired: ${key}`);

  const sandboxId = key.split(":")[1];

  await deletePod(sandboxId);
  await deleteService(sandboxId);
});

export default { subscriber };
