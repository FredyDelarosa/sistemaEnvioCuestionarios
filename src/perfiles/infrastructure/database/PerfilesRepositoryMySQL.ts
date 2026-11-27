import { Pool } from 'mysql2/promise';
import { IPerfilesRepository } from '../../domain/port/IPerfilesRepository';
import { Perfil } from '../../domain/model/Perfil';

export class PerfilesRepositoryMySQL implements IPerfilesRepository {
  constructor(private readonly pool: Pool) {}

  async getAll(): Promise<Perfil[]> {
    const [rows] = await this.pool.query(
      `SELECT id_rol AS id, nombre AS name, descripcion AS description
       FROM cat_rol_usuario
       ORDER BY id_rol ASC`
    );
    return rows as Perfil[];
  }

  async getById(id: number): Promise<Perfil | null> {
    const [rows] = await this.pool.query(
      `SELECT id_rol AS id, nombre AS name, descripcion AS description
       FROM cat_rol_usuario
       WHERE id_rol = ?`,
      [id]
    );
    const results = rows as Perfil[];
    return results.length > 0 ? results[0] : null;
  }
}
