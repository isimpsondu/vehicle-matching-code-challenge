# Vehicle Matching Challenge

This project implements a vehicle matching system that maps free-text car descriptions to structured vehicle records stored in PostgreSQL.

## 🔍 Problem
Each line in `input.txt` contains a user-provided car description, which may be vague, incomplete, or inconsistent. The goal is to:
- Match each description to a row in the `vehicle` table.
- Output the matching `vehicle.id` and a confidence score (0–10).

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

## 📦 Prerequisites

- Docker Desktop (for macOS/Windows) or Docker Engine with Docker Compose (for Linux)

## ⏳ Run The Setup
```bash
npm run setup
```
This will:
   - Install all dependencies
   - Start PostgreSQL docker instance
   - Run database migrations

## 🚀 Run The App
```bash
npx ts-node src/index.ts
```

## 🧪 Run The Tests
```bash
npm test
```