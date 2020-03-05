import { SequelizeOptions } from 'sequelize-typescript';
import { Provider } from '@nestjs/common';
import { getConnectionToken } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize/types';
import { isString } from 'util';
import { SeederItem } from './interfaces';
import { SeederService } from './seed.service';

export function createSeederProviders(
   seeds?: SeederItem[],
   connection?: SequelizeOptions | string,
): Provider[] {
   const providers = (seeds || []).map(
      (seed: SeederItem): Provider => {
         return {
            provide: seed.schema.name,
            useFactory: async (
               connection: Sequelize,
               seederService: SeederService,
            ) => {
               const modelName = seed.model.name;
               const schema = new seed.schema();
               const model = connection.models[modelName];
               let uniques = Reflect.getMetadata('unique', seed.schema);
               seederService.setModel(modelName);
               if (isString(uniques)) {
                  uniques = [uniques];
               }
               if (schema.autoCreated) {
                  let data: any[];
                  data = schema.autoCreated();
                  seederService.autoCreated(data, uniques);
               }
               if (schema.created) {
                  // schema.created(model);
               }
            },
            inject: [getConnectionToken(connection), SeederService],
         };
      },
   );

   return [...providers];
}
