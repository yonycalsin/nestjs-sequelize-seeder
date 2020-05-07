import Merge from 'merge-options-default';
import { seeder_token } from './seed.constants';
import { __rest } from 'tslib';
import { SeederOptions } from '.';

const defaultOptions = {
   unique: [],
};

export function Seeder(options?: SeederOptions) {
   options = Merge(defaultOptions, options, {
      modelName: options.model.name,
   }) as any;
   options = __rest(options, ['model']);

   return (target: Function) => {
      Reflect.defineMetadata(seeder_token.decorator, options, target);
   };
}
