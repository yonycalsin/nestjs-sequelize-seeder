export * from './seed-decorator';
export * from './seed-module-options.interface';

export interface SeederItem {
   model: Function;
   schema: any;
}

export interface SeederMetadata {
   unique?: string | string[];
}
