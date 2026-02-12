# 🚀 Challenge: The "Turbo-Charged" API Optimization – **Updated Roadmap Edition**

![Level 1](https://img.shields.io/badge/Level-1-blue) ![Level 9](https://img.shields.io/badge/Level-9-success) ![Days](https://img.shields.io/badge/Duration-9%20Days-green) ![Timebox](https://img.shields.io/badge/Timebox-2h%2FDay-orange)

## ✅ Status: Days 1–2 Complete!

You have successfully built the foundation:

- **Day 1** – Legacy simulation (3s delay)
- **Day 2** – First contact with Redis (`GET`/`SET` caching)

Your API now caches individual planet requests in Redis. **Great work!**

Now it’s time to **level up**. The next 7 days are designed to align with your **backend caching roadmap**. Each day you will **study one authoritative resource** and **implement its key concepts** into your project. By the end, you will have a production‑ready, highly scalable, and observable caching layer.

---

# 🕹️ The Next 7 Levels – Advanced Caching Mastery

| Day | Resource                                                                                                                                  | Core Topic                         |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- |
| 3   | [Redis Replication – Official Docs](https://redis.io/docs/latest/operate/oss_and_stack/management/replication)                            | Read scaling, high availability    |
| 4   | [Redis Sentinel – Official Docs](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel)                                  | Automatic failover, resilience     |
| 5   | [Redis Cluster – Official Docs](https://redis.io/docs/latest/operate/oss_and_stack/management/scaling)                                    | Horizontal scaling, sharding       |
| 6   | [MDN Web Docs: HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)                                            | Cache headers, ETag, 304           |
| 7   | [Request Metrics: HTTP Caching Headers Guide](https://requestmetrics.com/web-performance/http-caching)                                    | Practical recipes, cache‑busting   |
| 8   | [Varnish Software: HTTP Caching Basics](https://www.varnish-software.com/developers/tutorials/http-caching-basics)                        | Shared caches, CDN simulation      |
| 9   | [Dev.to: 5 Caching Patterns Every Developer Should Know](https://dev.to/the_infinity/5-caching-patterns-every-developer-should-know-2p9b) | Write‑Through, Write‑Back, metrics |

---

## 🌟 Day 3 – Redis Replication

**Resource:** [Redis Replication](https://redis.io/docs/latest/operate/oss_and_stack/management/replication)  
**Level 3: The Replica**

### Task

1. **Read** the official Redis replication documentation (focus on master‑replica setup, partial resynchronization, and configuration).
2. **Set up** a Redis master and a Redis replica using Docker.
   ```bash
   docker run -d --name redis-master -p 6379:6379 redis
   docker run -d --name redis-replica -p 6380:6379 --link redis-master redis redis-server --replicaof redis-master 6379
   ```
3. **Modify** your application to use **read‑only commands** (e.g., `GET`) on the replica and write commands (`SET`, `DEL`) on the master.
4. **Add a TTL** of 60 seconds to every cache entry (use `SETEX` or `EXPIRE`).
5. **Implement resilience**: if **both** Redis instances are unreachable, your app should still work by falling back to the legacy database (Cache‑Aside pattern with graceful degradation).

### ✅ Goal

- `GET /planets/:id` reads from the replica when possible.
- `POST /planets` writes to the master.
- After 60 seconds, the key expires and the next request hits the legacy endpoint.
- If all Redis nodes are down, the app still serves requests (slowly).

### 💡 Hint

- Use a Redis client that supports **separate connections** for master and replica (e.g., `ioredis` with `redis-master` and `redis-replica` instances).
- Test replication by stopping the master – the replica should still serve stale data (your app may still read from it).

---

## 🛡️ Day 4 – Redis Sentinel

**Resource:** [Redis Sentinel](https://redis.io/docs/latest/operate/oss_and_stack/management/sentinel)  
**Level 4: Sentinel Uprising**

### Task

1. **Read** the Sentinel documentation – understand quorum, failover flow, and how clients should connect.
2. **Extend** your Docker setup:
   - One master, one replica (from Day 3).
   - **Three Sentinel** containers monitoring the master.
3. **Configure** your application to connect **via Sentinel** (your Redis client must support Sentinel).
4. **Demonstrate automatic failover**:
   - Stop the Redis master container.
   - Verify that Sentinel promotes the replica to master.
   - Your app should automatically reconnect to the new master with **zero code changes**.
5. **Fallback to legacy** – if all Sentinels are unreachable or no master is available, your app falls back to the legacy database.

### ✅ Goal

- No hardcoded master IP – the app discovers the current master via Sentinel.
- After a master failure, writes succeed again within seconds.
- Cache reads continue from the (promoted) replica.

### 💡 Hint

- Use a client with built‑in Sentinel support (e.g., `ioredis` with `SentinelConnector`, `redis-py` with `RedisSentinel`).
- Example `docker-compose.yml` for Sentinel is widely available – adapt one to your project.

---

## 📈 Day 5 – Redis Cluster

**Resource:** [Redis Cluster](https://redis.io/docs/latest/operate/oss_and_stack/management/scaling)  
**Level 5: Sharding the Galaxy**

### Task

1. **Read** the Redis Cluster documentation – focus on **hash slots**, resharding, and cluster‑aware clients.
2. **Create a Redis Cluster** locally with **3 masters and 3 replicas** using Docker.
   ```bash
   # Create 6 Redis nodes, then use redis-cli --cluster create ...
   ```
3. **Refactor** your application to use a **cluster‑aware Redis client**.
4. **Ensure cache keys are distributed** across nodes – you can verify by inspecting the cluster slots.
5. **Use hash tags** if you need to store related keys (e.g., planet `{planet}:1` and `{planet}:1:reviews`) on the same node.
6. **Handle cluster redirects** transparently (most clients do this automatically).

### ✅ Goal

- Your app works with a Redis Cluster without any `MOVED` errors.
- You can explain how the key `planet:1` maps to a specific hash slot.
- The cluster remains available if one master fails (replica takes over).

### 💡 Hint

- Start from the [official cluster tutorial](https://redis.io/docs/latest/operate/oss_and_stack/management/scaling/#create-a-redis-cluster).
- For Node.js, use `ioredis` which supports Cluster natively.
- For Python, `redis-py-cluster` (or the new `redis` library with `RedisCluster`).

---

## 🌐 Day 6 – HTTP Caching (MDN Deep Dive)

**Resource:** [MDN HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching)  
**Level 6: Cache‑Control Master**

### Task

1. **Read** the MDN guide thoroughly – especially `Cache-Control`, `ETag`, `Last-Modified`, and conditional requests.
2. **Add HTTP cache headers** to your `GET /planets/:id` response:
   - `Cache-Control: public, max-age=60`
   - `ETag: <hash-of-response>`
3. **Implement conditional GET**:
   - If the client sends `If-None-Match` with a matching ETag, respond with `304 Not Modified` and **no body**.
4. **Test** with `curl` – verify that subsequent requests within 60 seconds are served from the browser cache (or return 304).

### ✅ Goal

- The first request is slow (3s), but subsequent requests are instant (browser cache) or very fast (304).
- You understand the difference between `max-age=0`, `no-cache`, and `no-store`.

### 💡 Hint

- Generate an ETag using `crypto.createHash('md5').update(JSON.stringify(data)).digest('hex')`.
- Use `curl -I` and `curl -H 'If-None-Match: ...'` to test.

---

## 🔧 Day 7 – HTTP Caching Recipes

**Resource:** [Request Metrics: HTTP Caching Headers Guide](https://requestmetrics.com/web-performance/http-caching)  
**Level 7: Recipe for Speed**

### Task

1. **Read** the Request Metrics guide – pay special attention to the **recipes** for different resource types and common pitfalls.
2. **Apply two recipes** to your API:
   - **Cache‑busting**: for static assets (if you have any) or simulate it by adding a version query parameter (`?v=1`).
   - **Vary header**: if your API supports content negotiation (e.g., `Accept-Encoding` or a custom header like `Accept-Language`), add `Vary: Accept-Encoding` or similar.
3. **Handle `no-cache` and `must-revalidate`** – add an endpoint `/planets/:id?fresh=true` that forces a cache revalidation.

### ✅ Goal

- Your API gracefully supports cache‑busting (new version → new ETag).
- The `Vary` header prevents wrong cache entries when client capabilities differ.
- You can explain why `no-cache` does **not** mean “don’t cache”.

### 💡 Hint

- Add a simple static file (`/public/planet.css`) and serve it with `Cache-Control: max-age=31536000, immutable` and a cache‑buster (`/public/planet.css?v=2`).
- Use `Vary: Accept-Encoding` if you gzip responses.

---

## 🧪 Day 8 – Shared Caching (CDN Simulation)

**Resource:** [Varnish HTTP Caching Basics](https://www.varnish-software.com/developers/tutorials/http-caching-basics)  
**Level 8: Proxy Power**

### Task

1. **Read** the Varnish tutorial – understand shared caches, `s-maxage`, and how CDNs work.
2. **Set up a reverse proxy cache** in front of your application. You can use:
   - **nginx** with `proxy_cache` (simpler), or
   - **Varnish** in Docker (more authentic).
3. **Configure your API** to send `Cache-Control: s-maxage=30, max-age=0` for the `/planets/:id` endpoint.
4. **Verify** that the proxy cache serves repeated requests without hitting your app, and that the `s-maxage` TTL is respected.
5. **Add the `Vary: Accept-Encoding` header** (if not already) and confirm the proxy handles it correctly.

### ✅ Goal

- The proxy cache reduces load on your application.
- You understand the difference between `max-age` (browser) and `s-maxage` (shared cache).
- The proxy respects cache invalidation (after TTL expires, the next request goes to origin).

### 💡 Hint

- nginx example:
  ```nginx
  proxy_cache_path /tmp/cache levels=1:2 keys_zone=my_cache:10m;
  server {
      location / {
          proxy_cache my_cache;
          proxy_cache_valid 200 30s;
          proxy_pass http://localhost:3000;
      }
  }
  ```
- Use `docker-compose` to run nginx alongside your app.

---

## 🧠 Day 9 – Caching Patterns & Observability

**Resource:** [Dev.to: 5 Caching Patterns Every Developer Should Know](https://dev.to/the_infinity/5-caching-patterns-every-developer-should-know-2p9b)  
**Level 9: The Grand Architect**

### Task

1. **Read** the Dev.to article – grasp the trade‑offs of **Write‑Through, Write‑Back, Read‑Through, Write‑Around, and Cache‑Aside**.
2. **Implement Write‑Through** for your `POST /planets` endpoint:
   - When a new planet is created, **immediately** write it to both the “database” (in‑memory array) and the Redis cache.
3. **Choose one additional pattern** and implement it:
   - **Write‑Back** for a batch update endpoint (e.g., `POST /planets/batch` – accept a list of planets, update the database asynchronously, and acknowledge immediately).
   - **Read‑Through** – encapsulate cache logic in a separate service/repository (your app should be unaware of the cache).
4. **Add cache metrics** using Redis counters:
   - Track `cache_hits`, `cache_misses` via `INCR`.
   - Expose a `/stats` endpoint that returns `hit_ratio`.

### ✅ Goal

- Your POST endpoint updates the cache atomically with the database.
- The new pattern is correctly implemented and you can explain its pros/cons.
- `/stats` shows a hit ratio > 90% after a few requests.

### 💡 Hint

- For Write‑Back: accept the batch request, store it in a Redis list (e.g., `RPUSH update_queue ...`), and have a background worker process the list.
- For metrics: use `INCR cache:hits` and `INCR cache:misses` in your cache middleware.

---

# 📤 Submission & Success Criteria (Updated)

1. **Create a branch** `final-submission` from your current work (which includes Days 1–2).
2. **Push** all code for Days 3–9.
3. **Open a Pull Request** with:
   - A link to the **resources** you read (one per day).
   - A screenshot of your `/stats` endpoint showing a hit ratio > 90% (Day 9).
   - A brief summary of what you learned from each day.

### ✅ Success Checklist

- [ ] All 9 days implemented and functional.
- [ ] Code is clean, commented, and includes error handling.
- [ ] Redis replication, Sentinel, and Cluster setups are documented (Docker Compose files or scripts).
- [ ] HTTP caching headers work as expected (tested with `curl`).
- [ ] The proxy cache (Day 8) correctly caches responses.
- [ ] Hit ratio > 90% under moderate load.

---

# 🎓 What You’ve Achieved

By completing this 9‑day gauntlet, you have:

- **Mastered Redis** from basic caching to production‑grade replication, high availability, and clustering.
- **Internalised HTTP caching** – from headers to shared caches.
- **Applied advanced caching patterns** and built observability into your system.

You are now ready to design and optimise caching layers for **any backend system**. SlowCorp™ is no longer slow – you made it **Turbo‑Charged**! 🚀

---

**Now go forth and cache wisely!**
