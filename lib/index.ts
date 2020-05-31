/*!
 * nestjs-sequelize-seeder v1.1.1 (https://github.com/yoicalsin/nestjs-sequelize-seeder)
 * Copyright 2020 The nestjs-sequelize-seeder Authors
 * Copyright 2020 Yoni Calsin.
 * Licensed under MIT (https://github.com/yoicalsin/nestjs-sequelize-seeder/blob/master/LICENSE)
 */

import { Model } from 'sequelize-typescript';
import { DEFAULT_CONNECTION_NAME } from '@nestjs/sequelize/dist/sequelize.constants';

// For global
export interface More {
   [key: string]: any;
}

// For module
export interface SeederModuleOptions {
   isGlobal?: boolean;
   logging?: boolean;
   disabled?: boolean;
   runOnlyIfTableIsEmpty?: boolean;
   connection?: string;
   enableAutoId?: boolean;
   autoIdFieldName?: string;
   disableEveryOne?: boolean;
   foreignTimeout?: number;
}

// For decorators
export interface OnSeederInit<T = More> {
   run(options: SeederModuleOptions): (T | More)[];
   everyone?(item: More | T, index: number): More | T;
}

export interface SeederOptions extends Omit<SeederModuleOptions, 'isGlobal'> {
   model: typeof Model | string;
   unique?: string | string[];
   containsForeignKeys?: boolean;
}

// Default data
export const defaultOptions: SeederModuleOptions = {
   isGlobal: true,
   logging: true,
   disabled: false,
   runOnlyIfTableIsEmpty: false,
   connection: DEFAULT_CONNECTION_NAME,
   enableAutoId: true,
   autoIdFieldName: 'id',
   disableEveryOne: false,
   foreignTimeout: 2000,
};

export * from './seed.module';
export * from './seed.service';
export * from './seed.decorator';
