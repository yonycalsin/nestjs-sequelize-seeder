import { Injectable, Inject } from '@nestjs/common';
import { SEEDER_OPTIONS } from './seed.constants';
import { SeederModuleOptions } from './interfaces/seed-module-options.interface';
import { Sequelize } from 'sequelize-typescript';
import { ModelCtor, Model } from 'sequelize/types';
import chalk from 'chalk';

@Injectable()
export class SeederService {
   private model: ModelCtor<Model<any, any>>;
   constructor(
      @Inject(SEEDER_OPTIONS)
      private options: SeederModuleOptions, // private sequelize: Sequelize,
      private sequelize: Sequelize,
   ) {}
   setModel(name: string) {
      this.model = this.sequelize.model(name);
   }
   async isUnique(where) {
      return await this.model.count({ where }).then(count => {
         if (count > 0) {
            return false;
         }
         return true;
      });
   }
   async autoCreated(data: any[], meta: string[] = []) {
      for (const v of data) {
         let item = {};
         const is = meta.length > 0;
         let isExist = null;
         if (is) {
            for (const vv of meta) {
               item[vv] = v[vv];
               isExist = await this.isUnique(item);
               if (isExist) {
                  this.model.create(v);
               }
            }
         } else {
            this.model.create(v).catch(err => {
               const msg = `${chalk.green('[Seeder]')} ${chalk.redBright(
                  '[ERROR...]',
               )} ${chalk.redBright(err.parent.sqlMessage)}`;
               console.log(msg);
            });
         }
      }
   }
}
