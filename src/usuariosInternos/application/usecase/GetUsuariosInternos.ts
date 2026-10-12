import { IUsuariosInternosRepository } from '../../domain/port/IUsuariosInternosRepository';
import { InternalUser } from '../../domain/model/InternalUser';
import { puedeAdministrarRol } from '../../domain/policy/PoliticaGestionUsuarios';

export interface GetUsuariosInternosResult {
  success: boolean;
  data?: InternalUser[];
  error?: string;
}

export class GetUsuariosInternos {
  constructor(private readonly repository: IUsuariosInternosRepository) { }

  async execute(
    filters: {
      id_rol?: number;
      is_active?: boolean;
      search?: string;
    } | undefined,
    actorRol: string
  ): Promise<GetUsuariosInternosResult> {
    try {
      const usuarios = await this.repository.getUsers(filters);

      return {
        success: true,
        data: usuarios.filter((u) => puedeAdministrarRol(actorRol, u.rol_nombre)),
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }
}