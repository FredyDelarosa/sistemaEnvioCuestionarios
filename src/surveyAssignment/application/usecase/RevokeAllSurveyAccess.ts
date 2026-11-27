import { AssignmentRepository } from '../../domain/port/assignmentRepository';

export class RevokeAllSurveyAccess {
  constructor(private assignmentRepo: AssignmentRepository) {}

  // Quita a todos los participantes de la encuesta. No borra respuestas.
  async execute(idEncuesta: number): Promise<number> {
    return this.assignmentRepo.revokeAllForSurvey(idEncuesta);
  }
}
