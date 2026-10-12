import { IUsuariosInternosRepository } from '../../domain/port/IUsuariosInternosRepository';
import { InternalUser, UpdateInternalUserInput } from '../../domain/model/InternalUser';
import { puedeAdministrarRol, MENSAJE_SIN_PERMISO } from '../../domain/policy/PoliticaGestionUsuarios';

export interface UpdateUsuarioInternoResult {
  success: boolean;
  data?: InternalUser;
  error?: string;
  forbidden?: boolean;
}

export class UpdateUsuarioInterno {
  constructor(private readonly repository: IUsuariosInternosRepository) { }

  async execute(
    id_usuario: number,
    input: UpdateInternalUserInput,
    actorRol: string
  ): Promise<UpdateUsuarioInternoResult> {
    try {
      const actual = await this.repository.getUserById(id_usuario);
      if (actual && !puedeAdministrarRol(actorRol, actual.rol_nombre)) {
        return { success: false, error: MENSAJE_SIN_PERMISO, forbidden: true };
      }

      if (input.id_rol !== undefined) {
        const roles = await this.repository.getRoles();
        const rolNuevo = roles.find((r) => r.id_rol === Number(input.id_rol));
        if (rolNuevo && !puedeAdministrarRol(actorRol, rolNuevo.nombre)) {
          return { success: false, error: MENSAJE_SIN_PERMISO, forbidden: true };
        }
      }

      const updated = await this.repository.updateUser(id_usuario, input);

      if (!updated) {
        return {
          success: false,
          error: 'No se pudo actualizar el usuario',
        };
      }

      const usuario = await this.repository.getUserById(id_usuario);

      if (!usuario) {
        return {
          success: false,
          error: 'Usuario no encontrado después de actualizar',
        };
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