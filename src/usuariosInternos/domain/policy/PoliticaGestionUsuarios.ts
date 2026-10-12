// Qué roles puede administrar (crear, ver, editar, desactivar, restablecer contraseña) cada rol.
// Super admin administra a todos; Dirección de Vinculación solo a Directores de Programa Educativo.
const ROLES_ADMINISTRABLES: Record<string, string[]> = {
    super_admin: ['super_admin', 'director_vinculacion', 'director_programa_educativo'],
    director_vinculacion: ['director_programa_educativo'],
    director_programa_educativo: [],
};

export const MENSAJE_SIN_PERMISO =
    'No tiene permiso para administrar usuarios con ese rol';

export function puedeAdministrarRol(actorRol: string, rolObjetivo: string): boolean {
    return (ROLES_ADMINISTRABLES[actorRol] ?? []).includes(rolObjetivo);
}