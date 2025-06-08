import { pool } from './db';
import { normalizeText, computeSimilarityScore, scaleToConfidence, vehicleToPlainText } from './util';

export async function matchVehicle(input: string): Promise<{ originalDescription: string, matchedVehicleId: string | null, confidence: number }> {
  const inputText = normalizeText(input);

  // Join vehicle with listing counts
  const { rows } = await pool.query(`
    SELECT v.*, COUNT(l.id) AS listing_count
    FROM vehicle v
    LEFT JOIN listing l ON v.id = l.vehicle_id
    GROUP BY v.id
  `);

  let bestMatches: any[] = [];
  let bestScore = 0;

  for (const v of rows) {
    const vehicleText = vehicleToPlainText(v);
    const score = computeSimilarityScore(inputText, vehicleText);

    if (score > bestScore) {
      bestScore = score;
      bestMatches = [v];
    } else if (score === bestScore) {
      bestMatches.push(v);
    }
  }

  // If multiple best matches, return the one with most listings
  const bestMatch = bestMatches.reduce((max, curr) => {
    return (!max || parseInt(curr.listing_count) > parseInt(max.listing_count)) ? curr : max;
  }, null);

  return {
    originalDescription: input,
    matchedVehicleId: bestMatch?.id || null,
    confidence: scaleToConfidence(bestScore),
  };
}
