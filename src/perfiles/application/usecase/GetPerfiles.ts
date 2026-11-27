import { IPerfilesRepository } from '../../domain/port/IPerfilesRepository';
import { Perfil } from '../../domain/model/Perfil';

export interface GetPerfilesResult {
  success: boolean;
  data?: Perfil[];
  error?: string;
}

export class GetPerfiles {
  constructor(private readonly repository: IPerfilesRepository) {}

  async execute(): Promise<GetPerfilesResult> {
    try {
      const data = await this.repository.getAll();
      return { success: true, data };
    } catch {
      return { success: false, error: 'No se pudo obtener el catálogo de perfiles' };
    }
  }
}
