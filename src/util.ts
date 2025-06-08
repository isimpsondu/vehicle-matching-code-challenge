import stringSimilarity from 'string-similarity';

export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function computeSimilarityScore(a: string, b: string): number {
  return stringSimilarity.compareTwoStrings(a, b);
}

export function scaleToConfidence(similarity: number): number {
  return Math.round(similarity * 100) / 10; // returns 0.0 to 10.0
}

export function vehicleToPlainText(vehicle: any): string {
  return normalizeText(`${vehicle.make} ${vehicle.model} ${vehicle.badge} ${vehicle.fuel_type} ${vehicle.transmission_type} ${vehicle.drive_type}`);
}