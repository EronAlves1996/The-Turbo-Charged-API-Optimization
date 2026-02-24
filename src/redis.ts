import { createCluster } from "redis";
import { logger } from "./logger";
import { REDIS_CLUSTER_NODES_URL } from "./config";

const LOGGER_META = "redis";
const LOG = logger(LOGGER_META);

async function createRedisClient() {
  const client = createCluster({
    rootNodes: REDIS_CLUSTER_NODES_URL.map((url) => ({ url })),
  });

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
