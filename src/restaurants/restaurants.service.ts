import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import { User } from '../users/user.entity';
import { UserRole } from '../common/enums/user-role.enum';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Restaurant } from 'src/restaurants/restaurant.entity';

@Injectable()
export class RestaurantsService {
  constructor(private readonly em: EntityManager) {}

  async create(dto: CreateRestaurantDto) {
    const owner = await this.em.findOne(User, { id: dto.ownerId });

    if (!owner) {
      throw new NotFoundException('Owner user not found');
    }

    if (owner.role !== UserRole.RESTAURANT) {
      throw new BadRequestException('User is not a restaurant owner');
    }

    const restaurant = this.em.create(Restaurant, {
      name: dto.name,
      owner,
      createdAt: new Date(),
    });

    await this.em.persistAndFlush(restaurant);
    return restaurant;
  }

  async findAll() {
    return this.em.find(Restaurant, {}, { populate: ['owner'] });
  }

  async findOne(id: number) {
    const restaurant = await this.em.findOne(
      Restaurant,
      { id },
      { populate: ['owner'] },
    );

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return restaurant;
  }

  async update(id: number, dto: UpdateRestaurantDto) {
    const restaurant = await this.findOne(id);
    this.em.assign(restaurant, dto);
    await this.em.flush();
    return restaurant;
  }
}