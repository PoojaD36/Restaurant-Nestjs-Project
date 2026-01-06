import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Order } from './order.entity';
import { MenuItem } from '../menu/menu-item.entity';

@Entity()
export class OrderItem {

  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Order)
  order!: Order;

  @ManyToOne(() => MenuItem)
  menuItem!: MenuItem;

  @Property()
  quantity!: number;

  @Property()
  price!: number; // snapshot price
}
