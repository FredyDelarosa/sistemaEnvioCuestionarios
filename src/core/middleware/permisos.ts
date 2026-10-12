import { NextFunction, Request, Response } from 'express';
import { SessionRole } from '../../auth/domain/model/session';

type RolInterno = Exclude<SessionRole, 'egresado'>;

// Grupos de roles usados en la matriz de perfiles y funcionalidades.
export const SOLO_ADMIN: RolInterno[] = ['super_admin'];
export const ADMIN_Y_VINCULACION: RolInterno[] = ['super_admin', 'director_vinculacion'];
export const TODOS_INTERNOS: RolInterno[] = [
    'super_admin',
    'director_vinculacion',
    'director_programa_educativo',
];

const METODOS_DE_LECTURA = new Set(['GET', 'HEAD', 'OPTIONS']);

interface ReglaDeAcceso {
    lectura: SessionRole[];
    escritura?: SessionRole[];
    // Rutas (relativas al punto de montaje) que se dejan pasar sin sesión.
    rutasPublicas?: RegExp[];
}

export function permitir(regla: ReglaDeAcceso) {
    const escritura = regla.escritura ?? regla.lectura;
    const rutasPublicas = regla.rutasPublicas ?? [];

    return (req: Request, res: Response, next: NextFunction) => {
        if (rutasPublicas.some((patron) => patron.test(req.path))) {
            return next();
        }

        const user = req.session?.user;
        if (!user) {
            return res.status(401).json({ error: 'No autenticado' });
        }

        const rolesPermitidos = METODOS_DE_LECTURA.has(req.method) ? regla.lectura : escritura;
        if (!rolesPermitidos.includes(user.rol)) {
            return res.status(403).json({ error: 'No autorizado para este recurso' });
        }

        return next();
    };
}