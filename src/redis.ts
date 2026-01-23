import { createClient } from "redis";
import { REDIS_URL } from "./config";

export const client = createClient({ url: REDIS_URL });

client.on("error", (err) => {
  throw new Error(err);
});

client.connect();
