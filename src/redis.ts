import { createSentinel } from "redis";
import { logger } from "./logger";
import { REDIS_MASTER_NAME, REDIS_SENTINEL_NODES_URL } from "./config";

const LOGGER_META = "redis";
const LOG = logger(LOGGER_META);

async function createRedisClient() {
  const resolvedRootNodes = REDIS_SENTINEL_NODES_URL.map((n) => {
    const [host, port] = n.split(":");
    return {
      host: host ?? "",
      port: Number(port ?? ""),
    };
  });

  LOG.debug("Redis sentinel resolved root nodes", { resolvedRootNodes });

  const client = createSentinel({
    name: REDIS_MASTER_NAME,
    sentinelRootNodes: resolvedRootNodes,
    nodeClientOptions: {
      disableOfflineQueue: true,
      socket: {
        reconnectStrategy: 5000,
        timeout: 5000,
        connectTimeout: 5000,
        sessionTimeout: 5000,
      },
    },
    masterPoolSize: 2,
    replicaPoolSize: 2,
  });

  client.setTracer = console.log;

  LOG.debug("Initializing connection to redis");
  await client
    .on("error", (err) => {
      LOG.error("redis client error", err);
    })
    .on("connect", () => LOG.info("Client connecting"))
    .on("reconnecting", () => {
      LOG.warn("redis reconnecting");
    })
    .on("ready", () => {
      LOG.info("Redis client connected");
    })
    .on("end", () => {
      LOG.warn("Redis client ended");
    })
    .on("sharded-channel-moved", () => {
      LOG.warn("Sharded channel moved");
    })
    .on("invalidate", () => {
      LOG.warn("A key was invalidated");
    })
    .connect();

  return client;
}

export const client = createRedisClient();
