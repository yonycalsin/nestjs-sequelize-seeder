import { SeederModuleOptions } from '../interfaces';
import { DEFAULT_CONNECTION_NAME } from '@nestjs/sequelize/dist/sequelize.constants';

const defaultOptions: SeederModuleOptions = {
   isGlobal: true,
   connection: DEFAULT_CONNECTION_NAME,
};

export function mergeDefaults(
   options: SeederModuleOptions,
   defaults: SeederModuleOptions = defaultOptions,
) {
   return {
      ...defaults,
      ...options,
   };
}
