import { Request, Response } from 'express';
import { GetPerfiles } from '../../../application/usecase/GetPerfiles';

export class GetPerfilesController {
  constructor(private readonly getPerfiles: GetPerfiles) {}

  async handle(_req: Request, res: Response): Promise<void> {
    const result = await this.getPerfiles.execute();
    if (!result.success) {
      res.status(500).json({ success: false, error: result.error });
      return;
    }
    res.status(200).json({ success: true, data: result.data });
  }
}
