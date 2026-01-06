import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import { MenuItem } from './menu-item.entity';
import { Restaurant } from '../restaurants/restaurant.entity';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class MenuService {
  constructor(private readonly em: EntityManager) {}

  async create(restaurantId: number, ownerId: number, dto: CreateMenuItemDto) {
    const restaurant = await this.em.findOne(Restaurant, {
      id: restaurantId,
      owner: ownerId,
    });

    if (!restaurant) {
      throw new ForbiddenException('You do not own this restaurant');
    }

    const menuItem = this.em.create(MenuItem, {
      name: dto.name,
      price: dto.price,
      isAvailable: dto.isAvailable ?? true,
      restaurant,
      createdAt: new Date(),
    });

    await this.em.persistAndFlush(menuItem);
    return menuItem;
  }

  async findByRestaurant(restaurantId: number) {
    return this.em.find(MenuItem, { restaurant: restaurantId });
  }

  async update(id: number, ownerId: number, dto: UpdateMenuItemDto) {
    const menuItem = await this.em.findOne(
      MenuItem,
      { id },
      {
        populate: ['restaurant'],
      },
    );

    if (!menuItem) {
      throw new NotFoundException('Menu item not found');
    }

    if (menuItem.restaurant.owner.id !== ownerId) {
      throw new ForbiddenException('You do not own this menu item');
    }

    this.em.assign(menuItem, dto);
    await this.em.flush();
    return menuItem;
  }
}
