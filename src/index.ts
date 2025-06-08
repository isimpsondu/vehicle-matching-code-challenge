import fs from 'fs';
import readline from 'readline';
import path from 'path';
import { VehicleService } from './services/vehicle';
import { VehicleRepository } from './repository/vehicle';
import { pool } from './repository/db';

async function main() {
  const rl = readline.createInterface({
    input: fs.createReadStream(path.join(__dirname, '../input.txt')),
    crlfDelay: Infinity,
  });

  const results = [];
  const vehicleRepository = new VehicleRepository(pool);
  const vehicleService = new VehicleService(vehicleRepository);

  for await (const line of rl) {
    if (line.trim()) {
      const result = await vehicleService.getTheBestMatch(line);
      results.push({
        Input: result.originalDescription,
        'Vehicle ID': result.matchedVehicleId,
        Confidence: result.confidenceScore,
      });
    }
  }

  fs.writeFileSync('output.json', JSON.stringify(results, null, 2));
  console.log('Matching complete. See output.json');
}

main().catch(console.error);
