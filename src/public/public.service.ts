import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import { Restaurant } from '../restaurants/restaurant.entity';
import { MenuItem } from '../menu/menu-item.entity';

@Injectable()
export class PublicService {
  constructor(private readonly em: EntityManager) {}

  async listRestaurants() {
    return this.em.find(
      Restaurant,
      {},
      { fields: ['id', 'name'] },
    );
  }

  async getMenuByRestaurant(restaurantId: number) {
    const restaurant = await this.em.findOne(Restaurant, { id: restaurantId });

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return this.em.find(MenuItem, {
      restaurant: restaurantId,
      isAvailable: true,
    });
  }
}