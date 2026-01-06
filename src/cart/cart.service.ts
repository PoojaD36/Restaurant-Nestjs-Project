import { BadRequestException, Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { MenuItem } from '../menu/menu-item.entity';

@Injectable()
export class CartService {
  constructor(private readonly em: EntityManager) {}

  async previewCart(dto: any) {
    if (!dto.items.length) {
      throw new BadRequestException('Cart is empty');
    }

    const menuItemIds = dto.items.map(i => i.menuItemId);

    const menuItems = await this.em.find(
      MenuItem,
      { id: { $in: menuItemIds }, isAvailable: true },
      { populate: ['restaurant'] },
    );

    if (menuItems.length !== dto.items.length) {
      throw new BadRequestException('Invalid or unavailable item in cart');
    }

    // Ensure same restaurant
    const restaurantId = menuItems[0].restaurant.id;
    const sameRestaurant = menuItems.every(
      item => item.restaurant.id === restaurantId,
    );

    if (!sameRestaurant) {
      throw new BadRequestException(
        'All items must be from the same restaurant',
      );
    }

    let total = 0;

    const items = dto.items.map(cartItem => {
      const menuItem = menuItems.find(
        m => m.id === cartItem.menuItemId,
      )!;

      const itemTotal = menuItem.price * cartItem.quantity;
      total += itemTotal;

      return {
        menuItemId: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: cartItem.quantity,
        itemTotal,
      };
    });

    return {
      restaurantId,
      items,
      totalAmount: total,
    };
  }
}