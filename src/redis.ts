import { createClient } from "redis";
import { REDIS_URL } from "./config";
import { logger } from "./logger";

export const client = createClient({ url: REDIS_URL });

const LOGGER_META = "redis";
const LOG = logger(LOGGER_META);

client.on("error", (err) => {
  throw new Error(err);
});

client.on("ready", () => {
  LOG.info("Redis client connected");
});

client.connect();
