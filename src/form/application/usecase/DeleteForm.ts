import { FormularioRepository } from '../../domain/port/formRepository';

export class DeleteFormulario {
  constructor(private repo: FormularioRepository) {}

  async execute(id: number): Promise<void> {
    const existing = await this.repo.findById(id);
    if (!existing) throw new Error('El formulario no existe');

    // Fix B2: no se puede eliminar si el formulario ya se usó, es decir, si
    // está asociado a cualquier encuesta (activa o no) o si tiene respuestas
    // de egresados. Borrarlo perdería esa información, así que se responde con
    // un conflicto (409) y se sugiere desactivarlo en su lugar.
    const [hasEncuesta, hasRespuesta] = await Promise.all([
      this.repo.formHasEncuesta(id),
      this.repo.formHasRespuesta(id),
    ]);
    if (hasEncuesta || hasRespuesta) {
      throw new Error('Este formulario ya se usó (tiene encuestas o respuestas); desactívalo en su lugar.');
    }

    await this.repo.delete(id);
  }
}
