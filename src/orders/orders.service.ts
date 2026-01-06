import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';

import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { MenuItem } from '../menu/menu-item.entity';
import { User } from '../users/user.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatus } from 'src/common/enums/order-status.enum';
import { ORDER_STATUS_FLOW } from './order-status.rules';
import { UserRole } from 'src/common/enums/user-role.enum';
import { NotificationsGateway } from 'src/notifications/notifications.gateway';

@Injectable()
export class OrdersService {
  constructor(
    private readonly em: EntityManager,
    private readonly notifications: NotificationsGateway,
  ) {}

  async createOrder(customerId: number, dto: CreateOrderDto) {
    if (!dto.items.length) {
      throw new BadRequestException('Cart is empty');
    }

    const menuItemIds = dto.items.map((i) => i.menuItemId);

    const menuItems = await this.em.find(
      MenuItem,
      {
        id: { $in: menuItemIds },
        isAvailable: true,
      },
      { populate: ['restaurant'] },
    );

    if (menuItems.length !== dto.items.length) {
      throw new BadRequestException('Invalid menu item in cart');
    }

    // Ensure all items belong to one restaurant
    const restaurantId = menuItems[0].restaurant.id;
    const sameRestaurant = menuItems.every(
      (m) => m.restaurant.id === restaurantId,
    );

    if (!sameRestaurant) {
      throw new BadRequestException(
        'All items must be from the same restaurant',
      );
    }

    const customer = await this.em.findOneOrFail(User, customerId);

    let totalAmount = 0;

    const order = this.em.create(Order, {
      customer,
      restaurant: menuItems[0].restaurant,
      status: OrderStatus.PENDING,
      totalAmount: 0,
      createdAt: new Date(),
    });

    for (const item of dto.items) {
      const menuItem = menuItems.find((m) => m.id === item.menuItemId)!;

      totalAmount += menuItem.price * item.quantity;

      const orderItem = this.em.create(OrderItem, {
        order,
        menuItem,
        quantity: item.quantity,
        price: menuItem.price,
      });

      order.items.add(orderItem);
    }

    order.totalAmount = totalAmount;

    await this.em.persistAndFlush(order);
    return order;
  }

  async updateOrderStatus(orderId: number, newStatus: OrderStatus, user: any) {
    const order = await this.em.findOne(Order, orderId, {
      populate: ['restaurant.owner', 'customer'],
    });

    if (!order) {
      throw new BadRequestException('Order not found');
    }

    // Role-based permission
    if (
      [
        OrderStatus.CONFIRMED,
        OrderStatus.PREPARING,
        OrderStatus.READY,
      ].includes(newStatus) &&
      user.role !== 'RESTAURANT'
    ) {
      throw new ForbiddenException('Only restaurant can update this status');
    }
    if (
      user.role === UserRole.RESTAURANT &&
      order.restaurant.owner.id !== Number(user.userId)
    ) {
      throw new ForbiddenException(
        'You are not allowed to update orders of this restaurant',
      );
    }

    // Delivery-only transitions
    if (
      [OrderStatus.OUT_FOR_DELIVERY, OrderStatus.DELIVERED].includes(
        newStatus,
      ) &&
      user.role !== 'DELIVERY'
    ) {
      throw new ForbiddenException(
        'Only delivery staff can update this status',
      );
    }

    // Validate lifecycle flow
    const allowed = ORDER_STATUS_FLOW[order.status];
    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot change status from ${order.status} to ${newStatus}`,
      );
    }

    order.status = newStatus;
    await this.em.flush();

    // NOTIFICATIONS
    if (newStatus === OrderStatus.CONFIRMED) {
      this.notifications.notifyUser(order.customer.id, 'order.confirmed', {
        orderId: order.id,
      });
    }

    if (newStatus === OrderStatus.READY) {
      this.notifications.notifyUser(order.customer.id, 'order.ready', {
        orderId: order.id,
      });
    }

    if (newStatus === OrderStatus.OUT_FOR_DELIVERY) {
      this.notifications.notifyUser(
        order.customer.id,
        'order.out_for_delivery',
        { orderId: order.id },
      );
    }

    if (newStatus === OrderStatus.DELIVERED) {
      this.notifications.notifyUser(order.customer.id, 'order.delivered', {
        orderId: order.id,
      });
    }

    return order;
  }

  async assignDeliveryStaff(
    orderId: number,
    deliveryStaffId: number,
    user: any,
  ) {
    const order = await this.em.findOne(Order, orderId, {
      populate: ['restaurant', 'restaurant.owner'],
    });

    if (!order) throw new BadRequestException('Order not found');

    if (order.restaurant.owner.id !== user.id) {
      throw new ForbiddenException('Not your restaurant');
    }

    if (order.status !== OrderStatus.READY) {
      throw new BadRequestException(
        'Delivery can be assigned only when order is READY',
      );
    }

    const deliveryStaff = await this.em.findOne(User, {
      id: deliveryStaffId,
      role: UserRole.DELIVERY,
    });

    if (!deliveryStaff) {
      throw new BadRequestException('Invalid delivery staff');
    }

    order.deliveryStaff = deliveryStaff;
    await this.em.flush();

    // notify delivery staff
    this.notifications.notifyUser(deliveryStaff.id, 'delivery.assigned', {
      orderId: order.id,
    });

    return order;
  }
}
