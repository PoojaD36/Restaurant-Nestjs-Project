import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Restaurant } from '../restaurants/restaurant.entity';

@Entity()
export class MenuItem {

  @PrimaryKey()
  id!: number;

  @Property()
  name!: string;

  @Property()
  price!: number;

  @Property({ nullable: true })
  image?: string;

  @ManyToOne(() => Restaurant)
  restaurant!: Restaurant;

  @Property({ default: true })
  isAvailable!: boolean;

  @Property({ onCreate: () => new Date() })
  createdAt!: Date;
}
