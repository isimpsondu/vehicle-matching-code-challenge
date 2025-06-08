import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { matchVehicle } from './matcher';

async function main() {
  const rl = readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, '../input.txt')),
    crlfDelay: Infinity,
  });

  const results: any[] = [];

  for await (const line of rl) {
    if (line.trim()) {
      const result = await matchVehicle(line);
      results.push({
        Input: result.originalDescription,
        'Vehicle ID': result.matchedVehicleId,
        Confidence: result.confidence,
      });
    }
  }

  fs.writeFileSync('output.json', JSON.stringify(results, null, 2));
  console.log('Matching complete. See output.json');
}

main().catch(console.error);