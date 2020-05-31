import Merge from 'merge-options-default';
import { seeder_token } from './seed.constants';
import { __rest } from 'tslib';
import { SeederOptions } from '.';
import { isString } from 'is-all-utils';

/**
 * Default options for decorators
 */
const defaultOptions: Omit<SeederOptions, 'model'> = {
   unique: [],
   containsForeignKeys: false,
};

/**
 * @author Yoni Calsin <helloyonicb@gmail.com>
 * @param options SeederOptions
 */
export function Seeder(options: SeederOptions) {
   return (target: Function) => {
      options = Merge(defaultOptions, options, {
         modelName: (options as any)?.model?.name || options.model,
         unique: isString(options.unique)
            ? [options.unique]
            : options.unique || [],
         seedName: target.name,
      }) as any;

      options = __rest(options, ['model']);
      Reflect.defineMetadata(seeder_token.decorator, options, target);
   };
}
