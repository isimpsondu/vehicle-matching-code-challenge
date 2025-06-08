import { VehicleRepository } from './vehicle';

describe('Vehicle Repository', () => {
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

  it('should return all vehicles', async () => {
    const mockPool = {
      query: jest.fn().mockResolvedValue({
        rows: mockVehicles,
      }),
    };
    const vehicleRepository = new VehicleRepository(mockPool);
    const result = await vehicleRepository.getAll();
    expect(result.length).toBe(2);
  });
});
