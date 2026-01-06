import { Module } from '@nestjs/common';
import { KyselyProvider } from './kysely.provider';

@Module({
  providers: [KyselyProvider],
  exports: [KyselyProvider],
})
export class DatabaseModule {}