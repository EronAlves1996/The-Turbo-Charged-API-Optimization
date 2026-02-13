import { createClient } from "redis";
import { REDIS_REPLICA_URL, REDIS_URL } from "./config";
import { logger } from "./logger";

const LOGGER_META = "redis";
const LOG = logger(LOGGER_META);

function createRedisClient(url: string) {
  const redisClient = createClient({
    url,
    socket: { reconnectStrategy: 5000 },
    disableOfflineQueue: true,
  });

  redisClient.on("error", (err) => {
    LOG.error("redis client error", { err, url });
  });

  redisClient.on("reconnecting", () => {
    LOG.warn("redis reconnecting", { url });
  });

  redisClient.on("ready", () => {
    LOG.info("Redis client connected", { url });
  });

  redisClient.connect();

  return redisClient;
}

export const client = createRedisClient(REDIS_URL);
export const replicaClient = createRedisClient(REDIS_REPLICA_URL);
