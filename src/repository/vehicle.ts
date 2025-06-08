import { Pool } from 'pg';
import { Vehicle } from './dto';

export class VehicleRepository {
  constructor(private pool: Pool) {}

  async getAll(): Promise<Vehicle[]> {
    const { rows } = await this.pool.query(`
      SELECT v.*, COUNT(l.id) AS listing_count
      FROM vehicle v
      LEFT JOIN listing l ON v.id = l.vehicle_id
      GROUP BY v.id
    `);

    return rows;
  }
}
