import { Request, Response, NextFunction } from 'express';
import { CreateFormularioCompleto } from '../../../application/usecase/CreateFormularioCompleto';
import { handlePostError } from '../../../../core/middleware/errorHandler';

/**
 * Fix B1: POST /api/formulario/completo
 * Recibe el formulario completo y lo guarda todo junto (transaccional).
 * Body esperado:
 * {
 *   "data": {
 *     "type": "formularios",
 *     "attributes": {
 *       "titulo": "...", "descripcion": "...", "is_active": true,
 *       "preguntas": [
 *         { "texto_pregunta": "...", "id_tipo_pregunta": 1, "es_obligatoria": false,
 *           "opciones": [ { "texto_opcion": "...", "etiqueta": "A" } ] }
 *       ]
 *     }
 *   }
 * }
 */
export const createFormularioCompletoController = (
  createFormularioCompleto: CreateFormularioCompleto
) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    if (!req.body?.data?.attributes) {
      res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'Formato JSON API esperado' } });
      return;
    }

    const attrs = req.body.data.attributes;
    const created = await createFormularioCompleto.execute({
      titulo: attrs.titulo,
      descripcion: attrs.descripcion ?? null,
      is_active: attrs.is_active,
      preguntas: attrs.preguntas,
    });

    res.status(201).json({
      data: {
        type: 'formularios',
        id: created.id_formulario?.toString(),
        attributes: {
          titulo: created.titulo,
          descripcion: created.descripcion,
          is_active: created.is_active,
          fecha_creacion: created.fecha_creacion,
        },
      },
    });
  } catch (error: any) {
    if (error.message.includes('Ya existe')) {
      res.status(409).json({ error: { status: '409', title: 'Conflict', detail: error.message } });
    } else if (
      error.message.includes('obligatorio') ||
      error.message.includes('vacío') ||
      error.message.includes('is_active') ||
      error.message.includes('al menos una pregunta') ||
      error.message.includes('no tiene texto') ||
      error.message.includes('tipo de pregunta inválido') ||
      error.message.includes('opción múltiple') ||
      error.message.includes('descripción')
    ) {
      res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: error.message } });
    } else {
      handlePostError(error, req, res, next);
    }
  }
};
