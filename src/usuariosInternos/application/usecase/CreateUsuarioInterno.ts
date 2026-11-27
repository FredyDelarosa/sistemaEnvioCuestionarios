import { IUsuariosInternosRepository } from '../../domain/port/IUsuariosInternosRepository';
import { InternalUser, CreateInternalUserInput } from '../../domain/model/InternalUser';
import { puedeAdministrarRol, MENSAJE_SIN_PERMISO } from '../../domain/policy/PoliticaGestionUsuarios';

export interface CreateUsuarioInternoResult {
  success: boolean;
  data?: InternalUser;
  error?: string;
  forbidden?: boolean;
}

export class CreateUsuarioInterno {
  constructor(private readonly repository: IUsuariosInternosRepository) { }

  async execute(
    input: CreateInternalUserInput,
    actorRol: string
  ): Promise<CreateUsuarioInternoResult> {
    try {
      const roles = await this.repository.getRoles();
      const rolDestino = roles.find((r) => r.id_rol === Number(input.id_rol));
      if (rolDestino && !puedeAdministrarRol(actorRol, rolDestino.nombre)) {
        return { success: false, error: MENSAJE_SIN_PERMISO, forbidden: true };
      }

      this.validatePassword(input.password);

      const { id_usuario } = await this.repository.createUser(input);

      const user = await this.repository.getUserById(id_usuario);

      if (!user) {
        return {
          success: false,
          error: 'No se pudo recuperar el usuario creado',
        };
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  private validatePassword(password: string): void {
    if (password.length < 8) {
      throw new Error('La contraseña debe tener al menos 8 caracteres');
    }
    if (!/[A-Z]/.test(password)) {
      throw new Error('La contraseña debe contener al menos una mayúscula');
    }
    if (!/[0-9]/.test(password)) {
      throw new Error('La contraseña debe contener al menos un número');
    }
  }
}