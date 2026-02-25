import { RequestHandler } from "express";
import { client } from "./redis";
import { createHash } from "crypto";
import { logger } from "./logger";

const CACHE_CONTROL_HEADER = "Cache-Control";
const PUBLIC_CACHE_CONTROL_VALUE = "public";
const MAX_AGE_ONE_MINUTE = "max-age=60";

const IF_NONE_MATCH_HEADER = "If-None-Match";

const ETAG_HEADER = "ETag";
const EMPTY_STRING = "";
const SHA256_HASH_ALGORITHM = "sha256";
const BASE64_ENCODING = "base64";

const LOG = logger("http-caching");

function getCacheEtagKey(value: string) {
  return `etag:${value}`;
}

export const httpRecoverCacheMiddleware: RequestHandler = async (
  req,
  res,
  next,
) => {
  res.setHeader(CACHE_CONTROL_HEADER, [
    PUBLIC_CACHE_CONTROL_VALUE,
    MAX_AGE_ONE_MINUTE,
  ]);

  const cacheEtag = req.header(IF_NONE_MATCH_HEADER);

  if (!cacheEtag) {
    await next();
    return;
  }

  const redisClient = await client;

  const key = getCacheEtagKey(cacheEtag);
  const exists = await redisClient.exists(key);
  LOG.debug("Received response from redis", {
    key,
    exists,
  });

  if (exists !== 0) {
    res.status(304).send();
    return;
  }

  next();
};

export const httpStoreCacheMiddleware: RequestHandler = async (
  _,
  res,
  next,
) => {
  const originalSend = res.send;
  const redisClient = await client;

  res.send = (content) => {
    if (content && res.statusCode === 200) {
      LOG.debug("Proceeding to cache the response", { content });

      const hasher = createHash(SHA256_HASH_ALGORITHM);
      hasher.update(JSON.stringify(content));
      const etag = hasher.digest(BASE64_ENCODING);

      redisClient.set(getCacheEtagKey(etag), "exists");

      res.setHeader(ETAG_HEADER, etag);
    }

    return originalSend.call(res, content);
  };

  next();
};
