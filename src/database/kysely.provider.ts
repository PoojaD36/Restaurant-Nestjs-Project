import { Provider } from '@nestjs/common';
import { Kysely, PostgresDialect } from 'kysely';
import { Pool } from 'pg';
import { DB } from './db.types';

export const KYSELY = 'KYSELY';

export const KyselyProvider: Provider = {
  provide: KYSELY,
  useFactory: () => {
    return new Kysely<DB>({
      dialect: new PostgresDialect({
        pool: new Pool({
          connectionString: process.env.DATABASE_URL,
        }),
      }),
    });
  },
};