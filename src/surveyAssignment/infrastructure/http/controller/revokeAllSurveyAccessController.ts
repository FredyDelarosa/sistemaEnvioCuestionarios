import { Request, Response, NextFunction } from 'express';
import { RevokeAllSurveyAccess } from '../../../application/usecase/RevokeAllSurveyAccess';

export const revokeAllSurveyAccessController = (revokeAllSurveyAccess: RevokeAllSurveyAccess) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idEncuesta = Number(req.params.id);
    if (!Number.isInteger(idEncuesta) || idEncuesta <= 0) {
      res.status(400).json({ error: { status: '400', title: 'Bad Request', detail: 'El id de la encuesta no es válido' } });
      return;
    }
    const revocados = await revokeAllSurveyAccess.execute(idEncuesta);
    res.status(200).json({
      data: {
        type: 'revocacion',
        attributes: { id_encuesta: idEncuesta, revocados },
      },
    });
  } catch (error) {
    next(error);
  }
};
