import { Router } from 'express';
import { requireRoles } from '../../../../core/middleware/authorization';
import { GetPerfilesController } from '../controller/GetPerfilesController';
import { GetPerfilByIdController } from '../controller/GetPerfilByIdController';
import { getPerfilesUsecase, getPerfilByIdUsecase } from '../../dependencies';

const getPerfilesController = new GetPerfilesController(getPerfilesUsecase);
const getPerfilByIdController = new GetPerfilByIdController(getPerfilByIdUsecase);

export const perfilesRouter = Router();

perfilesRouter.use(requireRoles(['super_admin']));

perfilesRouter.get('/', (req, res) => getPerfilesController.handle(req, res));
perfilesRouter.get('/:id', (req, res) => getPerfilByIdController.handle(req, res));