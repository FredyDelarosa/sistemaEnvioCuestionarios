import { Formulario } from '../model/form';

// B11: filtros para listar formularios
export type BusquedaFormularios = { activo?: boolean; q?: string; page: number; limit: number };

export interface FormularioRepository {
  create(data: Omit<Formulario, 'id_formulario' | 'fecha_creacion'>): Promise<Formulario>;
  update(id: number, data: Partial<Formulario>): Promise<Formulario>;
  delete(id: number): Promise<void>;
  findById(id: number): Promise<Formulario | null>;
  findAll(): Promise<Formulario[]>;
  search(opciones: BusquedaFormularios): Promise<{ data: Formulario[]; total: number }>;
  findActiveByTitle(title: string): Promise<Formulario | null>;

  // Asociación con preguntas (pivot formulacion_pregunta)
  addQuestion(formularioId: number, preguntaId: number, orden: number): Promise<void>;
  removeQuestion(formularioId: number, preguntaId: number): Promise<void>;
  isQuestionAssociated(formularioId: number, preguntaId: number): Promise<boolean>;
  getQuestionsByForm(formularioId: number): Promise<Array<{ id_pregunta: number; orden: number }>>;
  countFormsByQuestionId(preguntaId: number): Promise<number>;

  // Validaciones de orden
  hasDuplicateOrder(formularioId: number, orden: number): Promise<boolean>;
  getMaxOrder(formularioId: number): Promise<number | null>;

  // Comprobaciones adicionales
  formHasEncuestaActive(formularioId: number): Promise<boolean>;
  preguntaExists(preguntaId: number): Promise<boolean>;

  getQuestionsWithOptionsByFormId(formularioId: number): Promise<any[]>;
  
  // Método para obtener preguntas formateadas para el endpoint público
  getQuestionsFormattedForPublic(formularioId: number): Promise<Array<{
    id: string;
    tipo: string;
    texto: string;
    es_obligatoria: boolean;
    orden: number;
    opciones: Array<{ id: string; valor: string }>;
  }>>;
}
