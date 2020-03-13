import { Module, DynamicModule } from '@nestjs/common';
import { SeederService } from './seed.service';
import { SEEDER_SERVICE_TOKEN, SEEDER_OPTIONS } from './seed.constants';
import { SeederModuleOptions } from './interfaces';
import { createSeederProviders } from './seed.providers';
import { SequelizeOptions } from 'sequelize-typescript';
import { DEFAULT_CONNECTION_NAME } from '@nestjs/sequelize/dist/sequelize.constants';
import { SeederItem } from './interfaces';
import { Merge } from 'merge-options-default';
import { defaultOptions } from './utils/merge-defaults.util';

@Module({
   providers: [
      {
         provide: SeederService,
         useExisting: SEEDER_SERVICE_TOKEN,
      },
   ],
   exports: [SeederService],
})
export class SeederModule {
   static forRoot(options: SeederModuleOptions = {}): DynamicModule {
      options = Merge(defaultOptions, options);
      const providers = [
         {
            provide: SEEDER_OPTIONS,
            useValue: options,
         },
         SeederService,
      ];
      return {
         module: SeederModule,
         providers: [...providers],
         global: options.isGlobal,
         exports: [...providers],
      };
   }
   static forFeature(
      seeds: SeederItem[] = [],
      connection: SequelizeOptions | string = DEFAULT_CONNECTION_NAME,
   ): DynamicModule {
      const providers = createSeederProviders(seeds, connection);
      return {
         module: SeederModule,
         providers: [SeederService, ...providers],
         exports: [SeederService, ...providers],
      };
   }
}
