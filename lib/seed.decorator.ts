import { Model } from 'sequelize-typescript';
import Merge from 'merge-options-default';
import { seeder_token } from './seed.constants';
import { __rest } from 'tslib';

const defaultOptions: { unique: string[] } = {
   unique: [],
};

interface Options extends Partial<typeof defaultOptions> {
   model: typeof Model;
}

export function Seeder(options?: Options) {
   options = Merge(defaultOptions, options, {
      modelName: options.model.name,
   }) as any;
   options = __rest(options, ['model']);

   return (target: Function) => {
      Reflect.defineMetadata(seeder_token.decorator, options, target);
   };
}
