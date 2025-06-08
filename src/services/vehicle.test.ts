import { VehicleRepository } from '../repository/vehicle';
import { VehicleService } from './vehicle';

describe('Vehicle Service', () => {
  const mockVehicles = [
    {
      id: '6244675534979072',
      make: 'Toyota',
      model: 'Camry',
      badge: 'Ascent',
      transmission_type: 'Automatic',
      fuel_type: 'Hybrid-Petrol',
      drive_type: 'Front Wheel Drive',
      listing_count: '5',
    },
    {
      id: '6450252131336192',
      make: 'Toyota',
      model: 'Camry',
      badge: 'Ascent',
      transmission_type: 'Automatic',
      fuel_type: 'Petrol',
      drive_type: 'Front Wheel Drive',
      listing_count: '8',
    },
  ];
  const mockPool = {
    query: jest.fn().mockResolvedValue({
      rows: mockVehicles,
    }),
  };
  const vehicleRepository = new VehicleRepository(mockPool);
  const vehicleService = new VehicleService(vehicleRepository);

  it('should match a hybrid Toyota Camry', async () => {
    const result = await vehicleService.getTheBestMatch(
      'Toyota Camry Ascent Automatic Hybrid-Petrol',
    );
    expect(result.matchedVehicleId).toBe('6244675534979072');
    expect(result.confidenceScore).toBeGreaterThan(6);
  });

  it('should pick vehicle with most listings among best matches', async () => {
    const result = await vehicleService.getTheBestMatch('Toyota Camry Ascent Automatic');
    expect(result.matchedVehicleId).toBe('6450252131336192');
  });
});
