import { SeederMetadata } from './interfaces';

const defaultMetadata: SeederMetadata = {
   unique: [],
};

export function Seeder(metadata: SeederMetadata = defaultMetadata) {
   return (constructor: Function) => {
      for (const key in metadata) {
         Reflect.defineMetadata(key, (metadata as any)[key], constructor);
      }
   };
}
