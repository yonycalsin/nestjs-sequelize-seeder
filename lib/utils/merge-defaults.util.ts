import { SeederModuleOptions } from '../interfaces';
import { DEFAULT_CONNECTION_NAME } from '@nestjs/sequelize/dist/sequelize.constants';

export const defaultOptions: SeederModuleOptions = {
   isGlobal: true,
   logging: true,
   connection: DEFAULT_CONNECTION_NAME,
};
