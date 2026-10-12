import { IUsuariosInternosRepository } from '../../domain/port/IUsuariosInternosRepository';
import { puedeAdministrarRol, MENSAJE_SIN_PERMISO } from '../../domain/policy/PoliticaGestionUsuarios';

export interface DeactivateUsuarioInternoResult {
  success: boolean;
  error?: string;
  forbidden?: boolean;
}

export class DeactivateUsuarioInterno {
  constructor(private readonly repository: IUsuariosInternosRepository) { }

  async execute(id_usuario: number, actorRol: string): Promise<DeactivateUsuarioInternoResult> {
    try {
      const objetivo = await this.repository.getUserById(id_usuario);
      if (objetivo && !puedeAdministrarRol(actorRol, objetivo.rol_nombre)) {
        return { success: false, error: MENSAJE_SIN_PERMISO, forbidden: true };
      }

      const deactivated = await this.repository.deactivateUser(id_usuario);

      if (!deactivated) {
        return {
          success: false,
          error: 'No se pudo desactivar el usuario',
        };
      }

      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }
}