import { Pool } from 'pg';
import { Vehicle } from './dto';
import retry from './retry';

export class VehicleRepository {
  constructor(private pool: Pool) {}

  async getAll(): Promise<Vehicle[]> {
    try {
      const response = await retry(
        async () => {
          const { rows } = await this.pool.query(`
          SELECT v.*, COUNT(l.id) AS listing_count
          FROM vehicle v
          LEFT JOIN listing l ON v.id = l.vehicle_id
          GROUP BY v.id
        `);

          return rows;
        },
        {
          retries: 2,
          onFailedAttempt: async (error, attempt, retriesLeft) => {
            console.warn({ error, attempt, retriesLeft }, 'Failed to get all vehicles, retrying');
          },
        },
      );

      return response;
    } catch (error) {
      console.warn({ error }, 'Failed to get all vehicles');
    }

    return [];
  }
}
