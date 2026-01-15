# 🚀 Challenge: The "Turbo-Charged" API Optimization

![Level 1](https://img.shields.io/badge/Level-1-blue) ![Level 13](https://img.shields.io/badge/Level-13-success) ![Days](https://img.shields.io/badge/Duration-13%20Days-green) ![Timebox](https://img.shields.io/badge/Timebox-2h%2FDay-orange)

## 📖 Introduction

Welcome, candidate! You have been hired by **SlowCorp™**. Their primary public API (`/api/v1/planets`) is incredibly slow because it fetches data from a legacy legacy database that takes 2-5 seconds to respond to _every_ request.

Your mission, should you choose to accept it, is to build a **Caching Layer** (Middleware) that sits in front of this legacy API. Your goal is to reduce response times to milliseconds while ensuring data consistency and availability.

## 🎯 The Objective

Build a backend application (in Node.js, Python, Go, or Java) that acts as a gateway. It must proxy requests to a slow "dummy" legacy service you will create, optimizing performance using **Redis** and **HTTP Caching** strategies.

## 📅 Rules of Engagement

1.  **Timebox:** You have strictly **2 hours per day**.
2.  **Duration:** The challenge spans **13 Days**.
3.  **Incremental Build:** Do not try to finish it in one sitting. Complete one level per day.
4.  **Dependencies:** You must use Redis (Docker is fine).
5.  **Integrity:** You must implement the caching logic yourself. Do not use "magic" library caching wrappers (like `express-redis-cache`) until you have built the logic manually first.

---

## 🕹️ Game Levels

Your journey is divided into 13 levels. Each level unlocks a new requirement or optimization technique.

### 🌱 Phase 1: The Foundation (Days 1-5)

_Focus: Basic Server-Side Caching with Redis_

#### Day 1: The Legacy Simulation

**[Level 1: The Bottleneck]**
Create a simple web server. Inside this server, create an endpoint `/planets/:id` that simulates a slow database call (use `setTimeout` to delay the response by 3 seconds). Return a JSON object like `{ "id": 1, "name": "Tatooine", "climate": "Arid" }`.

- **Goal:** Verify the endpoint takes >3s to respond.

#### Day 2: First Contact (Redis)

**[Level 2: Key-Value Store]**
Install and run Redis locally. Connect your application to Redis. Modify the `/planets/:id` endpoint.

- When a request comes in:
  1.  Check if data exists in Redis.
  2.  If **Yes**: Return data immediately.
  3.  If **No**: Fetch from the "Legacy" (3s wait), save the result to Redis, and return it.
- **Goal:** Subsequent requests should take <10ms.

#### Day 3: Time is Relative (TTL)

**[Level 3: Expiration]**
Modify your `SET` command in Redis. Add a Time-To-Live (TTL) of 60 seconds.

- Verify that after 60 seconds, the data expires and the next request hits the "Legacy" again (taking 3s).
- **Goal:** Ensure data doesn't live forever in the cache.

#### Day 4: The Cache Aside Pattern

**[Level 4: Robust Logic]**
Refactor your code to strictly follow the **Cache-Aside (Lazy Loading)** pattern.

- Handle connection errors to Redis gracefully. If Redis is down, the app should still work (it will just be slow).
- **Goal:** Application resilience (Degrade gracefully).

#### Day 5: Handling Updates (Write-Through)

**[Level 5: Mutations]**
Create a `POST /planets` endpoint to add new data.

- Implement the **Write-Through** strategy: When data is posted to the API, write it to your "Database" (in-memory array for this exercise) _and_ update the Redis cache immediately.
- **Goal:** The cache should never be stale after a write.

---

### ⚡ Phase 2: The Protocol Layer (Days 6-7)

_Focus: HTTP Caching Headers_

#### Day 6: Browser Basics

**[Level 6: Cache-Control]**
Modify your response headers. Add `Cache-Control: public, max-age=60`.

- Use `curl` or a browser to verify that the client does not hit your server for 60 seconds after the first request.
- **Goal:** Offload traffic to the client (Browser/Proxy).

#### Day 7: Validation & Conditional Requests

**[Level 7: ETag & 304]**
Implement **ETag** (Entity Tag) caching.

- Generate an ETag (e.g., an MD5 hash of the JSON response).
- If a client sends a `If-None-Match` header with a matching ETag, your API must return a `304 Not Modified` status code with an empty body.
- **Goal:** Save bandwidth and processing power on re-requests.

---

### 🚀 Phase 3: Advanced Engineering (Days 8-11)

_Focus: Advanced Redis Data Structures & Operations_

#### Day 8: Complex Objects (Hashes)

**[Level 8: Redis Hashes]**
Stop storing JSON strings. Use Redis **HASHES** (`HSET`, `HGET`) to store the planet fields (`name`, `climate`, `terrain`) individually.

- This allows you to update just the climate later without re-writing the whole object.
- **Goal:** efficient memory usage and partial updates.

#### Day 9: Query Lists (Sets/Sorted Sets)

**[Level 9: Searching]**
Create an endpoint `GET /planets` that returns a list of all planets.

- Use a Redis **SET** to store the IDs of all available planets.
- Use a pipeline to fetch all details for those IDs.
- **Goal:** Efficiently handle collections of data.

#### Day 10: Serialization & Compression

**[Level 10: Optimization]**
Large JSON payloads consume memory. Before caching a large object (simulate a "Description" field with 5000 words of text), compress the data (e.g., using GZIP or Snappy) and store the compressed binary string in Redis.

- **Goal:** Demonstrate memory optimization skills.

#### Day 11: Cache Invalidation Strategy

**[Level 11: Active Invalidation]**
Implement a "System Update" button or endpoint `POST /system/update-climate`.

- This should loop through all keys in Redis and update the `climate` field for _every_ planet (simulating a season change).
- **Goal:** Understanding bulk operations and performance costs of invalidation.

---

### 🏆 Phase 4: The Final Boss (Days 12-13)

_Focus: Reliability, Metrics, and Polish_

#### Day 12: Metrics & Observability

**[Level 12: The Dashboard]**
Create an endpoint `GET /stats` that returns:

- `total_requests`
- `cache_hits`
- `cache_misses`
- `hit_ratio` (percentage)
- You must track these using a Redis Counter (`INCR`).
- **Goal:** Prove your caching is working effectively (Aim for >90% hit ratio).

#### Day 13: Rate Limiting & Security

**[Level 13: The Shield]**
The API is under attack! Implement a **Rate Limiter** using Redis.

- Allow a maximum of 10 requests per minute per IP address.
- If a user exceeds this, return `429 Too Many Requests`.
- **Goal:** Protect the backend from abuse using a sliding window counter in Redis.

---

## 🛠️ Getting Started

1.  **Fork** this repository.
2.  **Clone** it to your local machine.
3.  **Install Redis:**
    ```bash
    docker run -d -p 6379:6379 redis
    ```
4.  **Start Coding:** Open Day 1 and begin!

## 📤 Submission

Once you have completed all 13 levels:

1.  Create a branch named `final-submission`.
2.  Push your code.
3.  Create a Pull Request.
4.  In the PR description, include a screenshot of your `/stats` endpoint showing a high Hit Ratio.

## 🧙‍♂️ Hints (Use wisely!)

- **Stuck on Level 2?** Check the [Redis Commands](https://redis.io/commands) documentation for `GET` and `SET`.
- **Stuck on Level 7?** Read the MDN guide on [HTTP Caching](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching).
- **Stuck on Level 13?** Research "Redis Rate Limiting Sliding Window".

## 🏅 Success Criteria

- ✅ All 13 endpoints are functional.
- ✅ Code is clean and commented.
- ✅ The application does not crash if Redis is stopped.
- ✅ Hit Ratio is > 90% under load.

**Good luck, Engineered! Make SlowCorp fast.** 🚀
