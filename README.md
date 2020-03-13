<p align="center">
  <a href="https://github.com/yoicalsin/nestjs-sequelize-seeder" target="blank"><img src="https://i.ibb.co/R3M1w4n/nestjs-svg-1.png" width="120" alt="Nestjs Sequelize Seeder Logo" /></a>
</p>

<p align="center">
🌾 A simple extension library for nestjs sequelize to perform seeding.
</p>
<p align="center" style="max-width: 450px; margin: auto;">
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
   <a href="https://github.com/yoicalsin/nestjs-sequelize-seeder" title="All Contributors"><img src="https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square" /></a>
<!-- ALL-CONTRIBUTORS-BADGE:END -->
   <a href="https://github.com/yoicalsin/nestjs-sequelize-seeder"><img src="https://img.shields.io/spiget/stars/1000?color=brightgreen&label=Star&logo=github" /></a>
   <a href="https://www.npmjs.com/nestjs-sequelize-seeder" target="_blank">
   <img src="https://img.shields.io/npm/v/nestjs-sequelize-seeder" alt="NPM Version" /></a>
   <a href="https://www.npmjs.com/nestjs-sequelize-seeder" target="_blank">
   <img src="https://img.shields.io/npm/l/nestjs-sequelize-seeder" alt="Package License" /></a>
   <a href="https://www.npmjs.com/nestjs-sequelize-seeder" target="_blank">
   <img src="https://img.shields.io/npm/dm/nestjs-sequelize-seeder" alt="NPM Downloads" /></a>
   <a href="https://github.com/yoicalsin/nestjs-sequelize-seeder" target="_blank">
   <img src="https://s3.amazonaws.com/assets.coveralls.io/badges/coveralls_95.svg" alt="Coverage" /></a>
   <a href="https://github.com/yoicalsin/nestjs-sequelize-seeder"><img src="https://img.shields.io/badge/Github%20Page-nestjs.sequelize.seeder-yellow?style=flat-square&logo=github" /></a>
   <a href="https://github.com/yoicalsin"><img src="https://img.shields.io/badge/Author-Yoni%20Calsin-blueviolet?style=flat-square&logo=appveyor" /></a>
   <a href="https://twitter.com/yoicalsin" target="_blank">
   <img src="https://img.shields.io/twitter/follow/yoicalsin.svg?style=social&label=Follow"></a>
</p>

## 🌐 Description

Under the hood, nestjs-sequelize-seeder makes use of the [nest framework](https://nestjs.com/), and you also need to install [nestjs](https://nestjs.com/), and [sequelize](https://docs.nestjs.com/techniques/database#sequelize-integration) !

## 📦 Integration

To start using it, we first install the required dependencies. In this chapter we will demonstrate the use of the seeder for nestjs.

You simply need to install the package !

```ts
// We install with npm, but you could use the package manager you prefer !
npm install -S nestjs-sequelize-seeder
```

## ▶️ Getting started

Once the installation process is complete, we can import the **SeederModule** into the root **AppModule**

```ts
import { Module } from '@nestjs/common';
import { SeederModule } from 'nestjs-sequelize-seeder';

@Module({
   imports: [
      SeederModule.forRoot({
         isGlobal: true, // Default: true
         logging: true, // Default: true
      }),
   ],
})
export class AppModule {}
```

The **forRoot()** method supports all the configuration properties exposed by the seeder constuctor . In addition, there are several extra configuration properties described below.

| name     | Description                                                              | type      |
| -------- | ------------------------------------------------------------------------ | --------- |
| isGlobal | If you want the module globally (**default: _true_** )                   | _boolean_ |
| logging  | Option to display or not, the log of each creation (**default: _true_**) | _boolean_ |

### Seeder

Sequelize implements the Active Record pattern. With this pattern, you use model classes directly to interact with the database. To continue the example, we need at least one seed. Let's define the User seed.

The decorator `Seeder` receives as parameter the unique values, this has to be added if you have in the table any column as unique !

```ts
@Seeder({
   unique: ['name'] // You can add more !
})
```

```ts
import { Seeder, OnSeederInit } from 'nestjs-sequelize-seeder';

@Seeder({
   unique: ['name'],
})
export class SeedUser implements OnSeederInit {
   autoCreated() {
      const data = [
         {
            name: 'Admin',
            age: 34,
            created_at: new Date().toISOString(),
         },
         {
            name: 'Editor',
            age: 25,
            created_at: new Date().toISOString(),
         },
      ];
      return data;
   }
}
```

Next, let's look at the **UsersModule:**

```ts
import { Module } from '@nestjs/common';
import { SeederModule } from 'nestjs-sequelize-seeder';
import { SeedUser } from 'src/seeds/user.seed';
import { ModelUser } from 'src/models/user.model';

@Module({
   imports: [
      SeederModule.forFeature([
         {
            model: ModelUser,
            schema: SeedUser,
         },
      ]),
   ],
})
export class UsersModule {}
```

## ⭐ Support for

Sass-colors is an open source project licensed by [MIT](LICENSE). You can grow thanks to the sponsors and the support of the amazing sponsors. If you want to join them, [contact me here](mailto:helloyonicb@gmail.com).

## 🎩 Stay in touch

-  Author [Yoni Calsin](https://github.com/yoicalsin)
-  Twitter [Yoni Calsin](https://twitter.com/yoicalsin)

## 📜 License

Sass-colors is [MIT licensed](LICENSE).
