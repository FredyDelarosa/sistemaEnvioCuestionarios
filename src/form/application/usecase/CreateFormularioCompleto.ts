import { FormularioRepository } from '../../domain/port/formRepository';
import { Formulario, FormularioCompleto } from '../../domain/model/form';

/**
 * Fix B1: crea un formulario completo (título + preguntas + opciones) en una
 * sola operación. La escritura es transaccional en el repositorio, así que si
 * algo falla no queda nada a medias y el usuario puede reintentar sin chocar
 * con el título duplicado. El servidor asigna el orden de las preguntas.
 *
 * También valida (B10) que las preguntas de opción múltiple / casillas tengan
 * un mínimo de opciones antes de tocar la base de datos.
 */
export class CreateFormularioCompleto {
  constructor(private repo: FormularioRepository) {}

  async execute(data: FormularioCompleto): Promise<Formulario> {
    if (!data.titulo || typeof data.titulo !== 'string' || data.titulo.trim() === '') {
      throw new Error('El campo titulo es obligatorio y no puede estar vacío');
    }
    const titulo = data.titulo.trim();

    if (data.descripcion && data.descripcion.length > 500) {
      throw new Error('La descripción no puede exceder los 500 caracteres');
    }

    if (typeof data.is_active !== 'boolean') {
      throw new Error('El campo is_active debe ser true o false explícitamente');
    }

    if (!Array.isArray(data.preguntas) || data.preguntas.length === 0) {
      throw new Error('El formulario debe tener al menos una pregunta');
    }

    // No se deben registrar dos formularios activos con el mismo título
    if (data.is_active) {
      const existing = await this.repo.findActiveByTitle(titulo);
      if (existing) {
        throw new Error('Ya existe un formulario activo con el mismo título');
      }
    }

    // Catálogo de tipos para saber cuáles requieren opciones
    const tipos = await this.repo.findTiposPregunta();
    const nombrePorTipo = new Map(
      tipos.map((t) => [Number(t.id_tipo_pregunta), String(t.nombre).toLowerCase()])
    );

    const requiereOpciones = (nombre: string) =>
      nombre.includes('múltiple') || nombre.includes('multiple') ||
      nombre.includes('casilla') || nombre.includes('check');

    // Validar y normalizar cada pregunta
    const preguntas = data.preguntas.map((pregunta, index) => {
      const posicion = index + 1;

      if (!pregunta.texto_pregunta || pregunta.texto_pregunta.trim() === '') {
        throw new Error(`La pregunta ${posicion} no tiene texto`);
      }

      const idTipo = Number(pregunta.id_tipo_pregunta);
      if (!idTipo || !nombrePorTipo.has(idTipo)) {
        throw new Error(`La pregunta ${posicion} tiene un tipo de pregunta inválido`);
      }

      const opcionesValidas = (pregunta.opciones || [])
        .filter((o) => o.texto_opcion && o.texto_opcion.trim() !== '')
        .map((o) => ({
          texto_opcion: o.texto_opcion.trim(),
          etiqueta: o.etiqueta ?? null,
        }));

      if (requiereOpciones(nombrePorTipo.get(idTipo)!) && opcionesValidas.length < 2) {
        throw new Error(
          `La pregunta ${posicion} es de opción múltiple y debe tener al menos 2 opciones con texto`
        );
      }

      return {
        texto_pregunta: pregunta.texto_pregunta.trim(),
        id_tipo_pregunta: idTipo,
        es_obligatoria: !!pregunta.es_obligatoria,
        opciones: opcionesValidas,
      };
    });

    return this.repo.createComplete({
      titulo,
      descripcion: data.descripcion ?? null,
      is_active: data.is_active,
      preguntas,
    });
  }
}
