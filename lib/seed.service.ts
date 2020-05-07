import { Injectable, Inject, Logger } from '@nestjs/common';
import { seeder_token } from './seed.constants';
import { Sequelize } from 'sequelize-typescript';
import { ModelCtor, Model } from 'sequelize/types';
import { SeederModuleOptions } from '.';

@Injectable()
export class SeederService {
   private model: ModelCtor<Model<any, any>>;
   private con: Sequelize;
   private seed: any;
   private seedData: any;
   public log: Logger;
   private data: any;
   constructor(
      @Inject(seeder_token.options)
      public readonly options: SeederModuleOptions,
   ) {
      this.log = new Logger('SeederService', true);
   }

   async onSeedInit(connection: Sequelize, seed: any, seedData: any) {
      if (this.options.disabled) {
         return;
      }

      // Setting all objects
      this.con = connection;
      this.model = this.con.models[seedData.modelName];
      this.seed = new seed();
      this.data = this.seed.run();
      this.seedData = seedData;

      // Called all the cracks
      await this.initialized();
   }

   private async isUnique(where: any) {
      try {
         const data = await this.model.findOne({ where });
         if (data) return true;
         return false;
      } catch (err) {
         throw new Error(`[SeederService] ${err.original.sqlMessage}`);
      }
   }

   private async createItem(item: any) {
      this.model.create(item).then(res => {
         this.options.logging &&
            this.log.log(
               `Created correctly, '${Object.values(res).join(
                  ', ',
               )}' with 'nestjs-sequelize-seeder' !`,
            );
      });
   }

   private async initialized() {
      const uniques = this.seedData.unique;
      const hasUniques = uniques.length > 0;
      const isLog = this.options.logging;

      for (let [key, item] of Object.entries<any>(this.data)) {
         let alreadyitem = false;

         // Called everyone function if exist !
         if (this.seed.everyone) {
            item = this.seed.everyone(item);
         }

         if (hasUniques) {
            let uniqueData = {};
            for (const unique of uniques) {
               if (item[unique]) {
                  uniqueData[unique] = item[unique];
               } else {
                  this.log.warn(
                     `Undefined value for '${unique}' in object ${0}`,
                  );
               }
            }
            alreadyitem = await this.isUnique(uniqueData);

            if (!alreadyitem) {
               await this.createItem(item);
            } else {
               isLog &&
                  this.log.verbose(
                     `Already exists ${
                        this.seedData.modelName
                     } :${key} '${Object.values(item).join(', ')}'`,
                  );
            }
         } else {
            await this.createItem(item);
         }
      }
   }
}
