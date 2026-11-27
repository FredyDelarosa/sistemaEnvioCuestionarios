import { Perfil } from '../model/Perfil';

export interface IPerfilesRepository {
  getAll(): Promise<Perfil[]>;
  getById(id: number): Promise<Perfil | null>;
}
