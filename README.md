# Vehicle Matching Challenge

This project implements a vehicle matching system that maps free-text car descriptions to structured vehicle records stored in PostgreSQL.

## 🔍 Problem
Each line in `input.txt` contains a user-provided car description, which may be vague, incomplete, or inconsistent. The goal is to:
- Match each description to a row in the `vehicle` table.
- Output the matching `vehicle.id` and a confidence score (0–10).
- If multiple vehicles share the same best match score, the vehicle with the most listings in the `listing` table is returned.

## ✅ Current Solution: Plain-Text to Plain-Text Fuzzy Matching
Instead of parsing the input into structured fields (`make`, `model`, `badge`, etc.), we:

1. Normalize each vehicle in the DB into a flat string:
   ```
   "Toyota Camry Ascent Automatic Hybrid-Petrol Front Wheel Drive"
   ```
2. Normalize each input line the same way.
3. Use `string-similarity` to compute a fuzzy similarity score.
4. Scale the score into a confidence value (0–10).

## 🆚 Alternative: Field-Based Matching
Parse each line into attributes using regexes or NLP, then compare each field to the database:
```ts
{
  make: 'Toyota',
  model: 'Camry',
  badge: 'Ascent',
  transmissionType: 'Automatic',
  fuelType: 'Hybrid-Petrol',
  driveType: 'Front Wheel Drive'
}
```

### 🚧 Trade-offs
| Factor                        | Field-Based                  | Plain-Text Matching ✅     |
|------------------------------|------------------------------|----------------------------|
| Robust to typos              | ❌ Fragile                   | ✅ Very good               |
| Handles vague input          | ❌ Often fails               | ✅ Graceful degradation     |
| Requires complex parsing     | ✅ Yes                       | ❌ No                      |
| Scoring clarity              | ✅ Per-attribute             | ⚠️ Approximate              |
| Faster to implement          | ❌ Slow                      | ✅ Very fast                |

### 🚀 Future Improvements for Scale
To support large-scale datasets efficiently, the following improvements can be considered:

#### 1. Fuzzy Matching in SQL with Trigram Indexes
Use PostgreSQL's `pg_trgm` extension to compute similarity scores directly in the database. This allows efficient fuzzy text matching at scale, especially when combined with GIN indexes.

#### 2. Pre-filtering with Heuristics
Extract partial structure such as `make` and `model` from input text, and use them to limit candidate rows in SQL before performing fuzzy matching in memory.

#### 3. In-Memory Caching
Preload and normalize all vehicle records at application start. Store them in memory or a fast-access store (like Redis) to avoid repeated DB reads and allow fast, repeated fuzzy comparisons.

#### 4. Materialized Views for Listing Stats
Use materialized views to pre-aggregate listing counts for each vehicle, improving JOIN and ranking performance without recalculating on every query.

## 📦 Prerequisites

- Node.js (v23.7.0 or higher)
- Docker Desktop (for macOS/Windows) or Docker Engine with Docker Compose (for Linux)

## 📁 Project Structure

  ```folder
  .
  ├── scripts/
  │   ├── data.sql               # Data source
  │   ├── setup.sh               # Environment and data setup
  │   ├── node_setup.sh          # Node.js environment setup
  ├── src/
  │   ├── index.ts               # CLI-based main runner
  │   ├── repository/            # Repository layer
  │   │   ├── db.ts              # PostgreSQL pool
  │   │   ├── dto.ts             # DTO interface
  │   │   ├── retry.ts           # Retry utility
  │   │   ├── retry.test.ts      # Unit tests
  │   │   ├── vehicle.ts         # Vehicle repository
  │   │   ├── vehicle.test.ts    # Unit tests
  │   ├── services/              # Service layer
  │   │   ├── util.ts            # Text utility
  │   │   ├── util.test.ts       # Unit tests
  │   │   ├── vehicle.ts         # Vehicle service
  │   │   ├── vehicle.test.ts    # Unit tests
  ```

## ⏳ Run The Setup
```bash
npm run setup
```
This will:
  - Set up Node.js environment
  - Install all dependencies
  - Start PostgreSQL docker container
  - Run database migrations

## 🚀 Run The App
```bash
npx ts-node src/index.ts
```

## 🧪 Run The Tests
```bash
npm test
```