export interface Formulario {
  id_formulario?: number;
  titulo: string;
  descripcion?: string | null;
  fecha_creacion?: string;
  is_active: boolean;
}

// Fix B1: estructuras para crear un formulario completo (título + preguntas +
// opciones) en una sola operación transaccional. El servidor asigna el orden.
export interface OpcionCompleta {
  texto_opcion: string;
  etiqueta?: string | null;
}

export interface PreguntaCompleta {
  texto_pregunta: string;
  id_tipo_pregunta: number;
  es_obligatoria: boolean;
  opciones: OpcionCompleta[];
}

export interface FormularioCompleto {
  titulo: string;
  descripcion?: string | null;
  is_active: boolean;
  preguntas: PreguntaCompleta[];
}

export interface TipoPreguntaRef {
  id_tipo_pregunta: number;
  nombre: string;
}
