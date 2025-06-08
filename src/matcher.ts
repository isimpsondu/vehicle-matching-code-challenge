import { pool } from './db';
import { normalizeText, computeSimilarityScore, scaleToConfidence, vehicleToPlainText } from './util';

export async function matchVehicle(input: string): Promise<{ originalDescription: string, matchedVehicleId: string | null, confidence: number }> {
  const { rows } = await pool.query('SELECT * FROM vehicle');
  const inputText = normalizeText(input);

  let bestMatch = null;
  let bestScore = 0;

  for (const v of rows) {
    const vehicleText = vehicleToPlainText(v);
    const score = computeSimilarityScore(inputText, vehicleText);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = v;
    }
  }

  return {
    originalDescription: input,
    matchedVehicleId: bestMatch?.id || null,
    confidence: scaleToConfidence(bestScore),
  };
}
