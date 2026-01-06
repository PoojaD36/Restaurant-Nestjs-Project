import { Injectable } from '@nestjs/common';
import { Kysely } from 'kysely';
import { DB } from '../database/db.types';
import { InjectKysely } from '../database/kysely.decorator';

@Injectable()
export class SearchService {
  constructor(
    @InjectKysely() private readonly db: Kysely<DB>,
  ) {}

  async searchMenuItems(query: string) {
    if (!query || query.trim().length < 2) {
      return [];
    }

    return this.db
      .selectFrom('menu_item as m')
      .innerJoin('restaurant as r', 'r.id', 'm.restaurant_id')
      .select([
        'm.id as menuItemId',
        'm.name as itemName',
        'm.price',
        'r.id as restaurantId',
        'r.name as restaurantName',
      ])
      .where('m.is_available', '=', true)
      .where('m.name', 'ilike', `%${query}%`)
      .orderBy('m.name')
      .execute();
  }
}