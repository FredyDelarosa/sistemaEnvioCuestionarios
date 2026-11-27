import { MysqlConnection } from '../../core/db/mysl/connection';
import { PerfilesRepositoryMySQL } from './database/PerfilesRepositoryMySQL';
import { GetPerfiles } from '../application/usecase/GetPerfiles';
import { GetPerfilById } from '../application/usecase/GetPerfilById';

export const perfilesRepository = new PerfilesRepositoryMySQL(MysqlConnection);
export const getPerfilesUsecase = new GetPerfiles(perfilesRepository);
export const getPerfilByIdUsecase = new GetPerfilById(perfilesRepository);
