import { Request, Response, NextFunction } from 'express';
import { DeleteFormulario } from '../../../application/usecase/DeleteForm';
import { handleDeleteError } from '../../../../core/middleware/errorHandler';

export const deleteFormularioController = (deleteFormulario: DeleteFormulario) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'ID debe ser numérico' }});
      return;
    }

    await deleteFormulario.execute(id);
    res.status(204).send();
  } catch (error) {
    const err = error as Error;
    // Fix B2: si el formulario ya se usó (encuestas o respuestas), es un
    // conflicto de estado, no un error de petición: se responde 409.
    if (err.message.includes('ya se usó')) {
      res.status(409).json({ error: { status: '409', title: 'Conflict', detail: err.message } });
      return;
    }
    handleDeleteError(err, req, res, next);
  }
};
