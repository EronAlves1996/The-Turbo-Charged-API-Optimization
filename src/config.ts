import * as dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const LOG_LEVEL = process.env.LOG_LEVEL || "info";

const REDIS_SENTINEL_NODES_URL_NOT_DEFINED_MESSAGE =
  "Required parameter REDIS_SENTINEL_NODES_URL not defined";

const redisSentinelNodesUnparsed = process.env.REDIS_SENTINEL_NODES_URL || "";
if (!redisSentinelNodesUnparsed) {
  throw new Error(REDIS_SENTINEL_NODES_URL_NOT_DEFINED_MESSAGE);
}
const redisClusterNodesUnparsed = process.env.REDIS_CLUSTER_NODES_URL;
const REDIS_CLUSTER_NODES_URL_NOT_DEFINED_MESSAGE =
  "Required parameter REDIS_CLUSTER_NODES_URL not defined";

if (!redisClusterNodesUnparsed) {
  throw new Error(REDIS_CLUSTER_NODES_URL_NOT_DEFINED_MESSAGE);
}

export const REDIS_SENTINEL_NODES_URL = redisSentinelNodesUnparsed.split(";");
export const REDIS_CLUSTER_NODES_URL = redisClusterNodesUnparsed.split(";");

export const REDIS_MASTER_NAME = process.env.REDIS_MASTER_NAME || "";
export const REDIS_NODES_HOST = process.env.REDIS_NODES_HOST || "";

if (LOG_LEVEL === "debug") {
  console.log("Initialized config succesfully!");
  console.log({
    PORT,
    LOG_LEVEL,
    REDIS_SENTINEL_NODES_URL,
    REDIS_MASTER_NAME,
    REDIS_NODES_HOST,
    REDIS_CLUSTER_NODES_URL,
  });
}
