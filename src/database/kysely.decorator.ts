import { Inject } from '@nestjs/common';
import { KYSELY } from './kysely.provider';

export const InjectKysely = () => Inject(KYSELY);