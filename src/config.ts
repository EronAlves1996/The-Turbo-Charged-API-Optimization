import * as dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const LOG_LEVEL = process.env.LOG_LEVEL || "info";

const REDIS_URL_NOT_DEFINED_MESSAGE =
  "Required parameter REDIS_URL not defined";

export const REDIS_URL = process.env.REDIS_URL || "";
if (!REDIS_URL) {
  throw new Error(REDIS_URL_NOT_DEFINED_MESSAGE);
}
