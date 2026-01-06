// import 'dotenv/config';
// import { defineConfig } from '@mikro-orm/postgresql';

// // Get the type of the defineConfig function's return value
// type MikroORMConfig = ReturnType<typeof defineConfig>;

// const config: MikroORMConfig = defineConfig({
//   entities: ['dist/**/*.entity.js'],
//   entitiesTs: ['src/**/*.entity.ts'],
//   dbName: process.env.DB_NAME,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: process.env.DB_HOST,
//   port: Number(process.env.DB_PORT),
// });

// export default config;

import 'dotenv/config';
import { defineConfig } from '@mikro-orm/postgresql';
import { Migrator } from '@mikro-orm/migrations';

type MikroORMConfig = ReturnType<typeof defineConfig>;

const config: MikroORMConfig = defineConfig({
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],

  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),

  extensions: [Migrator],

  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    allOrNothing: true,
    emit: 'ts',
  },
});

export default config;
