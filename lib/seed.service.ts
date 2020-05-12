import { Injectable, Inject, Logger } from '@nestjs/common';
import { seeder_token } from './seed.constants';
import { Sequelize } from 'sequelize-typescript';
import { ModelCtor, Model } from 'sequelize/types';
import { SeederModuleOptions, More } from '.';

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

   /**
    * @author Yoni Calsin <helloyonicb@gmail.com>
    * @description This is the main method to create a seed!
    * @param connection Sequelize
    * @param seed Object | Function
    * @param seedData More
    */
   async onSeedInit(connection: Sequelize, seed: any, seedData: More) {
      if (this.options.disabled) {
         return;
      }

      /**
       * @author Gabriel Vieira <gabrielvt14@hotmail.com>
       * @description Execute this if property `runOnlyIfTableIsEmpty` is true
       */
      if (this.options.runOnlyIfTableIsEmpty) {
         if (await this.verifyIfTableIsEmpty()) return;
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

   /**
    * @author Yoni Calsin <helloyonicb@gmail.com>
    * @description Check if the object exists !
    * @param where More
    */
   private async isUnique(where: More): Promise<boolean> {
      try {
         const data = await this.model.findOne({ where });
         if (data) return true;
         return false;
      } catch (err) {
         throw new Error(`[SeederService] ${err.original.sqlMessage}`);
      }
   }

   /**
    * @author Gabriel Vieira <gabrielvt14@hotmail.com>
    * @description Check if the table is empty
    */
   private async verifyIfTableIsEmpty(): Promise<boolean> {
      try {
         const data = await this.model.count();
         if (data > 0) return true;
         return false;
      } catch (err) {
         throw new Error(`[SeederService] ${err.original.sqlMessage}`);
      }
   }

   /**
    * @author Yoni Calsin <helloyonicb@gmail.com>
    * @description Create the object if it does not exist, and display a success message !
    * @param item More
    */
   private async createItem(item: More): Promise<void> {
      try {
         this.model.create(item).then(res => {
            this.options.logging &&
               this.log.log(
                  `Created correctly, '${Object.values(res).join(
                     ', ',
                  )}' with 'nestjs-sequelize-seeder' !`,
               );
         });
      } catch (err) {
         throw new Error(`[SeederService] ${err.original.sqlMessage}`);
      }
   }

   /**
    * @author Yoni Calsin <helloyonicb@gmail.com>
    * @description This function executes all the creation and alteration code of all the objects !
    */
   private async initialized(): Promise<void> {
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
