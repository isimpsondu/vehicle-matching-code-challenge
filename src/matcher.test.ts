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
      drive_type: 'Front Wheel Drive'
    }
  ];

  test('matches a hybrid Toyota Camry', async () => {
    (db.pool.query as jest.Mock).mockResolvedValue({ rows: mockVehicles });
    const result = await matchVehicle('Toyota Camry Hybrid Automatic');
    expect(result.matchedVehicleId).toBe('6244675534979072');
    expect(result.confidence).toBeGreaterThan(5);
  });
});