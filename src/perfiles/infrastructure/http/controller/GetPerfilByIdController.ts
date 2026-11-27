import { Request, Response } from 'express';
import { GetPerfilById } from '../../../application/usecase/GetPerfilById';

export class GetPerfilByIdController {
  constructor(private readonly getPerfilById: GetPerfilById) {}

  async handle(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ success: false, error: 'ID inválido' });
      return;
    }

    const result = await this.getPerfilById.execute(id);
    if (!result.success) {
      res.status(result.notFound ? 404 : 500).json({ success: false, error: result.error });
      return;
    }
    res.status(200).json({ success: true, data: result.data });
  }
}
