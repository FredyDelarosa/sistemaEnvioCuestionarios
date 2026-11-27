import { IUsuariosInternosRepository } from '../../domain/port/IUsuariosInternosRepository';
import { InternalUser } from '../../domain/model/InternalUser';
import { puedeAdministrarRol, MENSAJE_SIN_PERMISO } from '../../domain/policy/PoliticaGestionUsuarios';

export interface GetUsuarioInternoByIdResult {
  success: boolean;
  data?: InternalUser;
  error?: string;
  forbidden?: boolean;
}

export class GetUsuarioInternoById {
  constructor(private readonly repository: IUsuariosInternosRepository) { }

  async execute(id_usuario: number, actorRol: string): Promise<GetUsuarioInternoByIdResult> {
    try {
      const usuario = await this.repository.getUserById(id_usuario);

      if (!usuario) {
        return {
          success: false,
          error: 'Usuario no encontrado',
        };
      }

      if (!puedeAdministrarRol(actorRol, usuario.rol_nombre)) {
        return { success: false, error: MENSAJE_SIN_PERMISO, forbidden: true };
      }

      return {
        success: true,
        data: usuario,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }
}