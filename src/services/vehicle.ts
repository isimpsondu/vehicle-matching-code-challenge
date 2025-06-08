import { Vehicle } from '../repository/dto';
import { VehicleRepository } from '../repository/vehicle';
import { computeSimilarityScore, normalizeText, scaleToConfidence } from './util';

export interface VehicleMatchResult {
  originalDescription: string;
  matchedVehicleId?: string;
  confidenceScore?: number;
}

export class VehicleService {
  constructor(private vehicleRepo: VehicleRepository) {}

  async getTheBestMatch(vehicleTitle: string): Promise<VehicleMatchResult> {
    const inputText = normalizeText(vehicleTitle);

    const vehicles = await this.vehicleRepo.getAll();

    let bestMatches: Vehicle[] = [];
    let bestScore = 0;

    for (const vehicle of vehicles) {
      const vehicleText = normalizeText(
        `${vehicle.make} ${vehicle.model} ${vehicle.badge} ${vehicle.fuel_type} ${vehicle.transmission_type} ${vehicle.drive_type}`,
      );
      const score = computeSimilarityScore(inputText, vehicleText);

      if (score > bestScore) {
        bestScore = score;
        bestMatches = [vehicle];
      } else if (score === bestScore) {
        bestMatches.push(vehicle);
      }
    }

    // If multiple best matches, return the one with most listings
    const bestMatch = bestMatches.reduce((max, curr) => {
      return !max || parseInt(curr.listing_count) > parseInt(max.listing_count) ? curr : max;
    }, null);
    const confidenceScore = bestMatch ? scaleToConfidence(bestScore) : undefined;

    return {
      originalDescription: vehicleTitle,
      matchedVehicleId: bestMatch?.id,
      confidenceScore,
    };
  }
}
