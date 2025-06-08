import { matchVehicle } from './matcher';
import * as db from './db';

jest.mock('./db', () => ({
  pool: { query: jest.fn() }
}));

describe('Vehicle Matcher', () => {
  const mockVehicles = [
    {
      id: '6244675534979072',
      make: 'Toyota',
      model: 'Camry',
      badge: 'Ascent',
      transmission_type: 'Automatic',
      fuel_type: 'Hybrid-Petrol',
      drive_type: 'Front Wheel Drive',
      listing_count: '5'
    },
    {
      id: '6450252131336192',
      make: 'Toyota',
      model: 'Camry',
      badge: 'Ascent',
      transmission_type: 'Automatic',
      fuel_type: 'Petrol',
      drive_type: 'Front Wheel Drive',
      listing_count: '8'
    }
  ];

  test('matches a hybrid Toyota Camry', async () => {
    (db.pool.query as jest.Mock).mockResolvedValue({ rows: mockVehicles });
    const result = await matchVehicle('Toyota Camry Ascent Automatic Hybrid-Petrol');
    expect(result.matchedVehicleId).toBe('6244675534979072');
    expect(result.confidence).toBeGreaterThan(6);
  });

  test('picks vehicle with most listings among best matches', async () => {
    (db.pool.query as jest.Mock).mockResolvedValue({ rows: mockVehicles });
    const result = await matchVehicle('Toyota Camry Ascent Automatic');
    expect(result.matchedVehicleId).toBe('6450252131336192');
  });
});