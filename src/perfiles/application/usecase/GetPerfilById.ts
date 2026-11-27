import { IPerfilesRepository } from '../../domain/port/IPerfilesRepository';
import { Perfil } from '../../domain/model/Perfil';

export interface GetPerfilByIdResult {
  success: boolean;
  data?: Perfil;
  error?: string;
  notFound?: boolean;
}

export class GetPerfilById {
  constructor(private readonly repository: IPerfilesRepository) {}

  async execute(id: number): Promise<GetPerfilByIdResult> {
    try {
      const data = await this.repository.getById(id);
      if (!data) {
        return { success: false, notFound: true, error: 'Perfil no encontrado' };
      }
      return { success: true, data };
    } catch {
      return { success: false, error: 'No se pudo obtener el perfil' };
    }
  }
}
