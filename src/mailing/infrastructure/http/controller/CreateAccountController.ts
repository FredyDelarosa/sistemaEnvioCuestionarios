import { Request, Response, NextFunction } from 'express';
import { CreateAccountUseCase } from '../../../application/usecase/CreateAccountUseCase';

export const CreateAccountController = (usecase: CreateAccountUseCase) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, host, port, daily_limit, display_name } = req.body;
    const result = await usecase.execute({ email, password, host, port, daily_limit, display_name });
    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
};
