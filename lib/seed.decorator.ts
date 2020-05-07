import { Model } from 'sequelize-typescript';
import Merge from 'merge-options-default';
import { seeder_token } from './seed.constants';
import { __rest } from 'tslib';
import { SeederModuleOptions } from './interfaces';

const defaultOptions = {
   unique: [],
};

interface More {
   [key: string]: any;
}

export interface OnSeederInit<T = More> {
   run(options: SeederModuleOptions): (T | More)[];
   everyone?(item: More | T): More | T;
}

interface SeederOptions {
   model: typeof Model;
   unique: string | string[];
}

export function Seeder(options?: SeederOptions) {
   options = Merge(defaultOptions, options, {
      modelName: options.model.name,
   }) as any;
   options = __rest(options, ['model']);

   return (target: Function) => {
      Reflect.defineMetadata(seeder_token.decorator, options, target);
   };
}
