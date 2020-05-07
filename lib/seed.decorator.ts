import Merge from 'merge-options-default';
import { seeder_token } from './seed.constants';
import { __rest } from 'tslib';
import { SeederOptions } from '.';

/**
 * Default options for decorators
 */
const defaultOptions = {
   unique: [],
};

/**
 * @author Yoni Calsin <helloyonicb@gmail.com>
 * @param options SeederOptions
 */
export function Seeder(options?: SeederOptions) {
   options = Merge(defaultOptions, options, {
      modelName: options.model.name,
   }) as any;
   options = __rest(options, ['model']);

   return (target: Function) => {
      Reflect.defineMetadata(seeder_token.decorator, options, target);
   };
}
