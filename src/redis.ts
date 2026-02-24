import { createCluster } from "redis";
import { logger } from "./logger";
import { REDIS_CLUSTER_NODES_URL } from "./config";

const LOGGER_META = "redis";
const LOG = logger(LOGGER_META);

async function createRedisClient() {
  const client = createCluster({
    rootNodes: REDIS_CLUSTER_NODES_URL.map((url) => ({ url })),
    useReplicas: true,
    defaults: {
      socket: {
        connectTimeout: 5000,
      },
    },
  });

  LOG.debug("Initializing connection to redis");

  await client
    .on("error", (err) => {
      LOG.error("redis client error", err);
    })
    .on("connect", () => LOG.info("Client connected"))
    .on("disconnect", () => LOG.info("Client disconnected"))
    .on("node-ready", (node) => LOG.info("Node ready", { node }))
    .on("node-connect", (node) => LOG.info("Node connected", { node }))
    .connect();

  return client;
}

export const client = createRedisClient();
