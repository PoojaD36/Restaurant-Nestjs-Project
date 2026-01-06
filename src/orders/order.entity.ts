import { Entity, PrimaryKey, Property, ManyToOne, Enum, OneToMany, Collection } from '@mikro-orm/core';
import { User } from '../users/user.entity';
import { Restaurant } from '../restaurants/restaurant.entity';
import { OrderStatus } from '../common/enums/order-status.enum';
import { OrderItem } from './order-item.entity';

@Entity()
export class Order {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => User)
  customer!: User;

  @ManyToOne(() => Restaurant)
  restaurant!: Restaurant;

  @Enum(() => OrderStatus)
  status: OrderStatus = OrderStatus.PENDING;

  @Property()
  totalAmount!: number;

  @Property({ nullable: true })
  estimatedTime?: number; // minutes

  @ManyToOne(() => User, { nullable: true })
  deliveryStaff?: User;

  @OneToMany(() => OrderItem, (item) => item.order)
  items = new Collection<OrderItem>(this);

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;
}
