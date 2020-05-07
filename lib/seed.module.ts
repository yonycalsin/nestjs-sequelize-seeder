import { Module, DynamicModule, Provider } from '@nestjs/common';
import { SeederService } from './seed.service';
import { seeder_token } from './seed.constants';
import { SeederModuleOptions, defaultOptions } from '.';
import { Merge } from 'merge-options-default';
import { isArray } from 'is-all-utils';
import { getConnectionToken } from '@nestjs/sequelize';

@Module({
   providers: [
      {
         provide: SeederService,
         useExisting: seeder_token.service,
      },
   ],
   exports: [SeederService],
})
export class SeederModule {
   static forRoot(options?: SeederModuleOptions): DynamicModule {
      options = Merge(defaultOptions, options);
      const providers = [
         {
            provide: seeder_token.options,
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
      seeds: Function | Function[],
      connection?: string,
   ): DynamicModule {
      !isArray(seeds) && (seeds = [seeds as Function]);
      const providers = this.createProviders(seeds as Function[], connection);

      return {
         module: SeederModule,
         providers: [SeederService, ...providers],
         exports: [SeederService, ...providers],
      };
   }

   private static createProviders(seeds: Function[], connection?: string) {
      return seeds.map(
         (seed: Function): Provider => {
            return {
               provide: seed.name,
               useFactory: async (con, service: SeederService) => {
                  const seedData = Reflect.getMetadata(
                     seeder_token.decorator,
                     seed,
                  );
                  await service.onSeedInit(con, seed, seedData);
               },
               inject: [getConnectionToken(connection), SeederService],
            };
         },
      );
   }
}
