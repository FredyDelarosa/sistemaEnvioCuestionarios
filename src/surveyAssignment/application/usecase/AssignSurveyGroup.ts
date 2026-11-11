import { AssignmentRepository } from '../../domain/port/assignmentRepository';
import { MysqlConnection } from '../../../core/db/mysl/connection';

export type ModoAsignacion = 'sumar' | 'reemplazar';

export class AssignSurveyGroup {
  constructor(private assignmentRepo: AssignmentRepository) { }

  async execute(
    idEncuesta: number,
    idGroup: number,
    modo: ModoAsignacion = 'sumar'
  ): Promise<{ created: number; reactivated: number; skipped: number; removed: number }> {
    let removed = 0;

    // Reemplazar: se desactiva a los actuales (sin marcarlos como quitados a mano)
    if (modo === 'reemplazar') {
      const [activos]: [any[], any] = await MysqlConnection.query(
        'SELECT COUNT(*) AS total FROM encuesta_egresados WHERE id_encuesta = ? AND is_active = 1',
        [idEncuesta]
      );
      removed = Number(activos[0]?.total ?? 0);
      await this.assignmentRepo.deactivateAllAssignmentsForSurvey(idEncuesta);
    }

    // Obtener todos los egresados del grupo
    const [rows]: [any[], any] = await MysqlConnection.query(
      'SELECT id_egresado FROM grupo_miembro WHERE id_grupo = ?',
      [idGroup]
    );
    const egresados = rows.map(r => r.id_egresado);
    if (!egresados.length) return { created: 0, reactivated: 0, skipped: 0, removed };

    const result = await this.assignmentRepo.assignToGraduates(idEncuesta, egresados, { porGrupo: true });
    return { ...result, removed };
  }
}